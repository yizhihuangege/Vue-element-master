<template>
    <section v-loading="isLoad">
        <el-header>
            <auto-bread-crumb :forcePath="path"></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row>
              <h2>游戏名称:{{gameName}}
              </h2>
            </el-row>
            <el-row style="margin-top:20px">
                <el-col :span="2">
                    <el-button @click="operate" type="primary" style="margin-left:20px;" icon="el-icon-plus">添加队伍</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">

                <el-table-column v-for="(item,index) of tableBody.header" :key="index" :label="item.label" :prop="item.prop">
                    <template slot-scope="scope">
                        <span v-if="item.prop=='icon'">
                            <img style="width:100%;max-width:200px" :src="scope.row[item.prop]" alt="">
                        </span>
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

        <!-- 新增/编辑窗口 -->
        <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible" width="40%">
            <group-editor @complete="load" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></group-editor>
        </el-dialog>
    </section>
</template>

<script>
import groupEditor from "./child/groupEditor.vue";

export default {
  name: "group-slide",
  components: {
    groupEditor
  },
  data() {
    return {
      path:["游戏管理","游戏配置","队伍管理"],
      isLoad: true,
      editorDialogTitle: "队伍配置",
      editData: {},
      editorDialogVisible: false,
      editorType: "",
      tableBody,
      gameID: "",     //游戏ID
      gameName:""     //游戏名称
    };
  },
  created() {
    this.gameID = localStorage.group_id;
    this.gameName=localStorage.group_name;
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
        .catch(resp => {});
    },
    // 打开编辑对话框（编辑和新建都是同一个对话框）
    operate(row) {
      if (row.id) {
        this.editData = row;
        this.editorType = "edit";
      } else {
        this.editorType = "add";
        this.editData = {};
      }
      this.editorDialogVisible = true;
    },
    remove(row) {
      const params = {
        id: row.id
      };
      this.$confirm(`确定删除该游戏?`)
        .then(_ => {
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/team/delete`,params)
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
  },
  beforeDestroy(){
    localStorage.removeItem('group_name');
    localStorage.removeItem('group_id');
  }
};

const tableBody = {
  isLoad:true,
  header: [
    // { prop: "gameName", label: "游戏名称" },
    { prop: "name", label: "队伍名称" },
    { prop: "icon", label: "icon" },
    { prop: "created_at", label: "创建时间" }
  ],
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 页总数
};
</script>
