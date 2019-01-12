<template>
  <section>
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="6">
          <el-date-picker v-model="searchBox.timeRange"  value-format="yyyy-MM-dd" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="timeRangeConfig">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
            <el-select v-model="searchBox.platform" placeholder="请选择平台" @change="search">
                <el-option v-for="item in platformOptions" :key="item.id"  :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-col>
        <el-col :span="2">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="2">
            <el-button type="primary" @click="exportExcel" icon="el-icon-download">导出</el-button>
        </el-col>
    </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="area" type="flex" justify="center">
        <el-pagination @current-change="search"
                       background
                       layout="total,prev, pager, next, jumper"
                       :current-page.sync="tableBody.curPage"
                       :total="tableBody.countTotal"
                       :page-size="tableBody.pageSize">
        </el-pagination>
      </el-row>
    </el-main>
  </section>
</template>
<script>

import {formatDate} from '@/util/time';
import { tableConfig,timeRangeConfig } from "@/config/defaultData";

export default {
  name: "bet-statistics",
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      timeRangeConfig,
      platformOptions,
      searchBox: {
        platform:3,
        timeRange: []
      }
    }
  },
  methods: {
    exportExcel(){
      window.open(`${process.env.GUESSING_HOST_URL}/api/admin/statistics_export`);
    },
    search() {
      this.tableBody.isLoad = true;
      let params={
          page:this.tableBody.curPage,
          platform:this.searchBox.platform,
      };

      try{
        params.start_time=this.searchBox.timeRange[0];
        params.stop_time=this.searchBox.timeRange[1];
      }catch(e){
        this.$message.warning("时间不能为空！");
        return false;
      }
      
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/statistics`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.total;
            this.tableBody.data=data.data;
          }
        })
    }
  },
  created() {
    // 默认查询近30天
    this.searchBox.timeRange[0]=formatDate(Date.now()-30*24*60*60*1000);
    this.searchBox.timeRange[1]=formatDate(Date.now());
    this.search();
  }
};

const platformOptions=[
    { label:"H5",value:0 },
    { label:"安卓",value:1 },
    { label:"IOS",value:2 },
    { label:"全平台",value:3 },
];
const tableHeader = [
  { prop: "day", label: "日期" },
  { prop: "registered", label: "新增注册" },
  { prop: "device", label: "新增设备" },
  { prop: "active", label: "活跃用户" },
  { prop: "old", label: "老用户活跃" },
  { prop: "retain_1", label: "次日留存" },
  { prop: "retain_3", label: "3日留存" },
  { prop: "retain_7", label: "7日留存" },
];

</script>
