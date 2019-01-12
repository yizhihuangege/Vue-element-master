<template>
  <section>
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
    <el-row>
        <el-tabs v-model="activeTab" @tab-click="search">
        <el-tab-pane label="王者荣耀" name="1"></el-tab-pane>
        <el-tab-pane label="英雄联盟" name="2"></el-tab-pane>
        </el-tabs>
    </el-row>
      <el-row :gutter="20">
          <el-col :span="4">
              <el-input v-model="searchData.name" placeholder="请输入英雄名称" clearable></el-input>
          </el-col>
          <el-col :span="4">
              <el-select v-model="searchData.attribute" placeholder="请选择英雄类型" clearable @change="search">
                  <el-option v-for="item in positionOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
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
              <el-button @click="openEditor" type="primary" icon="el-icon-plus">添加英雄</el-button>
          </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <el-button type="text" v-if="item.prop==='name'" size="small" @click="toHeroSkin(scope.row)">{{ scope.row.name }}</el-button>
            <img v-else-if="item.prop==='avatar'" :src="scope.row.avatar" @click="viewPicture(scope.row.avatar)" class="table-icon" :alt="scope.row.avatar">
            <span v-else-if="item.prop==='positions'">{{scope.row.positions|filterPositions}}</span>
            <span v-else-if="item.prop==='status'">{{scope.row.status|filterStatus}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="openEditor(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="remove(scope.row)" type="text" size="small" v-if="scope.row.status!=3">删除</el-button>
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
    <el-dialog :title="editorDialog.title" v-if="editorDialog.visible" :visible.sync="editorDialog.visible">
        <game-hero-editor @complete="search" v-if="editorDialog.visible" :visible.sync="editorDialog.visible" :data="editorDialog.data" :type='editorDialog.type'></game-hero-editor>
    </el-dialog>
    <!-- 单个图片查看器 -->
    <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
  </section>
</template>
<script>  
import gameHeroEditor from "./child/heroEditor"
import { tableConfig } from '@/config/defaultData'

export default {
  name: "game-hero",
  data() {
    return {
      activeTab:"1",
      positionOption,
      statusOption,
      tableBody:tableConfig(tableHeader,10),
      searchData: {
        name: "",
        attribute:"",
        status:1
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
  components: {
    gameHeroEditor
  },
  filters:{
      filterPositions(arr){
          let findArr=positionOption.filter(d=>{
              for(var i=0;i<arr.length;i++){
                  if(d.value==arr[i]){
                      return d
                  }
              }
          })
          let resultArr=findArr.map(d=>d.label)
          return resultArr.join(",")
      },
      filterStatus(val){
          return statusOption[val-1].label
      }
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad=true;
      let params = {
        name: this.searchData.name,
        page: this.tableBody.curPage,
        limit:this.tableBody.pageSize,
        attribute:this.searchData.attribute,
        status:this.searchData.status,
        relate_game:parseInt(this.activeTab),
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/gamehero`, {params}).then(resp => {
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
    toHeroSkin(row){
        this.$router.push({
            name:"gameSkin",
            params:{
                hero_id:row.id,
                hero_name:row.name
            }
        })
    },
    openEditor(row) {
      this.editorDialog.visible = true;
      this.editorDialog.title="添加英雄";
      this.editorDialog.type="add";
      this.editorDialog.data={}
      if (row.id) {
        // console.log(row);
        this.editorDialog.title = "编辑英雄";
        this.editorDialog.type = "edit";
        this.editorDialog.data = row;
      }
    },
    remove(row) {
      this.$confirm('确认删除此英雄?').then(_=>{
          let params={id:row.id}
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_gamehero`,params).then(resp=>{
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
};

const positionOption=[
    { label:"坦克",value:1 },
    { label:"战士",value:2 },
    { label:"刺客",value:3 },
    { label:"法师",value:4 },
    { label:"射手",value:5 },
    { label:"辅助",value:6 },
];
const statusOption=[
    { label:"已上线",value:1 },
    { label:"已下线",value:2 },
    { label:"已删除",value:3 },
];

const tableHeader = [
  { prop: "sort", label: "排序" },
  { prop: "alias", label: "称号" },
  { prop: "name", label: "名字" },
  { prop: "id", label: "英雄ID" },
  { prop: "avatar", label: "英雄头像" },
  { prop: "positions", label: "英雄定位" },
  { prop: "num", label: "皮肤数量" },
  { prop: "status", label: "状态" },
  { prop: "created_at", label: "创建时间" },
];

</script>

