<template>
    <section v-loading="isLoad">
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
          
            <el-row>
                <el-col :span="4">
                    <el-input v-model="searchData.title" placeholder="请输入用户ID或名称" clearable></el-input>
                </el-col>
                <el-col :span="7" style="margin-left:20px">
                    <el-date-picker
                        v-model="searchData.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:SS" clearable>
                    </el-date-picker>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" style="margin-left:20px;" icon="el-icon-search">查 询</el-button>
                </el-col>
            </el-row>

            <el-row class="red" style="margin-top:20px;margin-bottom:20px">
                <span>猫币消耗:{{total_coin}}</span><span style="margin-left:50px">奖品价值:{{total_price}}</span>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <img v-if="item.prop==='icon'" style="width:200px" :src="scope.row.icon" alt="">
                    <span v-else-if="item.prop=='prize_type'">{{(scope.row.prize_type)}}</span>
                    <span v-else-if="item.prop=='delivery_status'">{{reStatus(scope.row.delivery_status)}}</span>
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
export default {
  name: "participation-record",
  data() {
    return {
      isLoad: true,
      tableBody,
      searchData: {
        title: "",
        time: []
      },
      total_coin: "",
      total_price: ""
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.isLoad = true;
      Promise.all([this.search()])
        .then(resp => {
          this.isLoad = false;
        })
        .catch(resp => {
          this.isLoad = false;
        });
    },
    search() {
      this.tableBody.isLoad = true;
      let params = {
        page: this.tableBody.curPage,
        title: this.searchData.title
      };
      if (this.searchData.time !== null && this.searchData.time.length > 0) {
        params.start_at = this.searchData.time[0];
        params.end_at = this.searchData.time[1];
      }

      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/rotary_record`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.total_coin = data.total_coin;
            this.total_price = data.total_price;
            this.tableBody.data = data.rows.map(d => {
              d.prize_name = d.prize_name.prize_name;
              return d;
            });
          } else {
          }
        });
    },
    reStatus(val){
      return ["未兑换","已提交","已发放"][val-1]
    }
  }
};

const tableBody = {
  isLoad: true,
  header: [
    { prop: "id", label: "用户ID" },
    { prop: "nickname", label: "用户昵称" },
    { prop: "created_at", label: "参与时间" },
    { prop: "balance_consume", label: "消耗猫币" },
    { prop: "prize_name", label: "中奖物品" },
    { prop: "price", label: "礼品价值(猫币)" },
    { prop: "delivery_status", label: "发放状态" },
    { prop: "remark", label: "备注" }
  ],
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 总条数
};
</script>
<style scoped>
.blue {
  color: #409eff;
  cursor: pointer;
}

.red {
  color: #f00;
}
</style>

