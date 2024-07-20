"use strict";

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

class JsonStore {
  constructor(file, defaults) {
    const adapter = new FileSync(file);
    this.db = low(adapter);
    this.db.defaults(defaults).value();
  }

  save() {
    this.db.write();
  }

  findOneBy(collection, filter) {
    const results = this.db.get(collection).filter(filter).value();
    return results[0];
  }
  
  findAll(collection) {
    return this.db.get(collection).value();
  }
}

module.exports = JsonStore;
