<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input v-model="slideContent" placeholder="游戏名称" clearable ></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="openDialog" type="primary" icon="el-icon-plus">添加游戏</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <el-button v-if="item.prop==='name'" @click="toGroup(scope.row)" type="text" size="small">{{scope.row.name}}</el-button>
                    <img v-else-if="item.prop==='bg_img'" :src="scope.row.bg_img" @click="viewPicture(scope.row.bg_img)" style="width:100%;max-width:200px" :alt="scope.row.bg_img">
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
                    :page-size="tableBody.pageSize">
                </el-pagination>
            </el-row>
        </el-main>
        <!-- 单个图片查看器 -->
        <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
        <!-- 新增/编辑窗口 -->
        <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible" width="40%">
            <game-config-editor @complete="search" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></game-config-editor>
        </el-dialog>
    </section>
</template>

<script>
import gameConfigEditor from "./child/gameConfigEditor";
import { tableConfig } from "../../../config/defaultData";

 
export default {
  name: "game-config",
  components: {
    gameConfigEditor
  },
  data() {
    return {
      editorDialogTitle: "",
      editData: {},
      editorDialogVisible: false,
      slideContent: "",
      editorType: "add",
      tableBody:tableConfig(tableHeader),
      photoWatcher:{
        img:"",
        visible:false
      },
    };
  },
  created() {
    this.search();
  },
  methods: {
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
    },
    toGroup(row){
      this.$router.push({
        name:"groupList",
        params:{
          gameName:row.name,
          gameID:row.id
        }
      })
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
    },
    viewPicture(img) {
      this.photoWatcher.img = img;
      this.photoWatcher.visible = true;
    },
  }
};

const tableHeader=[
    { prop: "name", label: "游戏名称" },  
    { prop: "bg_img", label: "背景图" },
    { prop: "created_at", label: "创建时间" }
];
</script>
<style scoped>
.picture {
  flex: 0 0 auto;
  margin: 5px;
  cursor: pointer;
  height: 130px;
  width: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(223, 223, 223, 0.301);
  background-size: cover;
}
</style>
