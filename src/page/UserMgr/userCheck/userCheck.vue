<template>
  <section >
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row :gutter="20">
          <el-col :span="4">
            <el-input type="text" placeholder="请输入用户ID或用户手机号" v-model="queryParams.title" clearable></el-input>
          </el-col>
          <el-col :span="2">
              <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
          </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop==='status'">
              <el-button type="text" v-if="scope.row.status===1" disabled>审核通过</el-button>
              <el-button type="text" v-else-if="scope.row.status===2" @click="openEditor(scope.row,'edit')">审核失败</el-button>
              <el-button type="text" v-else @click="openEditor(scope.row,'edit')">未审核</el-button>
            </span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="openEditor(scope.row,'view')" type="text" size="small" v-if="scope.row.status!==3">查看</el-button>
                <el-button @click="log(scope.row)" type="text" size="small">日志</el-button>
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

    <!-- 编辑Dialog -->
    <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible" width="50%">
        <user-check-editor @complete="search" v-if="editorDialogVisible" :type="editorDialogType" :visible.sync="editorDialogVisible" :data="editData"></user-check-editor>
    </el-dialog>

    <!-- 日志 Dialog -->
    <el-dialog v-if="logDialogShow" :visible.sync="logDialogShow" width="30%" title="用户日志">
      <log v-if="logDialogShow" :visible.sync="logDialogShow" :id="logId"></log>
    </el-dialog>
  </section>
</template>
<script>

import { tableConfig} from '../../../config/defaultData';
import userCheckEditor from './child/userCheckEditor'
import log from './child/log'

export default {
  name: "user-check",
  components:{
    userCheckEditor,log
  },
  data() {
    return {
      queryParams: {
        title:""
      },
      tableBody:tableConfig(tableHeader),
      editorDialogTitle:"验证审核",
      editorDialogType:"",
      editorDialogVisible:false,
      editData:{},
      logDialogShow:false,
      logId:""
    }
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad=true;
      let params={
        title:this.queryParams.title,
        page:this.tableBody.curPage
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/video_check`,{params})
      .then(resp=>{
        if(resp.data.success){
          this.tableBody.isLoad=false;
          let data=resp.data.data;
          this.tableBody.countTotal=data.pagenation.total;
          this.tableBody.data=data.rows;

          this.tableBody.data.map(d=>{
            d.admin_name=d.admin.username;
            return d;
          })
        }
      }).catch(_=>{})
    },
    openEditor(row,type){
      if(type==="edit"){
        this.editorDialogType="edit";
        this.editorDialogTitle="审核验证";
      }else{       
        this.editorDialogType="view";
        this.editorDialogTitle="审核详情";
      }
      this.editorDialogVisible=true;
      this.editData=row;
    },
    log(row){
      this.logDialogShow=true;
      this.logId=row.user_id;
    }
  },
};

const tableHeader = [
   { prop: "id", label: "序号" },
  { prop: "nickname", label: "用户名" },
  { prop: "user_id", label: "用户ID" },
  { prop: "mobile", label: "手机号" },
  { prop: "updated_at", label: "验证时间" },
  { prop: "status", label: "状态" },
  { prop: "comment", label: "验证说明" },
  { prop: "admin_name", label: "执行账号" }
];

</script>

<style scoped>
.text{
  text-align: center;
  line-height:40px;
}
.green{
  color:#00f;
}
</style>
