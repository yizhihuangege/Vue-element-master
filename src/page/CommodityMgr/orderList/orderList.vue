<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <el-col class="x-area">

          <el-col :span="3" class="mr_r15">
            <el-select v-model="searchBox.state" placeholder="状态" clearable filterable @change="search">
              <el-option v-for="(item,index) of statusOption" :key="index" :value="item.value"  :label="item.label"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="mr_r15">
              <el-input v-model="searchBox.id" placeholder="用户ID" clearable ></el-input>
          </el-col>
          <el-col :span="7" class="mr_r15">
              <el-date-picker 
                v-model="searchBox.timeRange" 
                value-format="yyyy-MM-dd" 
                type="daterange" 
                range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期"
                :picker-options="timeRangeConfig">
              </el-date-picker>

          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-col>
        
        </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span v-if="item.prop==='type'" >{{scope.row.goods | reType1}}</span>
            <span v-else-if="item.prop==='status'" >{{ scope.row.status | reType2}}</span>
            <span v-else-if="item.prop==='goods'" >{{ scope.row.goods | reType3}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  @click="edit(scope.row)" type="text" size="small" :disabled="scope.row.status!=1">编辑</el-button>
            <el-button  @click="details(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="订单状态编辑" v-if="editDialogShow" :visible.sync="editDialogShow" width="40%">
        <order-mgr-edit :data="editData" v-if="editDialogShow" :visible.sync="editDialogShow" @complete="search"></order-mgr-edit>
      </el-dialog>
      <el-dialog title="订单详情" v-if="detailDialogShow" :visible.sync="detailDialogShow" width="40%">
        <order-detail :data="detailData" :visible.sync="detailDialogShow" v-if="detailDialogShow"></order-detail>
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
import { tableConfig,timeRangeConfig } from "../../../config/defaultData";
import orderMgrEdit from "./child/orderMgrEdit";
import orderDetail from "./child/orderDetail";

export default {
  name: "orderList",
  components: {
    orderMgrEdit,
    orderDetail
  },
  data() {
    return {
      isLoad: false,
      tableBody:tableConfig(tableHeader),
      timeRangeConfig,
      // 搜索控件选项
      searchBox: {
        state: "",
        id: "",
        time: "",
        timeRange:[]
      },
      statusOption,
      editDialogShow:false,
      editData:{},
      detailDialogShow:false,
      detailData:{}
    };
  },
  created() {
    this.search();
  },
  filters:{
    reType1(val) {
      return ["充值","上号","登记","游戏","通用"][val.type-1];
    },
    reType2(val) {
      return ["未处理","已处理","失败"][val-1];
    },
    reType3(val) {
      return val?val.name:"";
    }
  },
  methods: {
    // 查看详情按钮
    details(row) {
      this.detailData = row;
      this.detailDialogShow=true;
    },
    // 商品编辑按钮
    edit(row) {
      this.editData=row;
      this.editDialogShow=true;
    },
    search() {
      this.tableBody.isLoad=true;
      const params = {
        status: this.searchBox.state,
        user_id: this.searchBox.id,
        page: this.tableBody.curPage,
        pageSize:this.tableBody.pageSize
      };
      if(this.searchBox.timeRange!=null && this.searchBox.timeRange.length>0){
        params.start_time=this.searchBox.timeRange[0];
        params.end_time=this.searchBox.timeRange[1]
      }
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/order/index`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.tableBody.isLoad=false;
            this.tableBody.countTotal = resp.data.data.total;
            this.tableBody.data = resp.data.data.data.map(d=>{
              d.goods=d.goods?d.goods:{};
              return d;
            });
          }else{
            this.$message.error(resp.data.errors);
          }
        })
        .catch(resp => {});
    }
  },
  
};

const statusOption = [
  { value: 1, label: "未处理" },
  { value: 2, label: "已处理" },
  { value: 3, label: "失败" }
];
const tableHeader = [
  { prop: "id", label: "订单ID" },
  { prop: "user_id", label: "用户ID" },
  { prop: "type", label: "类型" },
  { prop: "created_at", label: "兑换时间" },
  { prop: "goods", label: "兑换商品名称" },
  { prop: "num", label: "数量" },
  { prop: "price", label: "单价" },
  { prop: "total", label: "总价" },
  { prop: "status", label: "状态" }
];

</script>

<style scoped>
.mr_r15 {
  margin-right: 15px;
}
</style>
