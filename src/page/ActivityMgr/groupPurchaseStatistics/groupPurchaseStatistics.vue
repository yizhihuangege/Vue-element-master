<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input v-model="searchData.nickname" placeholder="请输入用户昵称" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="searchData.user_id" placeholder="请输入用户ID" clearable></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="exportRecord" type="primary" icon="el-icon-download">导 出</el-button>
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
  name: "group-purchase-statistics",
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      searchData: {
        nickname: "",
        user_id:"",
      },
    }
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad = true;
      let params = {
        page: this.tableBody.curPage,
        nickname: this.searchData.nickname.trim(),
        user_id:this.searchData.user_id.trim(),
        limit:this.tableBody.pageSize,
      };

      return this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/group_round_count`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data=data.rows;
          }else{
              this.$message.error(resp.data.errors)
          }
        })
    },
    exportRecord(){
      window.open(`${process.env.GUESSING_HOST_URL}/api/admin/group_round_count_export`)
    },
  }
};

const tableHeader= [
    { prop: "user_id", label: "用户ID" },
    { prop: "nickname", label: "用户昵称" },
    { prop: "skin_name", label: "秒杀皮肤名称" },
    { prop: "pay_num", label: "购买份额" },
    { prop: "group_round", label: "参与轮次" },
    { prop:"group_mcoin",label:"使用猫币获取份数" },
    { prop: "group_cash", label: "使用现金获取份数" },
    { prop: "created_at", label: "参与日期" },
];
</script>

