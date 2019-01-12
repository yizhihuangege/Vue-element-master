<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <!-- <el-col :span="4">
                  <el-input placeholder="请输入中奖用户ID" v-model="searchData.user_id" clearable></el-input>
                </el-col> -->
                <el-col :span="2">
                    <el-button @click="search" type="primary">刷新</el-button>
                </el-col><el-col :span="2">
                    <el-button @click="exportExcel" type="primary" icon="el-icon-download">导出EXCEL</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <section v-if="item.prop==='timeRotation'">
                        <section>{{ scope.row.created_at }}</section>
                        <section>第{{ scope.row.group_round }}轮</section>
                    </section>
                    <span v-if="item.prop==='delivery_status'">{{ scope.row.delivery_status |filterStatus }}</span>
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

import { formatDateAndTime } from "@/util/time"
import { tableConfig } from "@/config/defaultData";
// import discountConfig from "./child/discountConfig"

export default {
  name: "group-purchase-rotation",
  components:{
    // discountConfig
  },
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      searchData: {
        user_id:"",
      },
      discountConfigDialog:{
        visible:false
      },
    };
  },
  created() {
    this.search();
  },
  filters:{
    filterTime(val){
      return formatDateAndTime(val*1000)
    },
    filterStatus(val){
        return statusOption[val-1].label
    }
  },
  methods: {
    search() {
      this.tableBody.isLoad = true;
      let params = {
        page: this.tableBody.curPage,
        limit:this.tableBody.pageSize,
        jackpot:1,
      }

      return this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/group_round_count`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data=data.rows;
          }else{
              this.$message.error(resp.data.errors);
          }
        })
    },
    exportExcel(){
        window.open(`${process.env.GUESSING_HOST_URL}/api/admin/group_round_count_jackport`)
    }
  }
}

const statusOption=[
    { label:"未兑换",value:1 },
    { label:"已提交",value:2 },
    { label:"已发放",value:3 },
]

const tableHeader= [
    { prop: "user_id", label: "中奖用户ID" },
    { prop: "nickname", label: "中奖用户昵称" },
    { prop: "group_mcoin", label: "猫币获取份数" },
    { prop: "group_cash", label: "现金获取份数" },
    { prop: "skin_name", label: "秒杀皮肤名称" },
    { prop: "timeRotation", label: "参与日期/轮次" },
    { prop: "delivery_status", label: "兑换状态" },
]
</script>