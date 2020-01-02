<template>
  <div class="admin">
    <h1>签到结果</h1>
    <el-button @click="exportXLSX">导出</el-button>
    <el-button type="danger" @click="deleteData">清除数据</el-button>
    <div class="table-container">
      <el-table :data="list" style="margin-top:30px;">
        <el-table-column prop="name" label="姓名" width="80"></el-table-column>
        <el-table-column prop="cardnum" label="一卡通号" width="100"></el-table-column>
        <el-table-column prop="timedisp" label="签到时间" width="220"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Button, Table, TableColumn } from "element-ui";
import axios from "axios";
import moment from "moment";
import ExportJsonExcel from "js-export-excel";

export default {
  name: "home",
  data() {
    return {
      list: []
    };
  },
  components: {
    "el-button": Button,
    "el-table": Table,
    "el-table-column": TableColumn
  },
  methods: {
    async load() {
      let rawData = await axios.get("/checkin-api/data", {
        headers: { token: this.$store.state.token }
      });
      this.list = rawData.data.result.map(i => {
        i.timedisp = moment(i.timestamp).format("YYYY-MM-DD HH:mm:ss");
        return i;
      });
    },
    async exportXLSX() {
      let that = this;
      let option = {
        datas: [
          //可多张sheet
          {
            sheetData: that.list, //数据
            sheetName: "签到记录", //左下角tab页的sheet名
            sheetFilter: ["name", "cardnum", "timedisp"], // json的key，需要和header的每一项顺序对应
            sheetHeader: ["姓名", "一卡通号", "签到时间"] //.xlsx的表头
          }
        ]
      };
      let toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
    },
    async deleteData() {
      this.$confirm("此操作将删除所有签到记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await axios.delete("/checkin-api/data", {
          headers: { token: this.$store.state.token }
        });
        this.load();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    }
  },
  async created() {
    if (!this.$store.state.token) {
      window.location =
        "https://newids.seu.edu.cn/authserver/login?goto=https://seicwxbz.seu.edu.cn/checkin";
      return;
    }
    this.load();
  }
};
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
.table-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>