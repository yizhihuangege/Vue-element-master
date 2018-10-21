<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb :forcePath="path"></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <el-button type="primary" @click="goBack" style="float:right">
          <i class="el-icon-arrow-left"></i>返回竞猜项</el-button>
      </el-row>
      <el-row>
        <el-col class="x-area">
          <span style="margin-right:1em;font-weight:bold;font-size:2em;">{{guessName}}</span>
          <el-input style="width:10em" v-model="form.userId" placeholder="用户ID" clearable></el-input>
          
          <el-select v-model="form.guess_item" placeholder="竞猜项" clearable>
              <el-option v-for="item in form.guessingItem" :key="item.value" :label="item" :value="item"></el-option>
          </el-select>
          <el-date-picker 
                    v-model="form.time" 
                    format="yyyy-MM-dd HH:mm:SS" 
                    value-format="yyyy-MM-dd HH:mm:SS" 
                    type="datetimerange" 
                    range-separator="至"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
          <el-button type="primary" @click="search">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableBody.data">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop=='reward_amount'" :class="reStyle(scope.row[item.prop])">
              {{reNum(scope.row[item.prop])}}
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
export default {
  name: "settlement",
  data() {
    return {
      path: ["比赛管理", "比赛列表", "竞猜项", "玩家订单"],
      isLoad: false,
      form: {
        userId: "",
        guessingItem: [],
        time: [],
        guess_item:""
      },
      tableBody,
      id:localStorage.guessId,
      guessName:localStorage.guessName
    };
  },
  methods: {
    init(){
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/getTeamById?guess_item_id=${this.id}`)
      .then(resp=>{
        if(resp.data.success){
          this.form.guessingItem=resp.data.data;
        }else{
          this.$message.error(resp.data.errors);
        }
      }).catch(_=>{})
      
      this.search();
    },
    // 接口数据处理获取
    search() {
      let params = {
        guess_item_id:this.id,
        user_id:this.form.userId,
        guess_item:this.form.guess_item==="全部"?'':this.form.guess_item,
        page:this.tableBody.curPage
      };

      if(this.form.time!=null){
        params.begin_time=this.form.time[0];
        params.end_time=this.form.time[1];
      }
      this.$http
        .get(`${process.env.GUESSING_HOST_URL}/api/admin/user_tally`, {
          params
        })
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.curPage = resp.data.data.current_page;
            this.tableBody.countTotal = resp.data.data.total;
            this.tableBody.pageSize = resp.data.data.per_page;
            this.tableBody.data = resp.data.data.data;
          }
        })
        .catch(resp => {});
    },
    reStyle(d){
      return d>0?'green':(d<0?'red':'');
    },
    reNum(d){
      return d>0?'+'+d:d;
    },
    goBack(){
      this.$router.push('/guessing-item');
    }
  },
  created() {
    this.init();
  }
};

const tableHeader = [
  { prop: "order_id", label: "订单ID" },
  { prop: "user_id", label: "用户ID" },
  { prop: "create_time", label: "下注时间" },
  { prop: "guess_item", label: "竞猜项" },
  { prop: "odds", label: "赔率" },
  { prop: "guess_amount", label: "投注额" },
  { prop: "reward_amount", label: "获得M币" }
];

const tableBody = {
  isLoad: false,
  header: tableHeader,
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 页总数
};
</script>

<style scoped>
.green{
  color:rgb(13,188,121);
}
.red{
  color:#f00;
}
</style>
