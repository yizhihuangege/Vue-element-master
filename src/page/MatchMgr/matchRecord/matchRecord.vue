<template>
    <section v-loading="isLoad">
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <!-- 搜索栏参考此配置进行布局 -->
            <el-row type="flex" justify="space-between">
                <el-col :span="4">
                    <el-input v-model="queryParams.match_name" placeholder="比赛名称" style="width:80%" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="queryParams.game_id" placeholder="游戏名称" clearable>
                        <el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="queryParams.status" placeholder="状态" clearable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="10">
                    <el-date-picker 
                    v-model="queryParams.timeRange" 
                    format="yyyy-MM-dd HH:mm:SS" 
                    value-format="yyyy-MM-dd HH:mm:SS" 
                    type="datetimerange" 
                    range-separator="至"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-col>
                <el-col :span="3">
                    <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
                </el-col>
            </el-row>

            <el-row style="margin-top:20px;">
              <el-col :span="2">
                <el-button type="primary" @click="openEditor" icon="el-icon-plus">添加比赛</el-button>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="synchronize" icon="el-icon-time">同步数据</el-button>
              </el-col>
            </el-row>
            <!-- table-body -->
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="(item,index) of tableBody.header" :key="index" :label="item.label" :prop="item.prop">
                    <template slot-scope="scope">
                        <span v-if="item.prop==='status'" :class="scope.row[item.prop]==1?'green':(scope.row[item.prop]==2?'red':'')">
                            {{statusItem(scope.row[item.prop])}}
                        </span>
                        <span v-else-if="item.prop==='end_time'">
                          {{scope.row.status!==3?"------":scope.row.end_time}}
                        </span>
                        <span v-else-if="item.prop==='result'">
                          {{scope.row.status!==3?"------":scope.row.result}}
                        </span>
                        <span v-else-if="item.prop==='live_url'">
                          {{scope.row.live_url==null?"------":scope.row.live_url}}
                        </span>
                        <span v-else-if="item.prop=='item'" class="jc_item">
                            <span v-if="scope.row[item.prop]==false" @click="guessItem(scope.row)">添加</span>
                            <span v-else @click="guessItem(scope.row)">查看详情</span>
                        </span>
                        <span v-else-if="item.prop=='teams'" style="text-align:center">
                            <div>{{scope.row.team_1}}</div>
                            <div style="background: red;height: 1px"></div>
                            <div>{{scope.row.team_2}}</div>
                        </span>
                        <span v-else>
                            {{scope.row[item.prop]}}
                        </span>
                    </template>


                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status===1 || scope.row.status===2">
                          <el-button @click="openPushEditor(scope.row)" type="text" size="small" v-if="scope.row.is_pushed!==1">推送</el-button>
                          <el-button type="text" size="small" v-else disabled>已推送</el-button>
                        </span>
                        <el-button @click="openEditor(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="area" type="flex" justify="center">
                <el-pagination @current-change="search" background layout="total,prev, pager, next, jumper" :current-page.sync="tableBody.curPage" :total="tableBody.countTotal"
                    :page-size="20"></el-pagination>
            </el-row>
        </el-main>

        <!-- 比赛推送 Dialog -->
        <el-dialog title="比赛PUSH" :visible.sync="pushDialog.visible" v-if="pushDialog.visible">
          <match-push-editor  @pushComplete="search" v-if="pushDialog.visible" :visible.sync="pushDialog.visible" :id="pushDialog.id"></match-push-editor>
        </el-dialog>
        <!-- 新增/编辑 Dialog -->
        <el-dialog :title="editorDialog.title" :visible.sync="editorDialog.visible" v-if="editorDialog.visible" width="60%" :before-close="handleClose">
            <match-editor @editComplete="search" v-if="editorDialog.visible" :visible.sync="editorDialog.visible" :data="editorDialog.data"
                :type='editorDialog.type'></match-editor>
        </el-dialog>
    </section>
</template>

<script>
import matchEditor from "./child/matchEditor.vue";
import matchPushEditor from "./child/matchPushEditor"

export default {
  name: "match-record",
  components: {
    matchEditor,
    matchPushEditor
  },
  data() {
    return {
      isLoad: false,
      tableBody,
      options,
      pushDialog:{              // push弹窗配置
        id:"",
        visible:false
      },
      editorDialog:{            // 添加/编辑弹窗配置
        title:"",
        visible:false,
        type:"",
        data:{}
      },
      gameList: [],           //无分页游戏列表
      queryParams: {          
        match_name: "",
        game_id: "",
        status: 1,            
        timeRange: []
      },
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.getGameList();
      this.clearStorage();
      this.isLoad = true;
      Promise.all([this.search()])
        .then(resp => {
          this.isLoad = false;
        })
        .catch(resp => {
          this.isLoad = false;
        });
    },
    //获取所有游戏列表(不分页)
    getGameList() {
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/game/indexNoPage`)
        .then(resp => {
          if (resp.data.success) {
            this.gameList=resp.data.data;
          }else{
            this.$message.error(resp.data.errors)
          }
        })
        .catch(resp => {
          this.$message.error("游戏列表读取失败");
        });
    },
    clearStorage() {
      localStorage.removeItem("matchId");
      localStorage.removeItem("team_1");
      localStorage.removeItem("team_2");
      localStorage.removeItem("guessId");
      localStorage.removeItem("guessName");
      localStorage.removeItem("matchName");
    },
    //同步数据
    synchronize() {
      this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/synchronize`)
        .then(resp => {
          if (resp.data.success) {
            let data = resp.data.data;
            this.$message({
              type: "success",
              dangerouslyUseHTMLString: true,
              message: `<p><h3>已同步比赛数:${
                data.synchronized_matches
              }</h3></p><p><h3>已同步竞猜数:${data.synchronized_items}</h3></p>`
            });
            this.search();
          } else {
            this.$message.error(resp.data.errors);
          }
        })
        .catch(err => {});
    },
    search() {
      this.tableBody.isLoad=true;
      let params = {
        match_name: this.queryParams.match_name || "",
        game_id: this.queryParams.game_id || "",
        status: this.queryParams.status || "",
        page: this.tableBody.curPage
      };

      if (this.queryParams.timeRange!==null && this.queryParams.timeRange.length>0) {
        params.start_time = this.queryParams.timeRange[0];
        params.end_time = this.queryParams.timeRange[1];
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/match_list`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            let data = resp.data.data;
            this.tableBody.curPage = data.pagenation.current;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows.map(d => {
              d.teams = {
                team_1: d.team_1,
                team_2: d.team_2
              };
              return d;
            });
          }
        });
    },
    openPushEditor(row){
      this.pushDialog.visible=true;
      this.pushDialog.id=row.id;
    },
    //添加、编辑打开同一弹窗
    openEditor(row) {
      if(row.id){
        this.editorDialog.title = "编辑比赛";
        this.editorDialog.data = row;
        this.editorDialog.type = "edit";
      }else{
        this.editorDialog.title = "添加比赛";
        this.editorDialog.type = "add";
        this.editorDialog.data={};
      }
      this.editorDialog.visible = true;
    },
    //跳转竞猜项
    guessItem(row) {
      localStorage.matchName = row.match_name;
      localStorage.matchId = row.id;
      localStorage.team_1 = row.team_1;
      localStorage.team_2 = row.team_2;
      this.$router.push("/guessing-item");
    },
    statusItem(val) {
      return ["竞猜中", "比赛中", "已结算", "流局"][val - 1];
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    remove(row) {
      const params = {
        id: row.id
      };
      this.$confirm("确定删除该游戏吗?").then(_ => {
        this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/delete_match`,
            params)
          .then(resp => {
            if (resp.data.success) {
              this.$message.success("删除成功");
              this.search();
            } else {
              this.$message.error(resp.data.errors);
            }
          })
          .catch(_ => {});
      });
    }
  }
};

const options= [
          { label: "竞猜中", value: 1 },
          { label: "比赛中", value: 2 },
          { label: "已结算", value: 3 },
          { label: "流局", value: 4 }
      ];

const tableBody = {
  isLoad:true,
  header: [
    { prop: "id", label: "比赛ID" },
    { prop: "game", label: "游戏名称" },
    { prop: "match_name", label: "比赛名称" },
    { prop: "teams", label: "参赛队伍" },
    { prop: "status", label: "状态" },
    {prop:"live_url",label:"直播链接"},
    { prop: "item", label: "竞猜项" },
    { prop: "min_bet", label: "最低下注金额" },
    { prop: "start_time", label: "比赛开始时间" },
    { prop: "end_time", label: "比赛结束时间" },
    { prop: "result", label: "结果" }
  ],
  data: [],
  curPage: 1,
  pageSize: 20,
  countTotal: 0
};
</script>
<style scoped>
.green {
  color: rgb(13, 188, 121);
}
.red {
  color: #f00;
}
.jc_item {
  cursor: pointer;
  color: #409eff;
}
</style>
