<template>
  <section v-loading="isLoad">
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
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        </el-col>
    </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据详情">
            <template slot-scope="scope">
                <el-button @click="viewdetail(scope.row)" type="text" size="small">查看</el-button>
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
    <!-- 查看详情 Dialog -->
    <el-dialog :title="detailDialog.title" :visible.sync="detailDialog.visible" v-if="detailDialog.visible">
        <detail v-if="detailDialog.visible" :visible.sync="detailDialog.visible" :date="detailDialog.date"></detail>
    </el-dialog>
  </section>
</template>
<script>
import { tableConfig,timeRangeConfig } from "@/config/defaultData";
import detail from "./child/detail";

export default {
  name: "bet-statistics",
  components:{
      detail
  },
  data() {
    return {
      isLoad: true,
      tableBody:tableConfig(tableHeader),
      timeRangeConfig,
      searchBox: {
        timeRange: []
      },
      detailDialog:{
          title:"",
          visible:false,
          date:""
      }
    }
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
      let params={
        page:this.tableBody.curPage,
        limit:this.tableBody.pageSize
      };
      if (this.searchBox.timeRange!=null && this.searchBox.timeRange.length>0) {
        params.start_at = this.searchBox.timeRange[0] + " 00:00:00";
        params.end_at = this.searchBox.timeRange[1]+" 23:59:59";
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/bet_statistics`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data=data.rows;
          }
        })
        .catch(resp => {});
    },
    viewdetail(row){
        this.detailDialog.visible=true;
        this.detailDialog.title=`${row.date} 下注详情`;
        this.detailDialog.date=row.date;
    }
  },
  created() {
    this.load();
  }
};
const tableHeader = [
  { prop: "date", label: "日期" },
  { prop: "total", label: "下注总金额（猫币）" },
  { prop: "rank", label: "平台收益（猫币）" }
];

</script>

<style scoped>
</style>
