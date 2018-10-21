<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
            <el-row type="flex" justify="space-between">
                <el-col style="width:100px;line-height:2.5em;text-align:center;margin-left:20px;" >
                    关键字：
                </el-col>
                <el-col :span="7">
                    <el-input style="width:80%" v-model="searchData.title" placeholder="请输入弹窗标题以及关键字内容" clearable></el-input>
                </el-col>
                <el-col :span="20">
                    <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
                    <el-button @click="openEditor" type="primary" icon="el-icon-plus">新增弹窗</el-button>
                </el-col>
            </el-row>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop=='url'">
                <img :src="scope.row.url" :alt="scope.row.url" style="max-width:200px;width:100%">
            </span>
            <span v-else-if="item.prop=='status'">
                <div>{{restatus(scope.row.status)}}</div>
                <div v-if="scope.row.status===2">{{scope.row.online_at}}</div>
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
    <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible" width="60%">
        <advertising-editor @complete="load" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></advertising-editor>
    </el-dialog>
  </section>
</template>
<script>  
import advertisingEditor from "./child/advertisingEditor.vue";

export default {
  name: "toast",
  data() {
    return {
      isLoad: false,
      searchData: {
        title: ""
      },
      tableBody,
      editorDialogTitle: "",
      editorDialogVisible: false,
      editData: {},
      editorType: ""
    };
  },
  components: {
    advertisingEditor
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
      this.tableBody.isLoad=true;
      let params = {
        title: this.searchData.title,
        page: this.tableBody.curPage
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/advertising`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows;
          }else{
            this.$message.error(resp.data.errors);
          }
        })
        .catch(_ => {});
    },
    restatus(val) {
      return ["已上线", "即将上线", "暂不上线","已过期"][val - 1];
    },
    openEditor(val) {
      if (val.id) {
        this.editorDialogTitle = "编辑弹窗";
        this.editorType = "edit";
        this.editData = val;
      } else {
        this.editorDialogTitle = "添加弹窗";
        this.editorType = "add";
        this.editData = {};
      }
      this.editorDialogVisible = true;
    },

    remove(row) {
      this.$confirm('确认删除此条弹窗广告?').then(_=>{
          let params={id:row.id}
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_advertising`,params)
          .then(resp=>{
              if(resp.data.success){
                  this.$message.success("删除成功");
                  this.load();
              }else{
                  this.$message.error(resp.data.errors);
              }
          })
          
      }).catch(_=>{})
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
  created() {
    this.load();
  }
};
const tableHeader = [
  { prop: "id", label: "序号" },
  { prop: "url", label: "图标" },
  { prop: "title", label: "标题" },
  { prop: "created_at", label: "创建时间" },
  { prop: "expire_at", label: "有效期" },
  { prop: "status", label: "状态" },
  { prop: "remark", label: "备注" }
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
.green {
  color: rgb(13, 188, 121);
}
.red {
  color: #f00;
}
</style>
