'use strict';
const connectMongoDB = require('./db');
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async willReady() {
    this.app.db = await connectMongoDB();
  }

}

module.exports = AppBootHook;
