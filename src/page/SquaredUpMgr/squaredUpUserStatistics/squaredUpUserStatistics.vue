<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input v-model="searchData.user_id" placeholder="请输入用户ID" clearable></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="exportExcel" type="primary" icon="el-icon-download">导出EXCEL</el-button>
                </el-col>
            </el-row>

            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop"></el-table-column>
            </el-table>
            <el-row class="area" type="flex" justify="center">
                <el-pagination @current-change="search" background layout="total,prev, pager, next, jumper" :current-page.sync="tableBody.curPage" :total="tableBody.countTotal"
                    :page-size="tableBody.pageSize"></el-pagination>
            </el-row>
        </el-main>
    </section>
</template>
<script>

import { tableConfig } from "@/config/defaultData";
export default {
  name: "squared-up-user-statistics",
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      searchData: {
        user_id: ""
      }
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad = true;
      let params = {
        page: this.tableBody.curPage,
        user_id:this.searchData.user_id
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/jiugonggerecordcount`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows.map(d=>{
              try{
                d.nickname=d.user.nickname;
                d.mobile=d.user.mobile;
              }catch(e){
                d.nickname="";
                d.mobile="";
              }
              return d
            })
          }else{
            this.$message.error(resp.data.errors)
          }
        })
    },
    exportExcel(){
      window.open(`${process.env.GUESSING_HOST_URL}/api/admin/jiugongge_export_user`)
    }
  }
};

const tableHeader= [
    { prop: "user_id", label: "用户ID" }, 
    { prop: "times", label: "参与次数" },
    { prop: "spend", label: "累计消耗猫币数" },
    { prop: "gain", label: "累计获得猫币数" },
    { prop: "result", label: "汇总" },
    { prop: "last_time", label: "参与时间" },
];
</script>

