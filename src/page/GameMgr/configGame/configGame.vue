<template>
  <section>
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <el-col class="x-area" :span="2">
          <el-button type="primary" @click="openDialog" icon="el-icon-plus">添加游戏</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  @click="openDialog(scope.row)" type="text" size="small">编辑</el-button>
            <el-button  @click="remove(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" v-if="dialogVisible" :visible.sync="dialogVisible" width="50%">
        <config-game-editor :data="editData" v-if="dialogVisible" :visible.sync="dialogVisible" @comlete="search" :type="editorType" @complete="search"></config-game-editor>
      </el-dialog>
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
import configGameEditor from "../configGame/child/configGameEditor";
export default {
  name: "configGame",
  components: {
    configGameEditor
  },
  data() {
    return {
      tableBody,
      dialogVisible:false,
      editorType:"",
      dialogTitle:"",
      editData:{}      
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
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/mall/game/index?is_page=${this.tableBody.curPage}`,)
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            this.tableBody.countTotal = resp.data.data.total;
            this.tableBody.pageSize = resp.data.data.per_page;
            this.tableBody.data = resp.data.data.data;
          }
        })
        .catch(resp => {});
    },
    //添加、编辑打开同一窗口
    openDialog(row){
      if(row.id){
        this.dialogTitle="编辑游戏排序";
        this.editorType="edit";
        this.editData=row;
      }else{
        this.dialogTitle="添加游戏排序";
        this.editorType="add";
        this.editData={}
      }
      this.dialogVisible=true;
    },
    remove(row) {
      
      this.$confirm("确定删除此游戏？").then(_=>{
        this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/mall/game/delete`, {id: row.id})
        .then(resp => {
          if (resp.data.success) {
            this.$message.success("删除成功");
            this.search();
          } else {
            this.$message.error(resp.data.errors);
          }
        })
        .catch(_=> {});
      }).catch(_=>{})

      
    }
  },
  created() {
    this.load();
  }
};

const tableHeader = [
  { prop: "id", label: "游戏ID" },
  { prop: "game_name", label: "游戏名称" },
  { prop: "created_at", label: "创建时间" },
  { prop: "order_value", label: "排序值" }
];

const tableBody = {
  isLoad: true,
  header: tableHeader,
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 页总数
};
</script>

<style scoped>
</style>
