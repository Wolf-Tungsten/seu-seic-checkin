<template>
  <div class="home">
    <img style="width:50%; max-width:100px;" alt="SEU Seic logo" src="../assets/logo.png">
    <h2 class="h2-title">东南大学网络与信息中心</h2>
    <h3 v-if="hasMeeting" class="h3-title">正在进行：{{meetingName}}</h3>
    <div class="info">
      <div style="font-weight:bold;text-align:center; padding:12px;">请核对您的信息</div>
      <div class="row">
        <div class="key">姓名</div>
        <div>{{name}}</div>
      </div>
      <div class="row">
        <div class="key">一卡通号</div>
        <div>{{cardnum}}</div>
      </div>
    </div>
    <el-button type='success' style="margin-top:40px; width:300px;" @click='checkIn'>点击签到</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import { Button } from 'element-ui';
import axios from 'axios';

export default {
  name: 'home',
  data(){
    return {
      loading:true,
      hasMeeting:false,
      meetingStatus:'签到未开始',
      meetingName:'测试名称',
      name:'加载中',
      cardnum:'请稍候'
    }
  },
  components: {
    'el-button':Button
  },
  methods:{
    async checkIn(){
      let res = await axios.post('/checkin-api/checkIn', {}, {headers:{token:this.$store.state.token}});
      if(res.data.success){
        this.$router.replace('/success')
      } else {
        this.$message.error('出错了，请重试')
      }
    }
  },
  async created(){
    let ticket = ''
    try {
      ticket = window.location.search.split('=')[1]
    } catch(e) {console.log(e)}
    if (ticket) {
      let userInfo = await axios.post('/checkin-api/login', { ticket })
      if(userInfo.data.success){
        this.name = userInfo.data.name
        this.cardnum = userInfo.data.cardnum
        this.$store.commit('token', {token:userInfo.data.token})
      } else {
        window.location = 'https://newids.seu.edu.cn/authserver/login?goto=https://seicwxbz.seu.edu.cn/checkin'
      }
      if(userInfo.data.isAdmin){
        this.$router.replace('/admin')
      }
    } else {
      window.location = 'https://newids.seu.edu.cn/authserver/login?goto=https://seicwxbz.seu.edu.cn/checkin'
    }
  }
}
</script>
<style scoped>
.h2-title {
  font-weight: 300;
}
.h3-title {
  color: teal;
}
.info {
  text-align: left;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
  border-top: solid 1px #eee;
  border-bottom: solid 1px #eee;
  margin-top: 30px;
}
.row {
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-top: solid 1px #eee;
}
.key {
  font-weight: bold;
  flex-basis: 4em;
  text-align: right;
  margin-right: 8px;
}
</style>