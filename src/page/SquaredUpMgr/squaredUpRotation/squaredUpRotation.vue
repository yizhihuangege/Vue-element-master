<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">
                  <el-input placeholder="请输入中奖用户ID" v-model="searchData.user_id" clearable></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button @click="discountConfigDialog.visible=true" type="primary" icon="el-icon-setting">下轮折扣配置</el-button>
                </el-col>
                <el-col :span="4">
                  <div class="top-text">本轮消耗猫币数量：{{ curSum }}</div>
                </el-col>
                <el-col :span="4">
                  <div class="top-text">猫币消耗总计：{{ totalSum }}</div>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <span v-if="item.prop==='updated_at'">{{ scope.row.updated_at |filterTime }}</span>
                    <span v-else>{{scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>
            </el-table>
            <el-row class="area" type="flex" justify="center">
                <el-pagination @current-change="search" background layout="total,prev, pager, next, jumper" :current-page.sync="tableBody.curPage" :total="tableBody.countTotal"
                    :page-size="tableBody.pageSize"></el-pagination>
            </el-row>
        </el-main>

        <el-dialog title="下轮折扣配置" v-if="discountConfigDialog.visible" :visible.sync="discountConfigDialog.visible" width="30%">
          <discount-config v-if="discountConfigDialog.visible" :visible.sync="discountConfigDialog.visible"></discount-config>
        </el-dialog>
    </section>
</template>
<script>

import { formatDateAndTime } from "@/util/time"
import { tableConfig } from "@/config/defaultData";
import discountConfig from "./child/discountConfig"

export default {
  name: "squared-up-rotation",
  components:{
    discountConfig
  },
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      searchData: {
        user_id:"",
      },
      discountConfigDialog:{
        visible:false
      },
      totalSum:0,
      curSum:0
    };
  },
  created() {
    this.search();
  },
  filters:{
    filterTime(val){
      return formatDateAndTime(val*1000)
    }
  },
  methods: {
    search() {
      this.tableBody.isLoad = true;
      let params = {
        page: this.tableBody.curPage,
        limit:this.tableBody.pageSize,
        user_id:this.searchData.user_id,
      }

      return this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/jiugonggeround`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data=data.rows;
            this.totalSum=data.sum;
            this.curSum=data.rows[0].balance_consume;
            
            if(data.rows[0].over==0){
                this.tableBody.countTotal--;
                this.tableBody.data.shift();
            }
          }else{
              this.$message.error(resp.data.errors);
          }
        });
    }
  }
};

const tableHeader= [
    { prop: "id", label: "轮数" },
    { prop: "user_id", label: "中奖用户ID" },
    { prop: "nickname", label: "用户昵称" },
    { prop: "num", label: "中奖用户本轮参与次数" },
    { prop: "name", label: "中奖皮肤" },
    { prop: "remark", label: "中奖折扣" },
    { prop: "balance_consume", label: "本轮共消耗猫币" },
    { prop: "price", label: "礼品价值(元)" },
    { prop: "updated_at", label: "参与时间" },
];
</script>

<style scoped>
  .top-text{
    height:40px;
    line-height:40px;
  }
</style>