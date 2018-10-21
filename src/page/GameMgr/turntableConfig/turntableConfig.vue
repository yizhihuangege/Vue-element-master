<template>
    <section v-loading="isLoad">
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="4">
                    <el-input v-model="price_name" placeholder="输入奖品名称" clearable></el-input>
                </el-col>
                <el-col :span="3">
                    <el-button @click="search" type="primary" style="margin-left:20px;" icon="el-icon-search">查 询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="openEditor" type="primary" icon="el-icon-plus">新建奖品</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                  <template slot-scope="scope">
                    <img v-if="item.prop==='icon'" style="width:100%;max-width:200px" :src="scope.row.icon" alt="">
                    <span v-else-if="item.prop=='prize_type'">{{retype(scope.row.prize_type)}}</span>
                    <span v-else-if="item.prop=='status'">
                      <div>{{restatus(scope.row.status)}}</div>
                      <div v-if="scope.row.status==2">{{scope.row.online_at}}</div>
                    </span>
                    <span v-else-if="item.prop=='expire_hour'">
                      {{scope.row.prize_type===4?"+MAX":scope.row.expire_hour}}
                    </span>
                    <span v-else>{{scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="openEditor(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="log(scope.row)" type="text" size="small">日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="area" type="flex" justify="center">
                <el-pagination @current-change="search" background layout="total,prev, pager, next, jumper" :current-page.sync="tableBody.curPage" :total="tableBody.countTotal"
                    :page-size="tableBody.pageSize"></el-pagination>
            </el-row>
        </el-main>
        <!-- 新增/编辑窗口 -->
        <el-dialog :title="editorDialogTitle" :visible.sync="editorDialogVisible" width="60%" :before-close="handleClose">
            <turntable-editor @complete="search" v-if="editorDialogVisible" :visible.sync="editorDialogVisible" :data="editData" :type='editorType'></turntable-editor>
        </el-dialog>
        <!-- 日志dialog -->
        <el-dialog title="日志记录" :visible.sync="logDialogShow" width="600px">
          <log v-if="logDialogShow" :visible.sync="logDialogShow" :data="logData"></log>
        </el-dialog>

        
    </section>
</template>

<script>
import turntableEditor from "./child/turntableEditor.vue";
import log from "./child/log";

export default {
  name: "turntable-config",
  components: {
    turntableEditor,
    log
  },
  data() {
    return {
      editorId: "",
      isLoad: true,
      editorDialogTitle: "",
      editData: {},
      editorDialogVisible: false,
      editorType: "add",
      tableBody,
      price_name: "",
      logDialogShow: false,
      logData: {}
    };
  },
  created() {
    this.load();
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
    search() {
      this.tableBody.isLoad=true;
      let params = {
        prize_name: this.price_name,
        page: this.tableBody.curPage,
        limit: this.tableBody.pageSize
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/rotary_list`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows;
          }
        })
        .catch(resp => {});
    },
    openEditor(row) {
      if (row.id) {
        this.editData = row;
        this.editorDialogTitle = "编辑转盘内容";
        this.editorType = "edit";
        this.editorId = row.id;
      } else {
        this.editorType = "add";
        this.editorDialogTitle = "新增转盘内容";
        this.editData = {};
      }
      this.editorDialogVisible = true;
    },
    retype(val) {
      return ["猫币", "道具", "其他","谢谢参与"][val - 1];
    },
    restatus(val) {
      return ["已上线", "即将上线", "暂不上线","已下线"][val - 1];
    },
    log(row) {
      this.logDialogShow = true;
      this.logData = row;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};

const tableBody = {
  isLoad:true,
  header: [
    { prop: "id", label: "序号" },
    { prop: "prize_name", label: "奖品名称" },
    { prop: "icon", label: "图标展示" },
    { prop: "prize_type", label: "奖品类型" },
    { prop: "price", label: "价值(元)" },
    { prop: "created_at", label: "创建时间" },
    { prop: "chance", label: "中奖概率(%)" },
    { prop: "number", label: "中奖数量" },
    { prop: "status", label: "状态" },
    { prop: "expire_hour", label: "有效时间(时)" },
    { prop: "discount", label: "折扣" }
  ],
  data: [],
  curPage: 1, // 当前页数
  pageSize: 20, // 页大小
  countTotal: 0 // 总条数
};
</script>
<style scoped>
.blue {
  color: #409eff;
  cursor: pointer;
}
</style>
