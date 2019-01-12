<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-date-picker v-model="searchData.group_date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="exportRecord" type="primary" icon="el-icon-download">导 出</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                    <template slot-scope="scope">
                        <section v-if="item.prop==='threshold'">{{ scope.row['threshold']==1?"是":"否" }}</section>
                        <section v-else-if="item.prop==='over'">{{ scope.row['over']==1?"是":"否" }}</section>
                        <section v-else>{{ scope.row[item.prop] }}</section>
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
  name: "group-purchase-rotation-detail",
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      searchData: {
          group_date:""
      },
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
        limit:this.tableBody.pageSize,
        group_date:this.searchData.group_date?this.searchData.group_date:"",
      }

      return this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/group_round`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data=data.rows.map(d=>{
                d.skin_name=d.good.skin_name
                return d;
            });
          }else{
              this.$message.error(resp.data.errors)
          }
        })
    },
    exportRecord(){
      window.open(`${process.env.GUESSING_HOST_URL}/api/admin/group_round_export`)
    },
  }
}

const tableHeader= [
    { prop: "group_goods_id", label: "商品ID" },
    { prop: "skin_name", label: "商品昵称" },
    { prop: "group_round", label: "参与轮次" },
    { prop: "group_mcoin", label: "使用猫币获取份数" },
    { prop: "group_cash", label: "使用现金获取份数" },
    { prop:"surplus_num",label:"真实剩余份数" },
    { prop: "threshold", label: "是否达到阈值" },
    { prop: "over", label: "是否完结" },
    { prop: "group_date", label: "参与日期" },
]
</script>

