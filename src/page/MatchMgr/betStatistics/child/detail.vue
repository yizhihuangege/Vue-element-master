<template>
  <section>
    <section>
        <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
            <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
            <template slot-scope="scope">
                <span>{{scope.row[item.prop]}}</span>
            </template>
            </el-table-column>
        </el-table>
    </section>
    <el-row class="area" type="flex" justify="center" style="margin-top:20px">
        <el-button type="primary" @click="ok">确 定</el-button>
         <el-button type="success" @click="exportData" style="float:right">导出表格</el-button>
    </el-row>
  </section>
</template>

<script>

import { tableConfig } from '@/config/defaultData';
export default {
  name: "detail",
  props: ["date"],
  data() {
    return {
      tableBody:tableConfig(tableHeader,10),
    };
  },
  created() {
    this.getLogs();
  },
  methods: {
    getLogs() {
      this.tableBody.isLoad=true;
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/betLists?date=${this.date}`).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            this.tableBody.data=resp.data.data;
          } else {
            this.$message.error(resp.data.errors);
          }
        }).catch(_ => {});
    },
    ok() {
      this.$emit("update:visible", false);
    },
    exportData(){
      window.open(`${process.env.GUESSING_HOST_URL}/api/admin/export?date=${this.date}`);
    }
  }
};
const tableHeader=[
    { prop: "settle_date", label: "结算时间" },
    { prop: "match", label: "比赛" },
    { prop: "winner", label: "胜方队伍" },
    { prop: "loser", label: "败方队伍" },
    { prop: "rank", label: "平台抽成" },
];
</script>

<style scoped>
.date {
  font-weight: bold;
}
.log-item {
  border-bottom: 1px dashed #666;
}
.log-item section {
  line-height: 30px;
  font-size: 16px;
}
</style>
