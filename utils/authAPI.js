const userStore = require("../models/user-store.js");

const isAuthorized = (request) => {
  // get api key provided in request header
  let reqAPIKey = request.header("x-api-key");
  const users = userStore.getAllUsers();
  //if the api key does not exist and the user is not an admin, raise an error
  if (users.find((user) => user.apiKey == reqAPIKey && user.isAdmin == true)) {
    return true
  } else {
    return false
  }
};

module.exports = isAuthorized;