<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <el-tabs v-model="activeTab" @tab-click="search">
          <el-tab-pane label="首页公告" name="0"></el-tab-pane>
          <el-tab-pane label="活动资讯" name="1"></el-tab-pane>
        </el-tabs>
      </el-row>
      <el-row>
            <el-row type="flex" justify="space-between">
                <el-col class="search-title">标题:</el-col>
                <el-col :span="5">
                    <el-input  v-model="searchData.title" :placeholder="'请输入'+staticConfig[activeTab].title+'标题'" clearable ></el-input>
                </el-col>
                <el-col class="search-title">状态:</el-col>
                <el-col :span="6">
                  <el-select v-model="searchData.status" placeholder="请选择状态" clearable @change="search">
                      <el-option label="已发布" value="1"></el-option>
                      <el-option label="即将发布" value="2"></el-option>
                      <el-option label="暂不发布" value="3"></el-option>
                      <el-option label="已过期" value="4"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="20">
                    <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
                    <el-button @click="openEditor" type="primary" icon="el-icon-plus">创建{{staticConfig[activeTab].title}}</el-button>
                </el-col>
            </el-row>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop==='status'">
                {{showStatus(scope.row.status)}}
                <div v-if="scope.row.status===2">{{scope.row.online_at}}</div>
            </span>
            <img v-else-if="item.prop==='cover'" :src="scope.row.cover" @click="viewPicture(scope.row.cover)" style="width:100%;max-width:200px" :alt="scope.row.cover">
            <span v-else-if="item.prop==='tag'">{{showTag(scope.row.tag)}}</span>
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
    <el-dialog :title="editorDialog.title" :visible.sync="editorDialog.visible" v-if="editorDialog.visible" width="60%">
        <notice-editor @complete="load" v-if="editorDialog.visible" :visible.sync="editorDialog.visible" :data="editorDialog.data" :type="editorDialog.type" :activeTab="activeTab"></notice-editor>
    </el-dialog>
    <!-- 单个图片查看器 -->
    <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
  </section>
</template>
<script>
import { tableConfig} from '../../../config/defaultData';
import noticeEditor from "./child/noticeEditor";

export default {
  name: "notice",
  data() {
    return {
      isLoad: false,
      searchData: {
        title: "",
        status:""
      },
      staticConfig,
      activeTab:"0",
      tableBody:tableConfig(tableHeader1,10),
      editorDialog:{
        title:"",
        visible:"",
        data:{},
        type:""
      },
      photoWatcher:{
        img:"",
        visible:false
      },
    };
  },
  components: {
    noticeEditor
  },
  methods: {
    load() {
      this.isLoad = true;
      Promise.all([this.search()]).then(resp => {
          this.isLoad = false;
        }).catch(resp => {
          this.isLoad = false;
        });
    },
    // 接口数据处理获取
    search() {
      this.tableBody.isLoad=true;
      let params = {
        title: this.searchData.title,
        page: this.tableBody.curPage,
        limit: this.tableBody.pageSize,
        status:this.searchData.status
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/${this.staticConfig[this.activeTab].path}`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.header=this.activeTab==="0"?tableHeader1:tableHeader2;
            this.tableBody.data = data.rows;
          }
        })
        .catch(_ => {});
    },
    showStatus(val) {
      return ["已发布", "即将发布", "暂不发布", "已过期"][val - 1];
    },
    showTag(val){
        return ["无","HOT","NEW"][val];
    },
    openEditor(row) {
      if (row.id) {
        this.editorDialog.title = `编辑${this.staticConfig[this.activeTab].title}`;
        this.editorDialog.type = "edit";
        this.editorDialog.data = row;
      } else {
        this.editorDialog.title = `创建${this.staticConfig[this.activeTab].title}`;
        this.editorDialog.type = "add";
        this.editorDialog.data = {};
      }
      this.editorDialog.visible = true;
    },
    viewPicture(img) {
      this.photoWatcher.img = img;
      this.photoWatcher.visible = true;
    },
    remove(row) {
      this.$confirm("确认删除此条公告?").then(_ => {
          let params = { id: row.id };
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_${this.staticConfig[this.activeTab].path}`,params).then(resp => {
              if (resp.data.success) {
                this.$message.success("删除成功");
                this.load();
              } else {
                this.$message.error(resp.data.errors);
              }
            });
        })
        .catch(_ => {});
    },
    handleClose(done) {
      this.$confirm("确认关闭？").then(_ => {
          done();
        }).catch(_ => {});
    }
  },
  created() {
    this.load();
  }
};

const staticConfig=[
  { title:"公告" ,path:"announcement" },
  { title:"资讯",path :"news" }
];

const tableHeader1 = [
  { prop: "id", label: "序号" },
  { prop: "title", label: "标题" },
  { prop: "created_at", label: "创建时间" },
  { prop: "expire_at", label: "有效期" },
  { prop: "status", label: "状态" }
];
const tableHeader2 = [
  { prop: "sort", label: "排序值" },
  { prop: "title", label: "标题" },
  { prop: "cover", label: "图标" },
  { prop: "tag",label: "标签"},
  { prop: "created_at", label: "创建时间" },
  { prop: "expire_at", label: "有效期" },
  { prop: "status", label: "状态" },
  {prop:"clicks",label:"点击数"}
];

</script>

<style scoped>

</style>
