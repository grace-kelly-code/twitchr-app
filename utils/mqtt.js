"use strict";
const mqtt = require("mqtt");
const logger = require("../utils/logger");

// MQTT Config
const options = {
  host: process.env.MQTT_HOST,
  port: 8883,
  protocol: "mqtts",
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

const mqttPublish = {
  publishMsg(msg) {
    logger.info("sending message to mqtt....");
    const client = mqtt.connect(options);
    // publish message to MQTT
    client.publish("twitchr", msg, { qos: 2, retain: false }, (error) => {
      if (error) {
        logger.info(error);
      }
    });
  },
};

module.exports = mqttPublish;
