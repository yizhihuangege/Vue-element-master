<template>
    <section v-loading="isLoad">
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="5">
                    <el-input v-model="slideContent" placeholder="游戏名称" clearable ></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" style="margin-left:40px;" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="2"  style="margin-left:20px;">
                    <el-button @click="openDialog" type="primary" icon="el-icon-plus">添加游戏</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">

                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <span v-if="item.prop=='name'" @click="toGroup(scope.row)" class="blue">{{scope.row.name}}</span>
                    <img v-else-if="item.prop==='bg_img'" style="width:100%;max-width:200px" :src="scope.row.bg_img" alt="">
                    <span v-else>{{scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="openDialog(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="area" type="flex" justify="center">
                <el-pagination @current-change="search" background layout="total,prev, pager, next, jumper" :current-page.sync="tableBody.curPage" :total="tableBody.countTotal"
                    :page-size="tableBody.pageSize"></el-pagination>
            </el-row>
        </el-main>
        <!-- 新增/编辑窗口 -->
        <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible" width="40%">
            <game-editor @complete="load" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></game-editor>
        </el-dialog>
    </section>
</template>

<script>
import { formatDate } from "../../../util/time.js";
import gameEditor from "./child/gameEditor.vue";

export default {
  name: "game-slide",
  components: {
    gameEditor
  },
  data() {
    return {
      isLoad: false,
      editorDialogTitle: "",
      editData: {},
      editorDialogVisible: false,
      slideContent: "",
      editorType: "add",
      tableBody
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
      this.tableBody.isLoad=true;
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/game/index?name=${this.slideContent}&page=${this.tableBody.curPage}`)
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.total;
            this.tableBody.pageSize = data.per_page;
            this.tableBody.data = data.data;
          }
        })
        .catch(resp => {});
    },
    toGroup(row){
      localStorage.setItem('group_name',row.name);
      localStorage.setItem('group_id',row.id);
      this.$router.push('/group-list');
    },
    // 打开编辑对话框（编辑和添加都是同一个对话框）
    openDialog(row) {
      if (row.id) {
        this.editorDialogTitle="编辑游戏"
        this.editData = row;
        this.editorType = "edit";
      } else {
        this.editorDialogTitle="添加游戏"
        this.editorType = "add";
        this.editData = {};
      }
      this.editorDialogVisible = true;
    },
    remove(row) {
      this.$confirm(`确定删除此游戏?`)
        .then(_ => {
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/game/delete`,{id:row.id})
            .then(resp => {
              if (resp.data.success) {
                this.$message.success("删除成功");
                this.search();
              } else {
                this.$message.error(resp.data.errors);
              }
            });
        })
        .catch(_ => {});
    }
  }
};

const tableBody = {
  isLoad:true,
  header: [
    { prop: "name", label: "游戏名称" },
    { prop: "bg_img", label: "背景图" },
    { prop: "created_at", label: "创建时间" }
  ],
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 页总数
};
</script>
<style scoped>
  .blue{
    color:#409EFF;
    cursor: pointer;
  }
</style>
