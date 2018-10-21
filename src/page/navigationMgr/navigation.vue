<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="4">
            <el-input  v-model="queryParams.title" placeholder="请输入标题" clearable></el-input>
        </el-col>
        <el-col :span="2" style="margin-left:20px">
            <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4">
            <el-button @click="openEditor" type="primary" icon="el-icon-plus">添加导航</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop=='icon'">
                <img :src="scope.row.icon" style="width:200px" alt="">
            </span>
            <span v-else-if="item.prop=='type'">
                {{reType(scope.row.type)}}
            </span>
            <span v-else-if="item.prop=='status'">
                {{scope.row.status==1?'显示':'不显示'}}
            </span>
            <span v-else-if="item.prop=='platform'">
                {{replatform(scope.row.platform)}}
            </span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="openEditor(scope.row)" type="text" size="small">编辑</el-button>
                <el-button v-if="scope.row.type==2" @click="remove(scope.row)" type="text" size="small">删除</el-button>
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


    <!-- 添加、编辑Dialog -->
    <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible" width="60%">
        <nav-editor @complete="load" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></nav-editor>
    </el-dialog>
  </section>
</template>
<script>

import navEditor from './child/navEditor';

export default {
  name: "navigation",
  components:{
      navEditor
  },
  data() {
    return {
      isLoad: true,
      queryParams: {
        title:""
      },
      tableBody,
      editorDialogTitle:"",
      editorDialogVisible:false,
      editData:{},
      editorType:""
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
    // 接口数据处理获取
    search() {
        this.tableBody.isLoad=true;
      let params = {
        page: this.tableBody.curPage,
        title:this.queryParams.title
      };
      this.$http
        .get(`${process.env.GUESSING_HOST_URL}/api/admin/navigation`, {params})
        .then(resp => {
          if (resp.data.success) {
              this.tableBody.isLoad=false;
              let data=resp.data.data;
              this.tableBody.countTotal=data.pagenation.total;
              this.tableBody.data=data.rows;
          }
        })
        .catch(_ => {});
    },
    reType(val){
        return val===1?"系统":"H5";
    },
    replatform(val){
        return val===1?"安卓":(val===2?"IOS":"全平台");
    },
    openEditor(row){
        if(row.id){         //编辑
            this.editorDialogTitle="编辑导航"
            this.editData=row;
            this.editorType="edit";
        }else{              //添加
            this.editorDialogTitle="添加导航"
            this.editData={};
            this.editorType="add";
        }
        this.editorDialogVisible=true;

    },
    remove(row){
        this.$confirm("确定删除此导航？")
        .then(_=>{
            this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_navigation`,{id:row.id})
            .then(resp=>{
                if(resp.data.success){
                    this.$message.success("删除成功");
                    this.search();
                }else{
                    this.$message.error(resp.data.errors);
                }
            }).catch(_=>{})

        }).catch(_=>{})
    }
  },
  created() {
    this.load();
  }
};
const pay_type = [{ value: 1, label: "支付宝" }, { value: 2, label: "微信" }];

const tableHeader = [
  { prop: "sort", label: "排序" },
  { prop: "title", label: "标题" },
  { prop: "type", label: "类型" },
  { prop: "link", label: "链接" },
  { prop: "icon", label: "图标" },
  { prop: "platform", label: "应用平台" },
  { prop: "status", label: "状态" }
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
.green{
  color:rgb(13,188,121);
}
.red{
  color:#f00;
}
</style>
