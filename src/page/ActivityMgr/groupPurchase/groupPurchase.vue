<template>
  <section>
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row :gutter="20">
          <el-col :span="5">
              <el-input v-model="searchBox.keyword" placeholder="请输入关键词" clearable></el-input>
          </el-col>
          <el-col :span="4">
              <el-select v-model="searchBox.status" placeholder="请选择状态" clearable @change="search">
                  <el-option v-for="(item,index) in statusOption" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
          </el-col>
          <el-col :span="2">
              <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-col>
          <el-col :span="2">
              <el-button type="primary" @click="openEditor" icon="el-icon-plus">添加物品</el-button>
          </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
            <template slot-scope="scope">
                <section v-if="item.prop==='skin_avatar'">
                    <img :src="scope.row.skin_avatar" :alt="scope.row.skin_avatar" class="table-icon"  @click="viewPicture(scope.row.skin_avatar)">
                </section>
                <section v-else-if="item.prop==='status'"> {{ scope.row.status | filterStatus }} </section>
                <section v-else>{{ scope.row[item.prop] }}</section>
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
    <el-dialog :title="editorDialog.title" v-if="editorDialog.visible" :visible.sync="editorDialog.visible" width="40%">
        <group-purchase-editor v-if="editorDialog.visible" :visible.sync="editorDialog.visible" :type="editorDialog.type" :data="editorDialog.data" @complete="search"></group-purchase-editor>
    </el-dialog>
    <photo-watcher :img="photoWatcher.img" :visible.sync="photoWatcher.visible"></photo-watcher>
  </section>
</template>
<script>
import { tableConfig } from "@/config/defaultData";
import { formatDateAndTime } from "@/util/time"
import groupPurchaseEditor from "./child/groupPurchaseEditor"

export default {
  name: "group-purchase",
  components:{
      groupPurchaseEditor,
  },
  data() {
    return {
      statusOption,
      tableBody:tableConfig(tableHeader),
      searchBox:{
          keyword:"",
          status:1,
      },
      editorDialog:{
          visible:false,
          title:"",
          type:"",
          data:{},
      },
      photoWatcher:{
        img:"",
        visible:false
      },
    };
  },
  filters:{
      filterStatus(val){
          return statusOption[val].label
      },
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.tableBody.isLoad = true;
      let params={
          keyword:this.searchBox.keyword,
          page:this.tableBody.curPage,
          status:this.searchBox.status,
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/groupgood`,{ params }).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data=resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data=data.rows;
          }else{
              this.$message.error(resp.data.errors);
          }
        })
    },
    viewPicture(img) {
      this.photoWatcher.img = img;
      this.photoWatcher.visible = true;
    },
    openEditor(row){
        this.editorDialog.visible=true;
        this.editorDialog.title="添加物品";
        this.editorDialog.type="add";
        this.editorDialog.data={};
        if(row.game_hero_name){
            this.editorDialog.type="edit";
            this.editorDialog.title="编辑物品";
            this.editorDialog.data=row;
        }
    },
    remove(row){
        let params={ id:row.id }
        this.$confirm("确定删除?").then(_=>{
            this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/offline_groupgood`,params)
            .then(resp=>{
                if(resp.data.success){
                    this.$message.success("删除成功")
                    this.search()
                }else{
                    this.$message.error(resp.data.errors)
                }
            })
        }).catch(e=>{})
    },
  }
}

const statusOption=[
    { label:"全部",value:"" },
    { label:"已上线",value:1 },
    { label:"已下线",value:2 },
]

const tableHeader = [
  { prop: "id", label: "ID" },
  { prop: "game_hero_name", label: "所属英雄" },
  { prop: "skin_name", label: "皮肤名称"},
  { prop: "skin_avatar", label: "图片展示" },
  { prop: "price", label: "皮肤价值(元)" },
  { prop: "round", label: "上线轮次" },
  { prop: "per_mcoin", label: "每份价值(M币)" },
  { prop: "group_total_cash", label: "已拼购现金" },
  { prop: "group_total_mcoin", label: "已拼购猫币" },
  { prop: "status", label: "上线状态" },
];

</script>
