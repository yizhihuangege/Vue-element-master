<template>
  <section>
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <el-tabs v-model="activeTab" @tab-click="search">
          <el-tab-pane label="启动页配置" name="1"></el-tab-pane>
          <el-tab-pane label="幻灯片配置" name="2"></el-tab-pane>
          <el-tab-pane label="弹窗广告配置" name="3"></el-tab-pane>
        </el-tabs>
      </el-row>
      <el-row>
          <el-row type="flex" :gutter="20">
              <el-col :span="5">
                  <el-input v-model="searchData.title" :placeholder="'请输入'+staticConfig[activeTab-1].title+'标题及关键字内容'" clearable></el-input>
              </el-col>
              <el-col :span="2">
                  <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
              </el-col>
              <el-col :span="2">
                  <el-button @click="openEditor" type="primary" icon="el-icon-plus">新增{{staticConfig[activeTab-1].title}}</el-button>
              </el-col>
          </el-row>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <img v-if="item.prop==='url'" :src="scope.row.url" @click="viewPicture(scope.row.url)" class="table-icon" :alt="scope.row.url">
            <span v-else-if="item.prop=='status'">
                <div>{{scope.row.status | restatus}}</div>
                <div v-if="scope.row.status===2">{{scope.row.online_at}}</div>
            </span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="openEditor(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
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
    <el-dialog :title="editorDialog.title" :visible.sync="editorDialog.visible" width="60%">
        <advertising-editor @complete="search" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type="editorType" :activeTab="activeTab"></advertising-editor>
    </el-dialog>
    <!-- 单个图片查看器 -->
    <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
  </section>
</template>
<script>  
import { tableConfig} from '../../../config/defaultData';
import advertisingEditor from "./child/advertisingEditor";

export default {
  name: "advertisingConfig",
  data() {
    return {
      activeTab:"1",   // 1.启动页   2.幻灯片   3.弹窗广告
      staticConfig,
      searchData: {
        title: ""
      },
      tableBody:tableConfig(tableHeader,10),
      editorDialog:{
        title:"",
        type:"",
        visible:false,
        data:{}
      },

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
    advertisingEditor
  },
  filters:{
    restatus(val) {
      return ["已上线", "即将上线", "暂不上线","已过期"][val - 1];
    }
  },
  methods: {
    load() {
      this.isLoad = true;
      Promise.all([this.search()])
        .then(resp => {
          this.isLoad = false;
        })
        .catch(_=> {
          this.isLoad=false;
        });
    },
    search() {
      this.tableBody.isLoad=true;
      let params = {
        title: this.searchData.title,
        page: this.tableBody.curPage
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/${this.staticConfig[this.activeTab-1].path}`, {params})
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
        .catch(_ => {});
    },
    openEditor(val) {
      if (val.id) {
        this.editorDialogTitle = `编辑${this.staticConfig[this.activeTab-1].title}`;
        this.editorType = "edit";
        this.editData = val;
      } else {
        this.editorDialogTitle = `添加${this.staticConfig[this.activeTab-1].title}`;
        this.editorType = "add";
        this.editData = {};
      }
      this.editorDialogVisible = true;
    },
    remove(row) {
      this.$confirm(`确认删除此条${this.staticConfig[this.activeTab-1].title}?`).then(_=>{
          let params={id:row.id}
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_${this.staticConfig[this.activeTab-1].path}`,params)
          .then(resp=>{
              if(resp.data.success){
                  this.$message.success("删除成功");
                  this.load();
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
    this.load();
  }
};
const tableHeader = [
  { prop: "id", label: "序号" },
  { prop: "url", label: "图标" },
  { prop: "title", label: "标题" },
  { prop: "created_at", label: "创建时间" },
  { prop: "expire_at", label: "有效期" },
  { prop: "status", label: "状态" },
  { prop: "remark", label: "备注" }
];

const staticConfig=[
  {title:"启动页",path:"loading"},
  {title:"幻灯片",path:"banner"},
  {title:"弹窗广告",path:"advertising"}
];

</script>

<style scoped>
</style>
