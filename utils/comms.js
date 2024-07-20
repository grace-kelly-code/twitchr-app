"use strict";

const mailgun = require("mailgun-js");
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const _ = require("lodash");
const userStore = require("../models/user-store.js");
const logger = require("../utils/logger");
const commsUtils = require("../utils/comms");


const comms = {
  _craftMsg(updateData) {
    const birdMsgBase = "\n\n🐦 Bird Spotted!! 🐦\n\nSpotted a "
    const msgMap = {
      unknownBird: birdMsgBase + "bird, but not sure what kind \n",
      bird: birdMsgBase + "{1}\n\nRead more about it here: {2}",
      cat: "\n\n😼🚨 Cat Spotted!! 😼🚨",
      sunset: "\n\n🌛 Sunset soon, time to bring in the bird feeder",
      cold: "\n\n🥶 Temperature is {1}, you should put more food out",
      hot: "\n\n🌡️ Temperature is {1}, you should put more water out"
    }
  let msg = "";
    // craft message based on type
  if (updateData.type == "bird") {
    let birdSpecies = updateData.species;
    if(birdSpecies == "Unknown"){
      msg = msgMap.unknownBird
    } else {
      let birdUrl = "https://en.wikipedia.org/wiki/" + birdSpecies.replace(/ /g, '_');
      msg = msgMap.bird.replace("{1}", birdSpecies).replace("{2}", birdUrl);
    }
  } else if (updateData.type == "cat") {
    msg = msgMap.cat
  } else if (updateData.type == "weather") {
    msg = msgMap[updateData.alert]
    if(updateData.temperature){
      msg = msg.replace('{1}', updateData.temperature)
    }
  }
  return msg;
}, 
  
  async sendComms(updateData, users) {
    // send communications
    const currentHour = parseInt(moment().tz("Europe/Dublin").format("HH"));
    // only send comms between 7am and 10pm
    if(currentHour > 7 && currentHour < 22){
    let msg = this._craftMsg(updateData);
    let emailRecipients = [];
    let SMSRecipients = [];
    
    
    logger.info(msg);
    // get Email and SMS Recipients
    users.forEach((user) => {
      let commSettings = user.notificationSettings[updateData.type];
      if (commSettings.receive === 'true') {
        if (commSettings.commTypes.includes("email")) {
          emailRecipients.push(user.email);
        }
        if (commSettings.commTypes.includes("sms")) {
          SMSRecipients.push(user.phoneNumber);
        }
      }
    });

    // send SMS to recipients
    if (SMSRecipients.length) {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require("twilio")(accountSid, authToken);
      logger.info("sending SMS to recipients")
      SMSRecipients.forEach((SMSRecipient) => {
        client.messages.create({
          body: msg,
          from: "+18563867287",
          to: SMSRecipient,
        });
      });
    }

    // send email to recipients
    if (emailRecipients.length) {
      logger.info("sending email to recipients");
      let subjectLine = ["bird", "cat"].includes(updateData.type)
        ? updateData.type.charAt(0).toUpperCase() + updateData.type.slice(1) + " Spotted!"
        : "Weather Update";
      let transporter = nodemailer.createTransport({
        host: "smtp.mailgun.org",
        port: 587,
        auth: {
          user: "postmaster@" + process.env.MAILGUN_DOMAIN,
          pass: process.env.MAILGUN_SMTP_PASS,
        },
      });

      let info = await transporter.sendMail({
        from: `<twitchrapp@${process.env.MAILGUN_DOMAIN}`,
        to: emailRecipients,
        subject: subjectLine,
        text: msg,
      });
    }
  }
  }
}

module.exports = comms;