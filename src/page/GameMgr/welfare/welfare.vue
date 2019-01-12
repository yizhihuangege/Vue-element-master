<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input v-model="searchData.user_id" placeholder="请输入用户ID" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="searchData.code" placeholder="请输入福利码" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="searchData.status" placeholder="请选择状态" clearable @change="search">
                        <el-option v-for="item in statusOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="editorDialogVisible = true" type="primary" icon="el-icon-plus">创建福利码</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <span v-if="item.prop==='status'">{{scope.row.status|filterStatus}}</span>
                    <span v-else-if="item.prop==='used_at'">{{scope.row.status===2?scope.row.used_at:"------"}}</span>
                    <span v-else-if="item.prop==='user_id'">{{scope.row.user_id==0?'':scope.row.user_id}}</span>
                    <span v-else>{{scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="remove(scope.row)" type="text" size="small" v-if="scope.row.status===1">作废</el-button>
                        <el-button @click="remark(scope.row)" type="text" size="small">备注</el-button>
                        <el-button @click="viewLog(scope.row)" type="text" size="small">日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="area" type="flex" justify="center">
                <el-pagination @current-change="search" background layout="total,prev, pager, next, jumper" :current-page.sync="tableBody.curPage" :total="tableBody.countTotal"
                    :page-size="tableBody.pageSize"></el-pagination>
            </el-row>
        </el-main>
        
        <!-- 新增窗口 -->
        <el-dialog title="生成福利码" :visible.sync="editorDialogVisible" width="30%" v-if="editorDialogVisible" >
            <welfare-editor @complete="search" v-if="editorDialogVisible" :visible.sync="editorDialogVisible"></welfare-editor>
        </el-dialog>
        <!-- 日志dialog -->
        <el-dialog title="日志记录" :visible.sync="logDialog.visible" width="600px" v-if="logDialog.visible">
          <log v-if="logDialog.visible" :visible.sync="logDialog.visible" :data="logDialog.data"></log>
        </el-dialog>
        <!-- 备注 Dialog -->
        <el-dialog title="备注说明" :visible.sync="remarkDialog.visible" v-if="remarkDialog.visible" width="500px">
          <el-input type="textarea" v-model="remarkDialog.remark" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
          <span slot="footer" class="dialog-footer">
              <el-row class="area" type="flex" justify="center">
                  <el-button @click="remarkDialog.visible=false">取 消</el-button>
                  <el-button type="primary" @click="confirmRemark">确 定</el-button>
              </el-row>
          </span>
        </el-dialog>
    </section>
</template>

<script>
import { tableConfig} from '@/config/defaultData';
import welfareEditor from "./child/welfareEditor";
import log from "./child/log";

export default {
  name: "welfare",
  components: {
    welfareEditor,
    log
  },
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      statusOptions,
      searchData:{
        user_id:"",
        code:"",
        status:""
      },
      remarkDialog:{
        visible:false,
        remark:"",
        id:""
      },
      editorDialogVisible:false,
      logDialog:{
        visible:false,
        data:{}
      }
    }
  },
  filters:{
    filterStatus(val){
      return ["未使用", "已使用", "已过期","已作废"][val - 1];
    }
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad=true;
      let params = {
        page:this.tableBody.curPage,
        user_id:this.searchData.user_id,
        title:this.searchData.code,
        status:this.searchData.status
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/welfare`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows;
          } 
        })
    },
    viewLog(row) {
      this.logDialog.visible = true;
      this.logDialog.data = row;
    },
    remark(row){
      this.remarkDialog.visible=true;
      this.remarkDialog.id=row.id;
      this.remarkDialog.remark=row.remark;
    },
    remove(row){
      this.$confirm("确定删除此条福利码？").then(_=>{
        this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_welfare?id=${row.id}`).then(resp=>{
          if(resp.data.success){
            this.$message.success("删除成功");
            this.search();
          }else{  
            this.$message.error(resp.data.errors);
          }
        })
      }).catch(_=>{})
    },
    confirmRemark(){
      let params={
        id:this.remarkDialog.id,
        remark:this.remarkDialog.remark
      }
      this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/welfare_remark`,params).then(resp=>{
        if(resp.data.success){
          this.$message.success("编辑备注成功");
          this.remarkDialog.visible=false;
          this.search();
        }else{
          this.$message.error(resp.data.errors);
        }
      }).catch(_=>{})
    }
  }
};

const statusOptions=[
  { label:"未使用",value:1 },
  { label:"已使用",value:2 },
  { label:"已过期",value:3 },
  { label:"已作废",value:4 },
];

const tableHeader=[
    { prop: "id", label: "序号" },
    { prop: "code", label: "福利码" },
    { prop: "price", label: "价值" },
    { prop: "status", label: "使用状态" },
    { prop: "user_id", label: "用户ID" },
    { prop: "created_at", label: "创建时间" },
    { prop: "expire_at", label: "有效期" },
    { prop: "used_at", label: "使用时间" },
    { prop: "description", label: "创建说明" }
];
</script>
<style scoped>
</style>
