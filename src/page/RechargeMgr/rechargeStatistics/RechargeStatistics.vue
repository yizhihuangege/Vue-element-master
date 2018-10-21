<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>

      <el-row>
        <el-col :span="3">
            <el-input v-model="searchBox.userid" placeholder="用户ID" clearable></el-input>
        </el-col>
        <el-col :span="3" style="margin-left:20px">
            <el-select v-model="searchBox.pay_type" placeholder="支付方式" clearable>
              <el-option v-for="(item,index) of pay_type" :key="index" :value="item.value"  :label="item.label"></el-option>
            </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker v-model="searchBox.time" format="yyyy-MM-dd HH:mm:SS" value-format="yyyy-MM-dd HH:mm:SS" type="datetimerange" range-separator="至"
                        start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
        </el-col>
        <el-col :span="3">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        </el-col>
    </el-row>


      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop==='pay_type'">{{reType(scope.row[item.prop])}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="area" type="flex" justify="center" v-if="tableBody.data.length">
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
export default {
  name: "recharge-statistics",
  data() {
    return {
      isLoad: false,
      // 搜索控件选项
      searchBox: {
        userid: "",
        pay_type: "",
        time: []
      },
      pay_type: pay_type,
      tableBody: tableBody,
      dialog: {
        addCommodity: false,
        addCommodityModify: false,
        addCommodityVisible: false,
        addType: 0,
        addCommodityData: {}
      }
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
        user_id: this.searchBox.userid,
        pay_type: this.searchBox.pay_type,
        page: this.tableBody.curPage
      };

      if (this.searchBox.time[0]) {
        params.begin_time = this.searchBox.time[0];
        params.end_time = this.searchBox.time[1];
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/recharge_record`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data=data.rows.map(d=>{
              d.m_coin=d.amount*1000;
              return d
            });
          }
        })
        .catch(resp => {});
    },
    reType(val) {
      return val == 1 ? "支付宝" : "微信";
    }
  },
  created() {
    this.load();
  }
};
const pay_type = [
  { value: 1, label: "支付宝" },
  { value: 2, label: "微信" }
];
const tableHeader = [
  { prop: "order_no", label: "订单ID" },
  { prop: "user_id", label: "用户ID" },
  { prop: "nickname", label: "昵称" },
  { prop: "created_at", label: "充值时间" },
  { prop: "pay_type", label: "支付方式" },
  { prop: "amount", label: "充值金额" },
  {prop:"m_coin",label:"猫币"}
];

const tableBody = {
  isLoad: true,
  header: tableHeader,
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 页总数
};
</script>

<style scoped>
</style>
