<template>
    <section>
        <el-header>
            <auto-bread-crumb></auto-bread-crumb>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="3">
                    <el-input v-model="searchData.mobile" placeholder="请输入手机号码" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="searchData.tsy_order_no" placeholder="请输入淘手游订单号" clearable></el-input>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="searchData.status" clearable @change="search" placeholder="请选择订单状态">
                        <el-option v-for="item in statusOption" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="searchData.type" clearable @change="search">
                        <el-option label="全部类型" value=""></el-option>
                        <el-option label="九宫格" value="3"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="7">
                    <el-date-picker
                        v-model="searchData.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:SS">
                    </el-date-picker>
                </el-col>
                <el-col :span="2">
                    <el-button @click="search" type="primary" icon="el-icon-search">查 询</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="tableBody.isLoad" :data="tableBody.data">
                <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
                    <template slot-scope="scope">
                        <span v-if="item.prop==='status'">{{ scope.row['status']|filterStatus }}</span>
                        <span v-else-if="item.prop==='manual_status'">{{ scope.row['manual_status']|filterManualStatus }}</span>
                        <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="viewDetail(scope.row)" type="text" size="small">查看更多</el-button>
                        <el-button @click="openEditor(scope.row)" type="text" size="small">修改状态</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="area" type="flex" justify="center">
                <el-pagination @current-change="search" background layout="total,prev, pager, next, jumper" :current-page.sync="tableBody.curPage" :total="tableBody.countTotal"
                    :page-size="tableBody.pageSize"></el-pagination>
            </el-row>
        </el-main>

        <el-dialog title="修改状态" v-if="dialog.visible" :visible.sync="dialog.visible" width="30%">
            <tsy-status-editor v-if="dialog.visible" :visible.sync="dialog.visible" @complete="search" :data="dialog.data"></tsy-status-editor>
        </el-dialog>

        <el-dialog title="更多信息" v-if="detailDialog.visible" :visible.sync="detailDialog.visible" width="30%">
            <tsy-order-detail v-if="detailDialog.visible" :visible.sync="detailDialog.visible" :data="detailDialog.data"></tsy-order-detail>
        </el-dialog>
    </section>
</template>
<script>

import { tableConfig } from "@/config/defaultData";
import tsyStatusEditor from "./child/tsyStatusEditor"
import tsyOrderDetail from "./child/tsyOrderDetail"
export default {
  name: "tsy-order-statistics",
  components:{
      tsyStatusEditor,
      tsyOrderDetail
  },
  data() {
    return {
      isLoad: true,
      statusOption,
      manualStatusOption,
      tableBody:tableConfig(tableHeader),
      searchData: {
        time: [],
        mobile:"",
        status:"",
        tsy_order_no:"",
        type:""
      },
      dialog:{
          visible:false,
          data:{ }
      },
      detailDialog:{
          visible:false,
          data:{}
      }
    };
  },
  filters:{
      filterStatus(val){
          return statusOption[val-1].label
      },
      filterManualStatus(val){
          return manualStatusOption[val].label
      }
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.tableBody.isLoad = true;
      let params = {
        page: this.tableBody.curPage,
        mobile:this.searchData.mobile.trim(),
        status:this.searchData.status,
        type:this.searchData.type,
        tsy_order_no:this.searchData.tsy_order_no.trim()
      };
      try{
        params.start_at = this.searchData.time[0]
        params.end_at = this.searchData.time[1]
      }catch(e){
        params.start_at=params.end_at=""
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/rotary_tsy_order`, {params}).then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad = false;
            let data = resp.data.data;
            this.tableBody.countTotal = data.pagenation.total;
            this.tableBody.data = data.rows.map(d=>{
                try{
                   d.nickname=d.user.nickname
                }catch(e){
                    d.nickname="";
                }
                return d;
            });
          }else{
              this.$message.error(resp.data.errors)
          }
        });
    },
    openEditor(row){
        this.dialog.visible=true;
        this.dialog.data=row;
    },
    viewDetail(row){
        this.detailDialog.visible=true;
        this.detailDialog.data=row;
    }
  }
};

const statusOption=[    
    { label:"未兑换",value:1 },
    { label:"兑换中",value:2 },
    { label:"已兑换",value:3 },
    { label:"已过期",value:4 },
]

const manualStatusOption=[
    { label:"未处理",value:0 },
    { label:"发货中",value:1 },
    { label:"用户确认",value:2 },
    { label:"已完成",value:3 },
]
const tableHeader= [
    { prop: "user_id", label: "用户ID" },
    // { prop: "nickname", label: "用户昵称" },
    { prop: "mobile", label: "手机号码" },
    { prop: "goods_id", label: "商品ID" },
    { prop: "tsy_order_no", label: "订单号" },
    { prop: "price", label: "商品价值(元)" },
    { prop: "discount", label: "商品折扣" },
    { prop: "real_price", label: "用户实付(元)" },
    { prop: "diff_price", label: "差价(元)" },
    { prop: "created_at", label: "交易时间" },
    { prop: "status", label: "订单状态" },
    { prop: "manual_status", label: "人工状态" },

];

</script>

