<template>
  <section>
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
          <el-col :span="5" class="mr15">
              <el-input v-model="searchBox.user_id" placeholder="用户ID" clearable></el-input>
          </el-col>
          <el-col :span="5" class="mr15">
              <el-input v-model="searchBox.mobile" placeholder="手机号" clearable></el-input>
          </el-col>
          <el-col :span="5" class="mr15">
            <el-input v-model="searchBox.real_name" placeholder="真实姓名" clearable></el-input>
          </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">

            <el-button type="text" v-if="item.prop==='is_banned'" @click="statusEdit(scope.row)">{{scope.row[item.prop]===0?'正常':'封禁'}}</el-button>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  @click="tieUp(scope.row)" type="text" size="small">换绑手机</el-button>
            <el-button  @click="more(scope.row)" type="text" size="small">更多</el-button>
            <el-button  @click="journal(scope.row)" type="text" size="small">日志</el-button>
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

    <!-- 封禁/解封 Dialog -->
    <el-dialog title="封禁设置" :visible.sync="banDialog.show" v-if="banDialog.show" width="30%">
      <ban-editor :data="banDialog.data" v-if="banDialog.show" :visible.sync="banDialog.show" @complete="search"></ban-editor>
    </el-dialog>
    <!-- 换绑手机Dialog -->
    <el-dialog title="换绑手机" :visible.sync="tieUpDialog.show" v-if="tieUpDialog.show" width="30%">
      <tie-up-editor :data="tieUpDialog.data" v-if="tieUpDialog.show" :visible.sync="tieUpDialog.show" @complete="search"></tie-up-editor>
    </el-dialog>

    <!-- 查看更多Dialog -->
    <el-dialog title="用户详情" :visible.sync="moreDialog.show" v-if="moreDialog.show" width="30%">
      <more-editor :data="moreDialog.data" v-if="moreDialog.show" :visible.sync="moreDialog.show"></more-editor>
    </el-dialog>
    <!-- 日志Dialog -->
    <el-dialog title="用户日志" :visible.sync="journalDialog.show" v-if="journalDialog.show" width="30%">
      <journal :data="journalDialog.data" v-if="journalDialog.show" :visible.sync="journalDialog.show"></journal>
    </el-dialog>
  </section>
</template>
<script>
import { tableConfig} from '../../../config/defaultData';
import banEditor from './child/banEditor'
import tieUpEditor from './child/tieUpEditor'
import moreEditor from './child/moreEditor'
import journal from './child/journal'

export default {
  name: "userList",
  components:{
    banEditor,
    tieUpEditor,
    moreEditor,
    journal
  },
  data() {
    return {
      tableBody:tableConfig(tableHeader),
      // 搜索控件选项
      searchBox: {
        user_id: "",
        mobile: "",
        real_name: "",
        user_id: ""
      },
      banDialog:{
        show:false,
        data:{}
      },
      tieUpDialog:{
        show:false,
        data:{}
      },
      moreDialog:{
        show:false,
        data:{}
      },
      journalDialog:{
        show:false,
        data:{}
      }
    };
  },
  methods: {
    // 接口数据处理获取
    search() {
      this.tableBody.isLoad=true;
      const params = {
        user_id: this.searchBox.user_id,
        mobile: this.searchBox.mobile,
        real_name: this.searchBox.real_name,
        page: this.tableBody.curPage,
        limit: this.tableBody.pageSize
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/user_list`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            this.tableBody.data = resp.data.data.rows;
            this.tableBody.curPage = resp.data.data.pagenation.current;
            this.tableBody.countTotal = resp.data.data.pagenation.total;
          }
        }).catch(resp => {});
    },
    //用户禁用(解禁)
    statusEdit(row){
      this.banDialog.data=row;
      this.banDialog.show=true;
    },
    //换绑手机
    tieUp(row){
      this.tieUpDialog.data=row;
      this.tieUpDialog.show=true;
    },
    //查看更多
    more(row){
      this.moreDialog.data=row;
      this.moreDialog.show=true;
    },
    //日志
    journal(row){
      this.journalDialog.show=true;
      this.journalDialog.data=row;
    }
  },
  created() {
    this.search();
  }
};

const tableHeader = [
  { prop: "id", label: "用户ID" },
  { prop: "nickname", label: "用户昵称" },
  { prop: "mobile", label: "用户手机号" },
  { prop: "real_name", label: "真实姓名" },
  { prop: "id_number", label: "身份证号码" },
  { prop: "created_at", label: "注册时间" },
  { prop: "login_time", label: "最后登录时间"},
  { prop: "device_id", label: "设备号" },
  { prop: "balance", label: "用户M币数量" },
  {prop:"is_banned",label:"状态"}
];

</script>

<style scoped>
</style>
