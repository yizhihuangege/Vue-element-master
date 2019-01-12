<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input v-model="searchData.prize_name" placeholder="输入奖品名称" clearable></el-input>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="searchData.status" clearable @change="search" placeholder="请选择状态">
                    <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" style="margin-left:20px;" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="openEditor" type="primary" icon="el-icon-plus">添加奖品</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <img v-if="item.prop==='icon'" :src="scope.row.icon" @click="viewPicture(scope.row.icon)" class="table-icon" :alt="scope.row.icon">
                    <span v-else-if="item.prop=='prize_type'">{{scope.row.prize_type|filterType}}</span>
                    <span v-else-if="item.prop=='status'">
                      <div>{{scope.row.status|filterStatus}}</div>
                      <div v-if="scope.row.status==2">{{scope.row.online_at}}</div>
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
                <el-pagination @current-change="search" background layout="total,prev, pager, next, jumper" :current-page.sync="tableBody.curPage" :total="tableBody.countTotal"
                    :page-size="tableBody.pageSize"></el-pagination>
            </el-row>
        </el-main>
        <!-- 单个图片查看器 -->
        <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
        <!-- 新增/编辑窗口 -->
        <el-dialog :title="editorDialog.title" v-if="editorDialog.visible" :visible.sync="editorDialog.visible" width="40%" :before-close="handleClose">
            <squared-up-editor @complete="search" v-if="editorDialog.visible" :visible.sync="editorDialog.visible" :data="editorDialog.data" :type='editorDialog.type'></squared-up-editor>
        </el-dialog>
    </section>
</template>

<script>
import { tableConfig } from "@/config/defaultData"
import squaredUpEditor from "./child/squaredUpEditor"


export default {
  name: "squared-up-config",
  components: {
    squaredUpEditor
  },
  data() {
    return {
      statusOption,
      tableBody:tableConfig(tableHeader,10),
      searchData:{
        status:1,
        prize_name: "",
      },
      editorDialog:{
        visible:false,
        type:"",
        title:"",
        data:{}
      },
      photoWatcher:{
        img:"",
        visible:false
      },
    }
  },
  filters:{
    filterType(val){
      return ["猫币", "折扣", "其他","谢谢参与"][val - 1];
    },
    filterStatus(val){
      return statusOption[val - 1].label;
    }
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad=true;
      let params = {
        prize_name: this.searchData.prize_name,
        page: this.tableBody.curPage,
        limit:this.tableBody.pageSize,
        status:this.searchData.status,
      };
      return this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/jiugongge`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows;
          }else{
            this.$message.error(resp.data.errors)
          }
        })
    },
    openEditor(row) {
      this.editorDialog.visible=true;
      this.editorDialog.title="添加奖品"
      this.editorDialog.data={};
      this.editorDialog.type="add"
      if(row.id){
        this.editorDialog.title="编辑奖品"
        this.editorDialog.type="edit"
        this.editorDialog.data=row
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？").then(_ => {done()}).catch(_ => {});
    },
    viewPicture(img) {
      this.photoWatcher.img = img;
      this.photoWatcher.visible = true;
    },
    remove(row){
      this.$confirm("确定删除此奖品？").then(_=>{
        this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_jiugongge`,{ id:row.id }).then(rsp=>{
          if(rsp.data.success){
            this.$message.success("删除成功");
            this.search()
          }else{
            this.$message.error(rsp.data.errors)
          }
        })
      }).catch(e=>{})
    }
  }
};

const statusOption=[
  { label:"已上线",value:1 },
  { label:"已下线",value:2 },
  { label:"已删除",value:3 },
]

const tableHeader=[
    { prop: "sort", label: "排序" },
    { prop: "prize_type", label: "奖品类型" },
    { prop: "prize_name", label: "奖品名称" },
    { prop: "icon", label: "图标展示" },
    { prop: "discount", label: "折扣" },
    { prop: "chance", label: "中奖概率(%)" },
    { prop: "price", label: "价值" },
    { prop: "status", label: "状态" },
    { prop: "number", label: "中奖数量" },
    { prop: "created_at", label: "上线时间" },
]

</script>
