<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
            <el-row type="flex" justify="space-between">
                <el-col class="search-title">标题:</el-col>
                <el-col :span="5">
                    <el-input  v-model="searchData.title" placeholder="请输入公告标题" clearable ></el-input>
                </el-col>
                
                <el-col class="search-title">类型:</el-col>
                <el-col :span="5">
                  <el-select v-model="searchData.type" placeholder="请选择类型" clearable @change="search">
                      <el-option label="公告" value="1"></el-option>
                      <el-option label="活动" value="2"></el-option>
                  </el-select>
                </el-col>

                <el-col class="search-title">状态:</el-col>
                <el-col :span="6">
                  <el-select v-model="searchData.status" placeholder="请选择状态" clearable @change="search">
                      <el-option label="已发布" value="1"></el-option>
                      <el-option label="即将发布" value="2"></el-option>
                      <el-option label="暂不发布" value="3"></el-option>
                      <el-option label="已过期" value="4"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="20">
                    <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
                    <el-button @click="openEditor" type="primary" icon="el-icon-plus">创建公告</el-button>
                </el-col>
            </el-row>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop=='status'">
                {{restatus(scope.row.status)}}
                <div v-if="scope.row.status===2">
                  {{scope.row.online_at}}
                </div>
            </span>
            <span v-else-if="item.prop==='type'">
              {{scope.row.type===1?"公告":"活动资讯"}}
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
        <notice-editor @complete="load" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></notice-editor>
    </el-dialog>
  </section>
</template>
<script>
import noticeEditor from "./child/noticeEditor.vue";

export default {
  name: "notice",
  data() {
    return {
      isLoad: false,
      searchData: {
        title: "",
        type:"",
        status:""
      },
      tableBody,
      editorDialogTitle: "",
      editorDialogVisible: false,
      editData: {},
      editorType: ""
    };
  },
  components: {
    noticeEditor
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
      let params = {
        title: this.searchData.title,
        page: this.tableBody.curPage,
        limit: this.tableBody.pageSize,
        type:this.searchData.type,
        status:this.searchData.status
      };
      // this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/announcement`, {params})
      this.$http
        .get(`${process.env.GUESSING_HOST_URL}/api/admin/announcement`, {
          params
        })
        .then(resp => {
          if (resp.data.success) {
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows;
          }
        })
        .catch(_ => {});
    },
    restatus(val) {
      return ["已发布", `即将发布`, "暂不发布", "已过期"][val - 1];
    },
    openEditor(val) {
      if (val.id) {
        this.editorDialogTitle = "编辑公告";
        this.editorType = "edit";
        this.editData = val;
      } else {
        this.editorDialogTitle = "创建公告";
        this.editorType = "add";
        this.editData = {};
      }
      this.editorDialogVisible = true;
    },

    remove(row) {
      this.$confirm("确认删除此条公告?")
        .then(_ => {
          let params = { id: row.id };
          this.$http
            .post(
              `${process.env.GUESSING_HOST_URL}/api/admin/delete_announcement`,
              params
            )
            .then(resp => {
              if (resp.data.success) {
                this.$message.success("删除成功");
                this.load();
              } else {
                this.$message.error(resp.data.errors);
              }
            });
        })
        .catch(_ => {});
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
  { prop: "title", label: "标题" },
  { prop: "created_at", label: "创建时间" },
  { prop: "expire_at", label: "有效期" },
  { prop: "type", label: "类型" },
  { prop: "status", label: "状态" }
];

const tableBody = {
  isLoad: false,
  header: tableHeader,
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 页总数
};
</script>

<style scoped>
.search-title{
  width:60px;line-height:2.5em;text-align:center;margin-left:20px;color: #606266;font-size: 14px;
}
</style>
