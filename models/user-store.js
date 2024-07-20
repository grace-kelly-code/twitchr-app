"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const userStore = {
  store: new JsonStore("./models/user-store.json", { users: [] }),
  collection: "users",
  
  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  getByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
  
  getAdmin(){
    return this.store.findOneBy(this.collection, {isAdmin: true})
  },

  updateUser(currentUser, updatedUser) {
    const userWithEmail = this.getByEmail(updatedUser.email);
    if (userWithEmail && userWithEmail.id !== currentUser.id) {
      throw "Email " + userWithEmail.email + " already in use";
    }
    currentUser.firstName = updatedUser.firstName;
    currentUser.lastName = updatedUser.lastName;
    currentUser.email = updatedUser.email;
    currentUser.password = updatedUser.password;
    currentUser.phoneNumber = updatedUser.phoneNumber;
    currentUser.notificationSettings = updatedUser.notificationSettings;
    if(currentUser.isAdmin && updatedUser.feeder){
      currentUser.feeder = updatedUser.feeder;
    }
    this.store.save();
  },
  
  updateNotificationLogs(currentUser, updatedUser){
    currentUser.notificationsLog.weather.sunset = updatedUser.notificationsLog.weather.sunset
    currentUser.notificationsLog.weather.cold = updatedUser.notificationsLog.weather.cold
    currentUser.notificationsLog.weather.hot = updatedUser.notificationsLog.weather.hot
    this.store.save();
  }
  
};

module.exports = userStore;
