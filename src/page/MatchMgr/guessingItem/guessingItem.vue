<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb :forcePath="path"></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <h2>竞猜项:{{teams.team_1}}
          <span class="vs">vs</span>
          {{teams.team_2}}
        </h2>
      </el-row>
      <el-row>
        <el-col class="x-area" :span="2" style="padding: 10px 0">
          <el-button type="primary" @click="openDialog">添加竞猜项</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop==='status'" :style="{color:colorFont(scope.row[item.prop])}">{{reType(scope.row[item.prop])}}</span>
            <span v-else-if="item.prop==='item_1'" style="text-align: center;">
              <div>{{scope.row[item.prop]}}</div>
              <div style="background: red;height: 1px;"></div>
              <div>{{scope.row.item_2}}</div>
            </span>
            <span v-else-if="item.prop==='result'">
              {{scope.row.result===""?"------":scope.row.result}}
            </span>
            <span v-else-if="item.prop==='amount_1'" style="text-align: center;">
              <div>{{scope.row[item.prop]}}</div>
              <div style="background: red;height: 1px;"></div>
              <div>{{scope.row.amount_2}}</div>
            </span>
            <span v-else-if="item.prop==='odds_1'" style="text-align: center;">
              <div>{{scope.row[item.prop]}}</div>
              <div style="background: red;height: 1px;"></div>
              <div>{{scope.row.odds_2}}</div>
            </span>
            <span v-else-if="item.prop==='number_1'" style="text-align: center;">
              <div>{{scope.row[item.prop]}}</div>
              <div style="background: red;height: 1px;"></div>
              <div>{{scope.row.number_2}}</div>
            </span>
            <a v-else-if="item.prop==='wjdd'" style="color:#409eff;cursor:pointer" @click="check(scope.row)">查看</a>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  @click="openDialog(scope.row)" type="text" size="small" :disabled="scope.row.status===3 || scope.row.status===4">编辑</el-button>
            <el-button  @click="remove(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" v-if="dialogVisible" :visible.sync="dialogVisible" width="50%">
        <guessing-item-editor :data="editorData" :type="editorType" v-if="dialogVisible" :visible.sync="dialogVisible" @complete="search"></guessing-item-editor>
      </el-dialog>
      <el-row class="area" type="flex" justify="center" v-if="tableBody.data.length">
        <el-pagination @current-change="search"
                       background
                       layout="total,prev, pager, next, jumper"
                       :current-page.sync="tableBody.curPage"
                       :total="tableBody.countTotal"
                       :page-size="tableBody.pageSize">
        </el-pagination>
      </el-row>
    </el-main>
  </section>
</template>

<script>
  import guessingItemEditor from "../guessingItem/child/guessingEditor";

  export default {
    name: "guessingItem",
    components: {
      guessingItemEditor
    },
    data() {
      return {
        path:["比赛管理","比赛列表","竞猜项"],      // force-path
        isLoad: false,
        tableBody,
        matchId: "",
        dialogTitle:"",
        dialogVisible:false,  // 子组件可见性
        editorData:{},        // 向子组件传递当前行的数据
        editorType:false,     // 弹窗状态：true编辑,false添加
        teams:{}              // 标题展示的竞猜项的参赛队伍
      }
    },
    created() {
      this.matchId=localStorage.matchId;
      this.teams={
        team_1:localStorage.team_1,
        team_2:localStorage.team_2
      }
      this.load();
    },
    methods: {
      // 添加、编辑打开同一弹窗
      openDialog(row) {
        if(row.id){
          this.dialogTitle="编辑竞猜项";
          this.editorData= row;
          this.editorType = true;
        }else{
          this.dialogTitle="新增竞猜项";
          this.editorData = {};
          this.editorType= false;
        }
        this.dialogVisible = true;
      },
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
        const params = {
            id: this.matchId,
            page: this.tableBody.curPage
        }
        this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/item_list`, {params})
          .then((resp) => {
            if(resp.data.success) {
              this.tableBody.isLoad=false;
              this.tableBody.curPage = resp.data.data.pagenation.current;
              this.tableBody.countTotal = resp.data.data.pagenation.total;
              this.tableBody.data = resp.data.data.rows;
            }
          })
          .catch((resp) => {

          })
      },
      remove(row) {
        this.$confirm("确定删除此竞猜项？")
        .then(_=>{
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_item`,{id:row.id})
          .then((resp) => {
            if(resp.data.success) {
              this.$message.success('删除成功')
              this.search();
            } else {
              this.$message.error(resp.data.errors);
            }
          })
          .catch(_ => {})
        }).catch(_=>{})
      },

      reType(val) {
        return ["竞猜中","比赛中","已结算","流局"][val-1];
      },
      // type类型返回样式
      colorFont(val) {
        return val==1?'red':(val==2?'green':'');
      },
      // 跳转玩家结算页
      check(row) {
        localStorage.guessName=row.item_name;
        localStorage.guessId=row.id;
        this.$router.push('/settlement');
      }
    },
    
  }
  const tableHeader = [
    { prop: "id", label: "ID" },
    { prop: "item_name", label: "竞猜名称" },
    { prop: "status", label: "状态" },
    { prop: "item_1", label: "投注项" },
    { prop: "amount_1", label: "投注额" },
    { prop: "odds_1", label: "赔率" },
    { prop: "number_1", label: "投注人数" },
    { prop: "result", label: "结果" },
    { prop: "start_time", label: "开始时间" },
    { prop: "rake", label: "抽成" },
    { prop: "wjdd", label: "玩家订单" },
  ]

  const tableBody = {
    isLoad: true,
    header: tableHeader,
    data: [],
    curPage: 1, // 当前页数
    pageSize: 20, // 页大小
    countTotal: 0 // 数据总条数
  }
</script>

<style scoped>
.vs{
  font-weight: normal;
}
</style>
