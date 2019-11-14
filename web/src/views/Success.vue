<template>
  <div class="about">
    <img style="width:50%; max-width:100px;" alt="SEU Seic logo" src="../assets/logo.png">
    <h2 class="h2-title">东南大学网络与信息中心</h2>
    <h3 class="h3-title">签到成功！</h3>
    <el-button @click="closeWindow">点击关闭</el-button>
  </div>
</template>
<script>
import { Button } from 'element-ui';
import axios from 'axios';
export default {
  components: {
    'el-button':Button
  },
  methods:{
    async closeWindow(){
      let url = encodeURIComponent(window.location.href.split('#')[0])
      let res = await axios.get(`https://seicwxbz.seu.edu.cn/api/jssdk?extraUrl=${url}`)
      window.wx.ready(()=>{
        window.wx.closeWindow()
      })
      window.wx.config(res.data.result)
    }
  }
}
</script>
