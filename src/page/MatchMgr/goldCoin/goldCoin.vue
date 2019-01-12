<template>
  <section>
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row :gutter="20">
          <el-col :span="7">
              <el-date-picker v-model="searchBox.timeRange" type="datetimerange" range-separator="至" 
                start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:SS"></el-date-picker>
          </el-col>
          <el-col :span="2">
              <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-col>
      </el-row>
      <el-row style="margin-top:20px">
          <span>平台总收入：{{total_rake}}</span>
          <span style="margin-left:30px">平台总支出：{{total_advance}}</span>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop"></el-table-column>
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
import { tableConfig } from "@/config/defaultData";
import { formatDateAndTime } from "@/util/time"

export default {
  name: "goldCoin",
  data() {
    return {
      searchBox:{
          timeRange:[]
      },
      total_rake:0,
      total_advance:0,
      tableBody:tableConfig(tableHeader)
    };
  },
  methods: {
    search() {
      this.tableBody.isLoad = true;
      let params={
          page:this.tableBody.curPage
      };
      if(this.searchBox.timeRange!=null && this.searchBox.timeRange.length>0){
          params.begin_time=this.searchBox.timeRange[0];
          params.end_time=this.searchBox.timeRange[1];
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/coin_list`,{ params }).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.total;
            this.total_rake=data.total_rake;
            this.total_advance=data.total_advance;
            this.tableBody.data=data.data.map(d=>{
              d.endStr=formatDateAndTime(d.end_at*1000);
              return d;
            });
          }else{
              this.$message.error(resp.data.errors);
          }
        })
    }
  },
  created() {
    this.search();
  }
};

const tableHeader = [
  { prop: "id", label: "场次" },
  { prop: "people", label: "参与人数" },
  { prop: "invest_money", label: "投入竞猜币"},
  { prop: "win_number", label: "赢的人数" },
  { prop: "send_money", label: "资金发放" },
  { prop: "platform_income", label: "平台盈利" },
  { prop: "platform_outgoings", label: "平台支出" },
  { prop: "endStr", label: "结算时间" },
];

</script>
