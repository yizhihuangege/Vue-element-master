<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input v-model="searchData.name" placeholder="请输入商品名称" clearable></el-input>
                </el-col>
                
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop"></el-table-column>
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
  name: "tsy-goods-list",
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      searchData: {
        name:""
      }
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad = true;
      let params = {
        is_page:1,
        limit:this.tableBody.pageSize,
        page: this.tableBody.curPage,
        name:this.searchData.name.trim(),
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/tsy_skin`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data = resp.data.data;
            this.tableBody.data = data.rows;
            this.tableBody.countTotal=data.pagenation.total;
          }else{
              this.$message.error(resp.data.errors)
          }
        });
    },
  }
};

const tableHeader= [
    { prop: "id", label: "ID" },
    { prop: "name", label: "商品名称" },
    { prop: "count", label: "数量" },
    { prop: "gamename", label: "游戏名称" },
    { prop: "price", label: "商品价格(元)" },
    { prop: "soldcount", label: "已出售数" },
    { prop: "created_at", label: "创建时间" },
];

</script>

