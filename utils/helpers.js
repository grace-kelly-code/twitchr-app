const register = function(Handlebars) {
  const helpers = {
    toJson: (obj) => {
      return JSON.stringify(obj);
    },
    includes: (arr, value) => {
      if(arr){
        return arr.includes(value);
      }
      return
    },
    eq: (a, b) => {
      return a == b
    }
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (const prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
};

module.exports.register = register;
module.exports.helpers = register(null);
