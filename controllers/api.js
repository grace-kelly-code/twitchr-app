"use strict";
const axios = require("axios");
const logger = require("../utils/logger");
const moment = require("moment-timezone");
const userStore = require("../models/user-store.js");
const commsUtils = require("../utils/comms");
const mqttPublish = require("../utils/mqtt");
const isAuthorized = require("../utils/authAPI.js");
const _ = require("lodash");

const api = {
  async sendUpdate(request, response) {
    // if nout authorized return error
    if (!isAuthorized(request)) {
      return response
        .status(403)
        .send({ error: { code: 403, message: "Unauthorized" } });
    } else {
      mqttPublish.publishMsg(JSON.stringify(request.body));
    if (["bird", "cat"].includes(request.body.type)) {
        // send comms
      const users = userStore.getAllUsers();
      commsUtils.sendComms(request.body, users);
    }
    }
    response.status(204).send("OK");
  },
  updateWeather(request, response) {
    // if not authorized return error
    if (!isAuthorized(request)) {
      return response
        .status(403)
        .send({ error: { code: 403, message: "Unauthorized" } });
    }
    // get device config
    const adminUser = userStore.getAdmin();
    const feederConfig = adminUser.feeder;
    // get weather update from Open Weather Map API
    axios
      .get("https://api.openweathermap.org/data/2.5/onecall", {
        params: {
          lat: feederConfig.latitude,
          lon: feederConfig.longitude,
          units: "metric",
          appid: process.env.OPENWEATHERMAP_API_KEY,
        },
      })
      .then((res) => {
        const currentWeather = res.data.current;
        const reading = {
          timestamp: new Date().toJSON(),
          temperature: currentWeather.temp,
          windSpeed: currentWeather.wind_speed,
          weather: currentWeather.weather[0].main,
          sunset: moment.unix(res.data.daily[0].sunset).tz("Europe/Dublin"),
        };
        // publish weather data to MQTT
        mqttPublish.publishMsg(JSON.stringify(reading));

        //check if user is admin and has noifications turned on
        if (adminUser && adminUser.notificationSettings.weather.receive) {
          // send each weather comm once per day
          let updatedAdmin = _.cloneDeep(adminUser);
          const currentDate = moment().tz("Europe/Dublin");
          let sunsetHour = reading.sunset.format("HH");
          let currentHour = currentDate.format("HH");

          // only send comms if sunset comms have not been already sent
          if (
            !currentDate.isSame(
              adminUser.notificationsLog.weather.sunset,
              "day"
            )
          ) {
            // send sunset comms if sunset is soon
            if (
              sunsetHour - currentHour >= 0 &&
              sunsetHour - currentHour <= 2
            ) {
              // send sunset comms before sunset
              commsUtils.sendComms({ type: "weather", alert: "sunset" }, [
                adminUser,
              ]);
              // set the notification log sunset timestamp
              updatedAdmin.notificationsLog.weather.sunset = currentDate;
            } else if (
              !currentDate.isSame(
                adminUser.notificationsLog.weather.cold,
                "day"
              ) &&
              reading.temperature <= 4
            ) {
              // if the date is not the same and the temperature is cold, send comm
              commsUtils.sendComms(
                {
                  type: "weather",
                  alert: "cold",
                  temperature: reading.temperature,
                },
                [adminUser]
              );
              updatedAdmin.notificationsLog.weather.cold = currentDate;
            } else if (
              !currentDate.isSame(
                adminUser.notificationsLog.weather.hot,
                "day"
              ) &&
              reading.temperature >= 22
            ) {
              // if the date is not the same and the temperature is hot, send comm
              commsUtils.sendComms(
                {
                  type: "weather",
                  alert: "hot",
                  temperature: reading.temperature,
                },
                [adminUser]
              );
              // set the notification log hot timestamp
              updatedAdmin.notificationsLog.weather.hot = currentDate;
            }
          }
          // update user logs if there has been any changes
          if (!_.isEqual(updatedAdmin.notificationsLog, adminUser.notificationsLog)) {
            userStore.updateNotificationLogs(adminUser, updatedAdmin);
          }
        }
      });

    response.status(200).send("OK");
  },
};

module.exports = api;
