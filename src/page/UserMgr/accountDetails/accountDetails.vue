<template>
  <section >
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
          <el-col :span="4">
              <el-input style="width:80%" v-model="queryParams.title" placeholder="请输入用户昵称" clearable></el-input>
          </el-col>
          <el-col :span="8">
              <el-date-picker v-model="queryParams.timeRange" format="yyyy-MM-dd HH:mm:SS" value-format="yyyy-MM-dd HH:mm:SS" type="datetimerange" range-separator="至"
                  start-placeholder="开始时间" end-placeholder="结束时间"  :default-time="['00:00:00','23:59:59']">
              </el-date-picker>
          </el-col>
          <el-col :span="2">
              <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
          </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
              <span v-if="item.prop==='record_type'">{{scope.row['record_type'] | reType}}</span>
              <span v-else-if="item.prop==='account_type'">{{scope.row.account_type===1?"收入":"支出"}}</span>
              <span v-else-if="item.prop==='amount'" :class="scope.row.account_type===1?'green':'red'">{{scope.row.amount | reAmount(scope.row.account_type)}}</span>
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
  name: "account-details",
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      queryParams: {
        title: "",
        timeRange: []
      },
    };
  },
  filters:{
    reType(val){
      return ["竞猜下注","退还竞猜下注","m币兑换","签到奖励","商品兑换","退还商品兑换","竞猜获胜奖励","竞猜流局退币","超维对决报名奖励","微信充值","支付宝充值","每日必做-分享任务奖励","每日必做-邀请任务奖励 ","小游戏底注","小游戏猫币奖励","移动积分兑换","完成任务奖励","福利码兑换","硬币下注","硬币下注奖励"][val-1];    
    },
    reAmount(val,type){
      return type===1?('+'+val):('-'+val);
    }
  },
  methods: {
    // 接口数据处理获取
    search() {
      this.tableBody.isLoad = true;
      let params = {
        title:this.queryParams.title,
        page: this.tableBody.curPage,
        limit: this.tableBody.pageSize
      };

      if (this.queryParams.timeRange != null && this.queryParams.timeRange.length > 0) {
        params.start_at = this.queryParams.timeRange[0];
        params.end_at = this.queryParams.timeRange[1];
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/user_mcoin_account_detail`, { params })
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows;
          }
        }).catch(_ => {});
    },
  },
  created() {
    this.search();
  }
};
const tableHeader = [
  // { prop: "id", label: "用户ID" },
  { prop: "nickname", label: "用户昵称" },
  { prop: "record_type", label: "事件" },
  { prop: "account_type", label: "状态" },
  { prop: "amount", label: "资金变动" },
  { prop: "surplus_amount", label: "变动后金额" },
  { prop: "created_at", label: "时间" }
];

</script>

<style scoped>
.green{
    color:rgb(13,188,121);
}
.red{
    color:#f00;
}
</style>
