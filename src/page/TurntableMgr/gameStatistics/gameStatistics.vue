<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>

      <el-row type="flex" justify="space-between">
          <el-col :span="6">
              <el-input v-model="searchBox.game_name" placeholder="游戏名称" clearable></el-input>
          </el-col>
          <el-col :span="6" style="margin-left:20px">
              <el-date-picker v-model="searchBox.timeRange" format="yyyy-MM-dd HH:mm:SS" value-format="yyyy-MM-dd HH:mm:SS" 
                    type="datetimerange"  range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" 
                    :default-time="['00:00:00', '23:59:50']">
              </el-date-picker>
          </el-col>
          <el-col :span="12" style="margin-left:20px">
              <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop==='pay_type'">{{(scope.row[item.prop])}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
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
import { tableConfig } from "../../../config/defaultData";

export default {
  name: "gameStatistics",
  data() {
    return {
      isLoad: false,
      searchBox: {
        game_name: "",
        timeRange: []
      },
      tableBody:tableConfig(tableHeader)
    };
  },
  methods: {
    load() {
      this.isLoad = true;
      Promise.all([this.search()])
        .then(resp => {
          this.isLoad = false;
        })
        .catch(_ => {
          this.isLoad = false;
        });
    },
    search() {
      this.tableBody.isLoad = true;
      let params = {
        page: this.tableBody.curPage,
        game_name:this.searchBox.game_name
      };

      if(this.searchBox.timeRange!==null && this.searchBox.timeRange.length>0){
        params.start_at=this.searchBox.timeRange[0];
        params.end_at=this.searchBox.timeRange[1];
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/game_statistics`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            this.tableBody.data=resp.data.data;
          }
        })
        .catch(resp => {});
    }
  },
  created() {
    this.load();
  }
};

const tableHeader = [
  { prop: "date", label: "日期" },
  { prop: "total", label: "进入数量" },
  { prop: "total_spend", label: "消耗猫币" },
  { prop: "m_coin", label: "获取猫币" },
];

</script>

<style scoped>
</style>
