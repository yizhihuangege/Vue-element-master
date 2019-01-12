<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col style="max-width:300px">
                    <el-input v-model="searchData.title" placeholder="请输入用户昵称" clearable></el-input>
                </el-col>
                <el-col style="max-width:400px">
                    <el-date-picker
                        v-model="searchData.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:SS" clearable>
                    </el-date-picker>
                </el-col>
                <el-col style="max-width:100px">
                    <el-button @click="search" type="primary" style="margin-left:20px;" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col style="max-width:100px">
                    <el-button @click="exportRecord" type="primary" style="margin-left:20px;" icon="el-icon-download">导 出</el-button>
                </el-col>
            </el-row>

            <el-row class="red" style="margin-top:20px;margin-bottom:20px">
                <span>猫币消耗:{{total_coin}}</span><span style="margin-left:50px">奖品价值:{{total_price}}</span>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <span v-if="item.prop=='delivery_status'">{{scope.row.delivery_status|filterStatus}}</span>
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
  name: "turntable-record",
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      searchData: {
        title: "",
        time: []
      },
      total_coin: 0,
      total_price: 0
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
        title: this.searchData.title
      };
      try{
        params.start_at = this.searchData.time[0];
        params.end_at = this.searchData.time[1];
      }catch(e){
        params.start_at = params.end_at=""
      }

      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/rotary_record`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.total_coin = data.total_coin;
            this.total_price = data.total_price;
            this.tableBody.data = data.rows.map(d => {
              try{
                d.prize_name = d.prize_name.prize_name;
              }catch(e){
                d.prize_name=""
              }
              return d;
            });
          } else {
          }
        });
    },
    exportRecord(){
      let url;
      if(this.searchData.time!=null && this.searchData.time.length>0){
        url=`${process.env.GUESSING_HOST_URL}/api/admin/export_record?start_at=${this.searchData.time[0]}&end_at=${this.searchData.time[1]}`
      }else{
        url=`${process.env.GUESSING_HOST_URL}/api/admin/export_record`
      }
      Promise.all([this.search()]).then(_=>{
        window.open(url);
      })
    },
  }
};

const tableHeader= [
    { prop: "user_id", label: "用户ID" },
    { prop: "nickname", label: "用户昵称" },
    { prop: "created_at", label: "参与时间" },
    { prop: "balance_consume", label: "消耗猫币" },
    { prop: "prize_name", label: "中奖物品" },
    { prop: "price", label: "礼品价值(猫币)" },
    { prop: "delivery_status", label: "发放状态" },
    { prop: "remark", label: "备注" }
];
</script>
<style scoped>
.red {
  color: #f00;
}
</style>

