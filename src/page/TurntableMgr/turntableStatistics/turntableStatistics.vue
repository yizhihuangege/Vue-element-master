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
                <!-- <el-col :span="4">
                    <el-input v-model="searchData.mobile" placeholder="请输入手机号码" clearable></el-input>
                </el-col> -->
                <el-col :span="6">
                    <el-date-picker
                        v-model="searchData.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:SS">
                    </el-date-picker>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
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
  name: "tuentable-statistics",
  data() {
    return {
      isLoad: true,
      tableBody:tableConfig(tableHeader),
      searchData: {
        user_id: "",
        time: [],
        mobile:""
      },
      total_coin: 0,
      total_price: 0
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
        user_id: this.searchData.user_id.trim(),
        // mobile:this.searchData.mobile.trim()
      };
      try{
        params.start_at = this.searchData.time[0];
        params.end_at = this.searchData.time[1];
      }catch(e){
          params.start_at=params.end_at=""
      }

      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/rotary_record_count`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows;
          }
        });
    },
  }
};

const tableHeader= [
    { prop: "user_id", label: "用户ID" },
    { prop: "rotary_count", label: "参与次数" },
    { prop: "win_count", label: "中奖数" },
    { prop: "exchange_count", label: "兑换数" },
    { prop: "created_at", label: "参与时间" },
];

</script>

