<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
          <el-col :span="4">
              <el-input  v-model="queryParams.user_id" placeholder="用户ID" clearable></el-input>
          </el-col>
          <el-col :span="4" style="margin-left:10px;">
              <el-input  v-model="queryParams.match_name" placeholder="比赛名称" clearable></el-input>
          </el-col>
          <el-col style="width:100px;line-height:2.5em;text-align:center;margin-left:20px;">
              结算时间:
          </el-col>
          <el-col :span="7">
              <el-date-picker v-model="queryParams.timeRange" format="yyyy-MM-dd HH:mm:SS" value-format="yyyy-MM-dd HH:mm:SS" type="datetimerange" range-separator="至"
                  start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
          </el-col>
          <el-col :span="2">
              <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
          </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop=='match_column'">
                <div style="border-bottom:1px solid #f00">{{scope.row.match_column.match_name}}</div>
                <div>{{scope.row.match_column.teams[0]}} VS {{scope.row.match_column.teams[1]}}</div>
            </span>
            <span v-else-if="item.prop=='guessing_column'">
                <div style="border-bottom:1px solid #f00">{{scope.row.guessing_column.guess_item}}</div>
                <div>{{scope.row.guessing_column.guess_amount}}</div>
            </span>
            <span v-else-if="item.prop=='reward_amount'" :class="scope.row[item.prop]>0?'green':(scope.row[item.prop]<0?'red':'')">
              {{scope.row[item.prop]>0?'+'+scope.row[item.prop]:scope.row[item.prop]}}
            </span>
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
import { tableConfig} from '../../../config/defaultData';
export default {
  name: "settlement-order",
  data() {
    return {
      isLoad: false,
      tableBody:tableConfig(tableHeader),
      queryParams: {
        user_id: "",
        match_name: "",
        timeRange: []
      },
    };
  },
  methods: {
    search() {
      this.tableBody.isLoad=true;
      let params = {
        page: this.tableBody.curPage,
        user_id: this.queryParams.user_id,
        match_name: this.queryParams.match_name
      };
      if (this.queryParams.timeRange!=null && this.queryParams.timeRange.length > 0) {
        params.begin_time = this.queryParams.timeRange[0];
        params.end_time = this.queryParams.timeRange[1];
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/tally_orders`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.countTotal=data.total;
            this.tableBody.data = data.data.map(d => {
              //比赛列
              d.match_column = {
                match_name: d.match_name,
                teams: [d.team_1, d.team_2]
              };
              //竞猜项列
              d.guessing_column = {
                guess_item: d.guess_item,
                guess_amount: d.guess_amount
              };
              return d;
            });

          }
        })
        .catch(_ => {});
    }
  },
  created() {
    this.search();
  }
};
const pay_type = [{ value: 1, label: "支付宝" }, { value: 2, label: "微信" }];
const tableHeader = [
  { prop: "order_id", label: "订单ID" },
  { prop: "user_id", label: "用户ID" },
  { prop: "match_column", label: "比赛" },
  { prop: "item_name", label: "竞猜项名称" },
  { prop: "tally_time", label: "结算时间" },
  { prop: "guessing_column", label: "竞猜项" },
  { prop: "guess_result", label: "结果" },
  { prop: "odds", label: "赔率" },
  { prop: "reward_amount", label: "获得M币" }
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
