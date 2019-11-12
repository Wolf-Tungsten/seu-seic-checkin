'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class CheckInController extends Controller {
  async checkIn() {
    const { ctx } = this;
    const { token } = ctx.request.headers;
    const userInfo = await ctx.service.user.info(token);
    if (!userInfo) {
      ctx.body = {
        success: false,
        reason: '无权操作',
      };
      return;
    }
    await this.app.db.collection('checkIn').insertOne({ name: userInfo.name, cardnum: userInfo.cardnum, timestamp: +moment() });
    ctx.body = {
      success: true,
    };
    return;
  }
}

module.exports = CheckInController;
