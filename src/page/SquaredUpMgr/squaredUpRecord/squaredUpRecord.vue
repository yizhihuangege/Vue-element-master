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
                    <el-input v-model="searchData.mobile" placeholder="请输入手机号" clearable></el-input>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="searchData.is_new" clearable placeholder="是否新用户" @change="search">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="0"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="exportRecord" type="primary" icon="el-icon-download">导 出</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <span v-if="item.prop=='delivery_status'">{{scope.row.delivery_status|filterStatus}}</span>
                    <span v-else-if="item.prop==='new_user'">{{ scope.row.new_user==0?"否":"是" }}</span>
                    <span v-else>{{scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>
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
  name: "squared-up-record",
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      searchData: {
        nickname: "",
        mobile:"",
        is_new:""
      },
    };
  },
  filters:{
    filterStatus(val){
      return ["未兑换","已提交","已发放"][val-1]
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
        nickname: this.searchData.nickname,
        mobile:this.searchData.mobile,
        is_new:this.searchData.is_new,
        limit:this.tableBody.pageSize
      };

      return this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/jiugonggerecord`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data=data.rows;
          }else{
              this.$message.error(resp.data.errors)
          }
        });
    },
    exportRecord(){
      window.open(`${process.env.GUESSING_HOST_URL}/api/admin/jiugongge_export`)
    },
  }
};

const tableHeader= [
    { prop: "user_id", label: "用户ID" },
    { prop: "nickname", label: "用户昵称" },
    { prop: "created_at", label: "参与时间" },
    { prop: "balance_consume", label: "消耗猫币" },
    { prop: "remark", label: "中奖物品" },
    { prop:"new_user",label:"是否新用户" },
    { prop: "price", label: "礼品价值(猫币)" },
    { prop: "delivery_status", label: "发放状态" },
    // { prop: "remark", label: "备注" }
];
</script>

