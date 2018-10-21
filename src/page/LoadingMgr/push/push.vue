<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="5">
                    <el-input style="width:80%" v-model="searchData.title" placeholder="请输入推送标题" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="searchData.type" placeholder="请选择推送类型" clearable @change="search">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                
                <el-col :span="6">
                    <el-date-picker
                        v-model="searchData.timeRange"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>

                <el-col :span="10">
                    <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
                    <el-button @click="openEditor" type="primary" icon="el-icon-plus">新增PUSH</el-button>
                </el-col>
            </el-row>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.loading">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop==='type'">
                {{reType(scope.row.type)}}
            </span>
            <span v-else-if="item.prop=='status'">
                <div>{{scope.row.status===1?"已推送":"即将推送"}}</div>
            </span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="openEditor(scope.row)" type="text" size="small" :disabled="scope.row.status===1">编辑</el-button>
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
    <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible">
        <push-editor @complete="search" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></push-editor>
    </el-dialog>
  </section>
</template>
<script>  
import pushEditor from "./child/pushEditor.vue";

export default {
  name: "push",
  data() {
    return {
      isLoad: false,
      typeOptions,
      searchData: {
        title: "",
        type:"",
        timeRange:[]
      },
      tableBody,
      editorDialogTitle: "",
      editorDialogVisible: false,
      editData: {},
      editorType: ""
    };
  },
  components: {
    pushEditor
  },
  methods: {
    load() {
      this.isLoad = true;
      Promise.all([this.search()])
        .then(resp => {
          this.isLoad = false;
        })
        .catch(_=> {
          this.isLoad=false;
        });
    },
    search() {
      this.tableBody.loading=true;
      let params = {
        title: this.searchData.title,
        page: this.tableBody.curPage,
        type:this.searchData.type
      };

      if(this.searchData.timeRange !==null && this.searchData.timeRange.length>0){
          params.start_at=this.searchData.timeRange[0]+" 00:00:00";
          params.end_at=this.searchData.timeRange[1]+" 23:59:59";
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/push`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.loading=false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows;
          }else{
            this.$message.error(resp.data.errors);
          }
        })
        .catch(_ => {});
    },
    reType(val){
        return ["比赛","公告","活动资讯","商品","自定义"] [val-1];
    },
    openEditor(row) {
      if (row.id) {
        this.editorDialogTitle = "编辑PUSH";
        this.editorType = "edit";
        this.editData = row;
      } else {
        this.editorDialogTitle = "添加PUSH";
        this.editorType = "add";
        this.editData = {};
      }
      this.editorDialogVisible = true;
    },
    remove(row) {
      this.$confirm('确认删除此条PUSH?').then(_=>{
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_push?id=${row.id}`)
          .then(resp=>{
              if(resp.data.success){
                  this.$message.success("删除成功");
                  this.load();
              }else{
                  this.$message.error(resp.data.errors);
              }
          })
          
      }).catch(_=>{})
    }
  },
  created() {
    this.load();
  }
};


const typeOptions=[
    {value:"1",label:"比赛"},
    {value:"2",label:"公告"},
    {value:"3",label:"活动资讯"},
    {value:"4",label:"商品"},
    {value:"5",label:"自定义跳转"},
];
const tableHeader = [
  { prop: "title", label: "标题" },
  { prop: "type", label: "推送类型" },
  { prop: "bind_content", label: "推送内容" },
  { prop: "push_at", label: "推送时间" },
  { prop: "status", label: "推送状态" },
  { prop: "click", label: "用户点击" }
];

const tableBody = {
  loading: true,
  header: tableHeader,
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 页总数
};
</script>

<style scoped>
</style>
