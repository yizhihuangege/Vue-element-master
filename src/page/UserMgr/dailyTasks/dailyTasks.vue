<template>
  <section >
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <el-menu :default-active="activeTab" mode="horizontal" @select="handleSelect" active-text-color="#409EFF">
          <el-submenu index="1">
            <template slot="title">{{typeTitle}}</template>
            <el-menu-item v-for="(item,index) in submenuConfig" :key="index" :index="item.path">{{item.title}}</el-menu-item>
          </el-submenu>
          <el-menu-item index="share">分享任务</el-menu-item>
        </el-menu>
      </el-row>
    <el-row style="margin-top:20px">
        <el-col :span="4">
            <div class="text">每个用户任务奖励:
              <span class="green">{{price}}</span>
            </div>
        </el-col>
        <el-col :span="8">
          <el-date-picker v-model="queryParams.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
          :picker-options="timeRangeConfig"></el-date-picker>
        </el-col>
        <el-col :span="2">
            <el-button @click="search(activeTab)" type="primary" icon="el-icon-search">查询</el-button>
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
        <el-pagination @current-change="search(activeTab)"
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

import { tableConfig,timeRangeConfig } from '../../../config/defaultData';
export default {
  name: "daily-tasks",
  data() {
    return {
      isLoad:false,
      tableBody:tableConfig(tableHeader1),
      timeRangeConfig,
      typeTitle:"签到任务",
      submenuConfig,
      activeTab: "sign",
      activeType:1,
      queryParams: {
        time:[]
      },
      requestUrl:`${process.env.GUESSING_HOST_URL}/api/admin/task_statistics`,
      price:200,
    };
  },
  created() {
      this.load();
    },
  methods: {
    load() {
      this.isLoad = true;
      Promise.all([this.search(this.activeTab)]).then(resp => {
          this.isLoad = false;
        }).catch(resp => {
          this.isLoad = false;
        });
    },
    search(path='sign') {
      this.tableBody.isLoad=true;
      if(this.activeTab==="share"){
        this.requestUrl=`${process.env.GUESSING_HOST_URL}/api/admin/share`;
      }else{
        this.requestUrl=`${process.env.GUESSING_HOST_URL}/api/admin/task_statistics`;
      }

      let params={task_type:path,page:this.tableBody.curPage,limit:this.tableBody.pageSize};
      if(this.queryParams.time!==null && this.queryParams.time.length>0){
        params.start_at=this.queryParams.time[0]+" 00:00:00";
        params.end_at=this.queryParams.time[1]+" 23:59:59";
      }

      this.submenuConfig.map(d=>{
        if(d.path===path){
          this.price=d.price;
        }
      })

      this.$http.get(this.requestUrl,{params}).then(resp=>{
        if(resp.data.success){
          this.tableBody.isLoad=false;

          if(this.activeTab!=="share"){
            let data=resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data=data.rows;
          }else{
            this.tableBody.countTotal=resp.data.data.length;
            this.tableBody.data=resp.data.data.map(d=>{
              d.u_m_coin=d.total*this.price;
              d.u_price=d.u_m_coin/1000;
              return d;
            });
          }
        }
      }).catch(e=>{})

    },
    handleSelect(key, keyPath) {
      this.activeTab=keyPath[keyPath.length-1];
      this.tableBody.header=keyPath.length>1?tableHeader1:tableHeader2;
      this.price=key==='share'?200:this.price;
      
      this.search(this.activeTab);
    },
    
    
  },
  watch:{
      activeTab(cur,old){
        
        this.submenuConfig.map(d=>{
          if(cur===d.path){
            this.typeTitle=d.title;
          }
        })
      }
    }
  
};


const tableHeader1 = [
  { prop: "date", label: "日期" },
  { prop: "total", label: "完成人数" },
  { prop: "m_coin", label: "消耗M币" },
  { prop: "price", label: "价值(元)" }
];
const tableHeader2 = [
  { prop: "date", label: "日期" },
  { prop: "total", label: "完成人数" },
  { prop: "wx", label: "微信" },
  { prop: "qq", label: "QQ" },
  { prop: "u_m_coin", label: "消耗M币" },
  { prop: "u_price", label: "价值(元)" }
];

const submenuConfig=[
  { title:"签到任务", path:"sign", price:200},
  { title:"邀请好友", path:"invitation",price:200 },
  { title:"了解龙猫电竞", path:"understand_guess",price:100 },
  { title:"下注体验", path:"bets_experience",price:100 },
  { title:"小游戏体验", path:"game_experience",price:100 },
  { title:"商品兑换", path:"commodity_exchange",price:100 },
  { title:"新用户奖励", path:"sign_register",price:500 },
];

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
