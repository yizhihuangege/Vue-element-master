<template>
    <section>
        <el-header>
            <auto-bread-crumb :forcePath="path"></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row>
              <h2>游戏名称:{{gameName}}</h2>
            </el-row>
            <el-row style="margin-top:20px" :gutter="20">
              <el-col :span="2">
                <el-button @click="search" icon="el-icon-search" type="primary">搜索</el-button>
              </el-col>
                <el-col :span="2">
                    <el-button @click="operate" type="primary" style="margin-left:20px;" icon="el-icon-plus">添加队伍</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="(item,index) of tableBody.header" :key="index" :label="item.label" :prop="item.prop">
                    <template slot-scope="scope">
                        <img v-if="item.prop==='icon'" :src="scope.row.icon" @click="viewPicture(scope.row.icon)" style="width:100%;max-width:200px" :alt="scope.row.icon">
                        <span v-else>{{scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="operate(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="area" type="flex" justify="center">
                <el-pagination @current-change="search" background layout="total,prev, pager, next, jumper" :current-page.sync="tableBody.curPage" :total="tableBody.countTotal"
                    :page-size="tableBody.pageSize"></el-pagination>
            </el-row>
        </el-main>
        <!-- 单个图片查看器 -->
        <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
        <!-- 新增/编辑窗口 -->
        <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible" width="40%">
            <group-editor @complete="search" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></group-editor>
        </el-dialog>
    </section>
</template>

<script>
import groupEditor from "./child/groupEditor.vue";
import { tableConfig } from "@/config/defaultData";

export default {
  name: "group-list",
  components: {
    groupEditor
  },
  data() {
    return {
      path:["游戏管理","游戏配置","队伍管理"],
      editorDialogTitle: "队伍配置",
      editData: {},
      editorDialogVisible: false,
      editorType: "",
      tableBody:tableConfig(tableHeader),
      gameID: "",     //游戏ID
      gameName:"",     //游戏名称
      photoWatcher:{
        img:"",
        visible:false
      },
    };
  },
  created() {
    this.gameID = this.$route.params.gameID;
    this.gameName=this.$route.params.gameName;
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad=true;
      let params={
        game_id:this.gameID,
        page:this.tableBody.curPage
      }
      return this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/team/index`,{params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.total;
            this.tableBody.data = data.data;
            this.tableBody.pageSize = data.per_page;
          } else {
            this.$message.error(resp.data.errors);
          }
        })
    },
    // 打开编辑对话框（编辑和新建都是同一个对话框）
    operate(row) {
      this.editorDialogVisible = true;
      this.editorDialogTitle="添加队伍";
      this.editorType="add";
      if (row.id) {
        this.editorDialogTitle="编辑队伍"
        this.editData = row;
        this.editorType = "edit";
      }
    },
    remove(row) {
      this.$confirm(`确定删除该游戏?`).then(_ => {
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/team/delete`,{ id:row.id })
            .then(resp => {
              if (resp.data.success) {
                this.$message.success("删除成功");
                this.search();
              } else {
                this.$message.error(resp.data.errors);
              }
            });
        }).catch(_ => {});
    },
    viewPicture(img) {
      this.photoWatcher.img = img;
      this.photoWatcher.visible = true;
    }
  },
};

const tableHeader=[
  { prop: "name", label: "队伍名称" },
  { prop: "icon", label: "icon" },
  { prop: "created_at", label: "创建时间" }
];
</script>
