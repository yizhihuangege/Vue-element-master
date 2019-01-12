<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-select v-model="searchData.game_id" placeholder="请选择游戏" @change="search" clearable>
                      <el-option v-for="item in gameOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
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
                    <el-button @click="openEditor" type="primary" icon="el-icon-plus">添加轮播</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <img v-if="item.prop==='cover'" :src="scope.row.cover" @click="viewPicture(scope.row.cover)" class="table-icon" :alt="scope.row.cover">
                    <div v-else-if="item.prop==='status'">{{ scope.row.status==1?"已上线":"已下线" }}</div>
                    <div v-else-if="item.prop==='game_id'">{{ scope.row.game_id | filterGame }}</div>
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
        <el-dialog :title="editorDialog.title" v-if="editorDialog.visible" :visible.sync="editorDialog.visible" width="40%">
            <squared-up-banner-editor @complete="search" v-if="editorDialog.visible" :visible.sync="editorDialog.visible" :data="editorDialog.data" :type='editorDialog.type'></squared-up-banner-editor>
        </el-dialog>
    </section>
</template>

<script>
import { tableConfig } from "@/config/defaultData"
import squaredUpBannerEditor from "./child/squaredUpBannerEditor"

export default {
  name: "squared-up-banner",
  components: {
    squaredUpBannerEditor
  },
  data() {
    return {
      statusOption,
      gameOption,
      tableBody:tableConfig(tableHeader,10),
      searchData:{
        status:"",
        game_id: "",
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
    filterGame(val){
      return gameOption[val-1].label
    }
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad=true;
      let params = {
        game_id: this.searchData.game_id,
        page: this.tableBody.curPage,
        limit:this.tableBody.pageSize,
        status:this.searchData.status,
      };
      return this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/jiugonggeactivity`, {params}).then(resp => {
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
      this.editorDialog.title="添加轮播"
      this.editorDialog.data={};
      this.editorDialog.type="add"
      if(row.id){
        this.editorDialog.title="编辑轮播"
        this.editorDialog.type="edit"
        this.editorDialog.data=row
      }
    },
    viewPicture(img) {
      this.photoWatcher.img = img;
      this.photoWatcher.visible = true;
    },
    remove(row){
      this.$confirm("确定删除此轮播图？").then(_=>{
        this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_jiugonggeactivity`,{ id:row.id }).then(rsp=>{
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
}

const statusOption=[
  { label:"已上线",value:1 },
  { label:"已下线",value:2 },
]
const gameOption=[
  { label:"王者荣耀",value:1 },
]

const tableHeader=[
    { prop: "sort", label: "排序" },
    { prop: "title", label: "标题" },
    { prop: "cover", label: "图片" },
    { prop: "game_id", label: "游戏" },
    { prop: "created_at", label: "创建时间" },
    { prop: "remark", label: "备注" },

]

</script>
