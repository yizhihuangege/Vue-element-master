<template>
  <section>
    <el-header>
      <auto-bread-crumb :forcePath="['游戏管理','英雄管理',hero_name+'-皮肤']"></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row :gutter="20">
          <el-col :span="4">
              <el-input v-model="searchData.name" placeholder="请输入皮肤名称" clearable></el-input>
          </el-col>
          <el-col :span="4">
              <el-select v-model="searchData.status" placeholder="请选择状态" clearable @change="search">
                  <el-option v-for="item in statusOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
          </el-col>
          <el-col :span="2">
              <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
          </el-col>
          <el-col :span="2">
              <el-button @click="openEditor" type="primary" icon="el-icon-plus">添加皮肤</el-button>
          </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <img v-if="item.prop==='avatar'" :src="scope.row.avatar" @click="viewPicture(scope.row.avatar)" style="width:100%;max-width:200px" :alt="scope.row.avatar">
            <span v-else-if="item.prop==='status'">{{scope.row.status|filterStatus}}</span>
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
    <el-dialog :title="'英雄:'+hero_name+'——'+editorDialog.title" v-if="editorDialog.visible" :visible.sync="editorDialog.visible">
        <game-skin-editor @complete="search" v-if="editorDialog.visible" :visible.sync="editorDialog.visible" :data="editorDialog.data" :type='editorDialog.type'
        :hero_id="hero_id"></game-skin-editor>
    </el-dialog>
    <!-- 单个图片查看器 -->
    <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
  </section>
</template>
<script>  
import gameSkinEditor from "./child/gameSkinEditor";
import { tableConfig } from '@/config/defaultData';

export default {
  name: "game-skin",
  data() {
    return {
      hero_id:"",
      statusOption,
      searchData: {
          name:"",
          status:1
      },
      tableBody:tableConfig(tableHeader,10),
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
    };
  },
  components: {
    gameSkinEditor
  },
  filters:{
      filterStatus(val){
          return statusOption[val-1].label
      }
  },
  created() {
    this.hero_name=this.$route.params.hero_name;
    this.hero_id=this.$route.params.hero_id;
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad=true;
      let params = {
        name: this.searchData.name,
        page: this.tableBody.curPage,
        limit:this.tableBody.pageSize,
        status:this.searchData.status,
        hero_id:this.hero_id
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/gameheroskin`, {params}).then(resp => {
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
      this.editorDialog.visible = true;
      this.editorDialog.title="添加皮肤";
      this.editorDialog.type="add";
      this.editorDialog.data={}
      if (row.id) {
        this.editorDialog.title = "编辑皮肤";
        this.editorDialog.type = "edit";
        this.editorDialog.data = row;
      }
    },
    remove(row) {
      this.$confirm('确认删除此皮肤?').then(_=>{
          let params={id:row.id}
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_gameheroskin`,params).then(resp=>{
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
}

const statusOption=[
    { label:"已上线",value:1 },
    { label:"已下线",value:2 },
    { label:"已删除",value:3 },
];
const tableHeader = [
  { prop: "id", label: "ID" },
  { prop: "name", label: "皮肤名称" },
  { prop: "avatar", label: "皮肤图片" },
  { prop: "price", label: "价格(元)" },
  { prop: "status", label: "状态" },
  { prop: "created_at", label: "创建时间" },
];

</script>

