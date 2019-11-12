'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const uuid = require('uuid/v4');
const axios = require('axios');
const xmlparser = require('fast-xml-parser');
const { admin } = require('../../secret');

class UserController extends Controller {
  async login() {
    const { ctx } = this;
    const token = uuid();
    const { ticket } = ctx.request.body;
    let idsRes = await axios.get(`https://newids.seu.edu.cn/authserver/serviceValidate?service=https://seicwxbz.seu.edu.cn/checkin&ticket=${ticket}`);
    console.log(idsRes.data);
    try {
      idsRes = xmlparser.parse(idsRes.data)['cas:serviceResponse']['cas:authenticationSuccess']['cas:attributes'];
      const name = idsRes['cas:cn'];
      const cardnum = '' + idsRes['cas:uid'];
      const record = await this.app.db.collection('users').findOne({ cardnum });
      if (!record) {
        await this.app.db.collection('users').insertOne({ name, cardnum, token, tokenExipreTime: +moment() + 3600 * 1000 });
      } else {
        await this.app.db.collection('users').updateMany({ cardnum }, { $set: { token, tokenExipreTime: +moment() + 3600 * 1000 } });
      }
      ctx.body = { success: true,
        cardnum,
        name,
        token,
        isAdmin: admin.indexOf(cardnum) !== -1,
      };
    } catch (e) {
      console.log(e);
      ctx.body = { success: false };
    }
  }
}

module.exports = UserController;
