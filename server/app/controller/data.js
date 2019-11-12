'use strict';

const Controller = require('egg').Controller;

class DataController extends Controller {
  async get() {
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
    let result = await this.app.db.collection('checkIn').find({}).toArray();
    const hash = {};
    result.forEach(r => {
      hash[r.cardnum] = r;
    });
    result = Object.keys(hash).map(c => hash[c]);
    ctx.body = {
      result,
    };
    return;
  }
  async delete() {
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
    await this.app.db.collection('checkIn').deleteMany({});
    ctx.body = {
      success: true,
    };
    return;
  }
}

module.exports = DataController;
