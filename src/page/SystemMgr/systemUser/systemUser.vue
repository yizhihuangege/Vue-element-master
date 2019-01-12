<template>
  <section>
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row type="flex" justify="start">
        
        <el-col :span="2" style="margin-left:20px">
            <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4">
            <el-button @click="openEditor" type="primary" icon="el-icon-plus">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
              <span v-if="item.prop==='status'">{{scope.row[item.prop] ==1?"正常":"禁用"}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="openEditor(scope.row)" type="text" size="small">编辑</el-button>
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
import { default as menu } from "@/config/menuConfig"
console.log(menu)

export default {
  name: "systemUser",
  data() {
    return {
      tableBody:tableConfig(tableHeader)
    };
  },
  methods: {
    // 接口数据处理获取
    search() {
      this.tableBody.isLoad=true;
      let params={
        page:this.tableBody.curPage
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/role`,{ params })
        .then(resp => {
          if (resp.data.success) {
              this.tableBody.isLoad=false;
              let data=resp.data.data;
              this.tableBody.countTotal=data.pagenation.total;
              this.tableBody.data=data.rows;
          }
        });
    },
    openEditor(row){

    },
  },
  created() {
    this.search();
  }
};

const tableHeader = [
  { prop: "id", label: "id" },
  { prop: "name", label: "名称" },
  { prop: "status", label: "状态" },
  { prop: "created_at", label: "创建时间" },
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
