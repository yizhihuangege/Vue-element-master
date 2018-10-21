<template>
  <section >
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
          <template>
            <el-tabs v-model="activeTab"> 
                <el-tab-pane label="签到任务" name="1"></el-tab-pane>
                <el-tab-pane label="分享任务" name="2"></el-tab-pane>
                <el-tab-pane label="邀请好友" name="3"></el-tab-pane>
            </el-tabs>
          </template>
      </el-row>
          
    <el-row>
        <el-col :span="3">
            <div class="text">每个用户任务奖励:
              <span class="green">{{price}}</span>
            </div>
        </el-col>
        <el-col :span="7">
          <el-date-picker
            v-model="queryParams.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-col>
        <el-col :span="2">
            <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
        </el-col>
    </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span>{{scope.row[item.prop]}}</span>
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
  name: "daily-tasks",
  data() {
    return {
      isLoad:false,
      price:200,
      activeTab: "1",
      queryParams: {
        time:[]
      },
      tableBody,
    };
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
      this.tableBody.isLoad=true;
      let params={},    //请求参数
          url=`${process.env.GUESSING_HOST_URL}`;       //请求url
      if(this.queryParams.time!==null && this.queryParams.time.length>0){
        params.start_at=this.queryParams.time[0]+" 00:00:00";
        params.end_at=this.queryParams.time[1]+" 23:59:59";
      }

      if(this.activeTab==1){
        url+="/api/admin/user_sign_log";
        this.price=200;
        this.tableBody.header=tableHeader1;
      }else if(this.activeTab==2){ 
        this.price=200;
        url+="/api/admin/share";
        this.tableBody.header=tableHeader2;
      }else{
        this.price=500;
        url+="/api/admin/invitation"
        this.tableBody.header=tableHeader1;
      }

      this.$http.get(url,{params})
      .then(resp=>{
        if(resp.data.success){
          this.tableBody.isLoad=false;
          let data=resp.data.data;
          this.tableBody.countTotal=data.length;
          this.tableBody.data=data.map(d=>{

            d.u_m_coin=this.price*d.total;
            d.u_price=d.u_m_coin/1000;
            return d;
          });
        }
      }).catch(e=>{})

      
    },
  },
  created() {
    this.load();
  },
  watch:{
      activeTab(newVal,oldVal){
          this.search();
      }
  }
};

//签到、邀请任务表头配置
const tableHeader1 = [
  { prop: "date", label: "日期" },
  { prop: "persons", label: "完成人数" },
  { prop: "m_coin", label: "消耗M币" },
  { prop: "price", label: "价值(元)" }
];
//分享任务表头配置
const tableHeader2 = [
  { prop: "date", label: "日期" },
  { prop: "total", label: "完成人数" },
  { prop: "wb", label: "微博" },
  { prop: "wx", label: "微信朋友圈" },
  { prop: "qq", label: "QQ空间" },
  { prop: "u_m_coin", label: "消耗M币" },
  { prop: "u_price", label: "价值(元)" }
];


const tableBody = {
  isLoad:true,
  header: tableHeader1,
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 页总数
};
</script>

<style scoped>
.text{
  text-align: center;
  line-height:40px;
}
.green{
  color:rgb(13,188,121);
}
</style>
