<template>
  <section >
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
            <el-row>
                <el-col :span="4">
                    <el-input style="width:80%" v-model="queryParams.user_id" placeholder="输入用户ID" clearable></el-input>
                </el-col>
                
                <el-col :span="8">
                    <el-date-picker v-model="queryParams.timeRange" format="yyyy-MM-dd HH:mm:SS" value-format="yyyy-MM-dd HH:mm:SS" type="datetimerange" range-separator="至"
                        start-placeholder="开始时间" end-placeholder="结束时间">
                    </el-date-picker>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
                </el-col>
            </el-row>
      </el-row>
      <el-table :data="tableBody.data">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="remark(scope.row)" type="text" size="small">备注</el-button>
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

    <!-- 备注Dialog -->
    <el-dialog title="备注说明" :visible.sync="dialogVisible" width="30%">
        <el-input type="textarea" v-model="remarks"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-row class="area" type="flex" justify="center">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="ok">完 成</el-button>
            </el-row>
        </span>
    </el-dialog>

  </section>
</template>
<script>
import { tableConfig } from "../../../config/defaultData";
export default {
  name: "user-feedback",
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      queryParams: {
        user_id: "",
        timeRange:[]
      },
      dialogVisible:false,
      remarks:"",
      editId:""
    };
  },
  methods: {
    // 接口数据处理获取
    search() {
      this.tableBody.isLoad=true;
      let params = {
        page: this.tableBody.curPage,
        user_id: this.queryParams.user_id,
        limit:this.tableBody.pageSize
      };
      
      if(this.queryParams.timeRange!=null && this.queryParams.timeRange.length>0){
        params.start_at=this.queryParams.timeRange[0];
        params.end_at=this.queryParams.timeRange[1]
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/feedback`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=true;
            let data = resp.data.data;
            this.tableBody.countTotal=data.pagenation.total;
            this.tableBody.data = data.rows;
          }
        })
        .catch(_ => {});
    },
    remark(row){
        this.dialogVisible=true;
        console.log(row)
        this.remarks=row.remarks;
        this.editId=row.id;
    },
    cancel(){
        this.remarks="";
        this.dialogVisible=false;
    },
    ok(){
        let params={
            id:this.editId,
            remarks:this.remarks
        }
        this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/feedback_remark`,params)
        .then(resp=>{
            if(resp.data.success){
                this.$message.success("编辑成功");
                this.dialogVisible=false;
                this.search()
            }else{
                this.$message.error(resp.data.errors)
            }
        }).catch(_=>{})
    }
  },
  created() {
    this.search();
  }
};
const tableHeader = [
  { prop: "user_id", label: "用户ID" },
  { prop: "nickname", label: "用户昵称" },
  { prop: "created_at", label: "反馈时间" },
  { prop: "content", label: "反馈内容" },
  { prop: "user_contact", label: "联系方式"},
  {prop:"remarks",label:"备注"}
];

</script>

<style scoped>
</style>
