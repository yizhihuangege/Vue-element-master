<template>
  <section>
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row :gutter="20">
          <el-col :span="4">
              <el-input v-model="searchData.title" placeholder="请输入小游戏名称" clearable></el-input>
          </el-col>

          <el-col :span="4">
              <el-select v-model="searchData.source" placeholder="请选择来源" clearable @change="search">
                  <el-option v-for="item in sourceOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
          </el-col>
          <el-col :span="2">
              <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
          </el-col>
          <el-col :span="2">
              <el-button @click="openEditor" type="primary" icon="el-icon-plus">添加游戏</el-button>
          </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <img v-if="item.prop==='cover'" :src="scope.row.cover" @click="viewPicture(scope.row.cover)" style="width:100%;max-width:200px" :alt="scope.row.cover">
            <span v-else-if="item.prop=='source'">{{scope.row.source===1?"系统":"H5"}}</span>
            <span v-else-if="item.prop=='status'">{{scope.row.status===1?"显示":"不显示"}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="openEditor(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="remove(scope.row)" type="text" size="small" v-if="scope.row.source===2">删除</el-button>
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

    <!-- 新增/编辑窗口 -->
    <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible">
        <game-manage-editor @complete="search" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></game-manage-editor>
    </el-dialog>
    <!-- 单个图片查看器 -->
    <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
  </section>
</template>
<script>  
import gameManageEditor from "./child/gameManageEditor";
import { tableConfig} from '@/config/defaultData';

export default {
  name: "gameManagement",
  data() {
    return {
      sourceOptions,
      searchData: {
        title: "",
        source:""
      },
      tableBody:tableConfig(tableHeader,10),
      editorDialogTitle: "",
      editorDialogVisible: false,
      editData: {},
      editorType: "",
      photoWatcher:{
        img:"",
        visible:false
      },
    };
  },
  components: {
    gameManageEditor
  },
  methods: {
    search() {
      this.tableBody.isLoad=true;
      let params = {
        title: this.searchData.title,
        page: this.tableBody.curPage,
        limit:this.tableBody.pageSize,
        source:this.searchData.source
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/game_management`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows;
          }else{
            this.$message.error(resp.data.errors);
          }
        })
    },
    openEditor(row) {
      if (row.id) {
        this.editorDialogTitle = "编辑游戏";
        this.editorType = "edit";
        this.editData = row;
      } else {
        this.editorDialogTitle = "添加游戏";
        this.editorType = "add";
        this.editData = {};
      }
      this.editorDialogVisible = true;
    },
    remove(row) {
      this.$confirm('确认删除此条小游戏?').then(_=>{
          let params={id:row.id}
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_gamemanagement`,params)
          .then(resp=>{
              if(resp.data.success){
                  this.$message.success("删除成功");
                  this.search();
              }else{
                  this.$message.error(resp.data.errors);
              }
          })
          
      }).catch(_=>{})
    },
    viewPicture(img) {
      this.photoWatcher.img = img;
      this.photoWatcher.visible = true;
    },
  },
  created() {
    this.search();
  }
};

const sourceOptions=[
    {label:"系统",value:1},
    {label:"H5",value:2}
];

const tableHeader = [
  { prop: "sort", label: "排序" },
  { prop: "game_name", label: "游戏名称" },
  { prop: "cover", label: "封面图标" },
  { prop: "source", label: "来源" },
  { prop: "link", label: "链接" },
  { prop: "status", label: "状态" },
  { prop: "description", label: "描述" }
];

</script>

<style scoped>
.green {
  color: rgb(13, 188, 121);
}
.red {
  color: #f00;
}
</style>
