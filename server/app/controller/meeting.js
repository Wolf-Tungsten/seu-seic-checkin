'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class MeetingController extends Controller {
  async status() {
    const { ctx } = this;
    // 查找最近的会议记录
    const record = await this.app.db.collection('meeting').findOne({});
    if (record) {
      ctx.body = {
        ...record,
        hasMeeting: true,
      };
    } else {
      ctx.body = {
        hasMeeting: false,
      };
    }
  }
  async post() {
    // 发布会议，默认状态为签到未开始
    const { ctx } = this;
    // 检查权限
    const { token } = ctx.request.headers;
    const userInfo = await ctx.service.user.info(token);
    if (!userInfo || !userInfo.isAdmin) {
      ctx.body = {
        success: false,
        reason: '无权操作',
      };
      return;
    }
    const { meetingName } = ctx.request.body;
    if (!meetingName) {
      ctx.body = {
        success: false,
        reason: '会议名称不能为空',
      };
      return;
    }
    const res = await this.app.db.collection('meeting').insert({ meetingName, meetingStatus: '签到未开始', updateTime: +moment() });
    console.log(res);
    ctx.body = {
      success: true,
    };
  }
  async start() {
    const { ctx } = this;
    // 检查权限
    const { token } = ctx.request.headers;
    const userInfo = await ctx.service.user.info(token);
    if (!userInfo || !userInfo.isAdmin) {
      ctx.body = {
        success: false,
        reason: '无权操作',
      };
      return;
    }
    // 开始签到
    await this.app.db.collection('meeting').update({ meetingStatus: '签到未开始' }, { $set: { meetingStatus: '签到', startTime: +moment(), updateTime: +moment() } });
    return { success: true };
  }
  async stop() {
    const { ctx } = this;
    // 检查权限
    const { token } = ctx.request.headers;
    const userInfo = await ctx.service.user.info(token);
    if (!userInfo || !userInfo.isAdmin) {
      ctx.body = {
        success: false,
        reason: '无权操作',
      };
      return;
    }
    // 停止签到
    await this.app.db.collection('meeting').update({ meetingStatus: '签到' }, { $set: { meetingStatus: '签到已结束', endTime: +moment(), updateTime: +moment() } });
    return { success: true };
  }
}

module.exports = MeetingController;
