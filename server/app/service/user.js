'use strict';
const Service = require('egg').Service;
const { admin } = require('../../secret');
const moment = require('moment');

class UserService extends Service {
  async info(token) {
    const user = await this.app.db.collection('users').findOne({ token });
    if (user) {
      user.isAdmin = (admin.indexOf(user.cardnum) !== -1);
    }
    return user;
  }
}

module.exports = UserService;
