<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>

      <el-row>
        <el-col :span="3">
            <el-input v-model="searchBox.title" placeholder="请输入手机号或用户ID" clearable></el-input>
        </el-col>
        <el-col :span="6" style="margin-left:20px">
          <el-date-picker v-model="searchBox.time"  value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                        start-placeholder="开始时间" end-placeholder="结束时间">
                    </el-date-picker>
        </el-col>
        <el-col :span="4" style="margin-left:20px">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        </el-col>
    </el-row>


      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop==='operator_id'">{{reType(scope.row[item.prop])}}</span>
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
export default {
  name: "intergral-record",
  data() {
    return {
      isLoad: true,
      searchBox: {
        title: "",
        time: []
      },
      tableBody
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
        title:this.searchBox.title
      };

      if (this.searchBox.time!=null && this.searchBox.time.length>0) {
        params.start_at = this.searchBox.time[0] + " 00:00:00";
        params.end_at = this.searchBox.time[1]+" 23:59:59";
      }

      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/integral_exchange`, {params})
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
    reType(val) {
      if(val==1)return "移动"
    }
  },
  created() {
    this.load();
  }
};
const tableHeader = [
  { prop: "user_id", label: "用户ID" },
  { prop: "nickname", label: "昵称" },
  { prop: "order_no", label: "订单号" },
  { prop: "operator_id", label: "运营商" },
  { prop: "operator_id", label: "兑换手机号" },
  { prop: "score", label: "兑换积分额" },
  { prop: "m_coin", label: "猫币" },
  { prop: "created_at", label: "兑换时间" }
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
