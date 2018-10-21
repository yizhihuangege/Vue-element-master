<template>
  <section v-loading="isLoad">
    <el-header>
      <auto-bread-crumb></auto-bread-crumb>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="4">
          <el-input v-model="searchBox.userid" placeholder="用户ID" clearable></el-input>
        </el-col>
        <el-col  :span="3" style="margin-left:20px">
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableBody.data" v-loading="tableBody.isLoad">
        <el-table-column v-for="item of tableBody.header" :key="item.id" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <span>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
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
  export default {
    name: "userList",
    data() {
      return {
        isLoad: true,
        // 搜索控件选项
        searchBox:{
          userid:''
        },
        tableBody,
      }
    },
    methods: {
      // 添加商品按钮
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
        this.tableBody.isLoad=true;
        const params = {
          user_id: this.searchBox.userid,
          page: this.tableBody.curPage,
          limit:this.tableBody.pageSize
        }
        this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/exchange_list`, {params})
          .then((resp) => {
            if(resp.data.success) {
              this.tableBody.isLoad=false;
              this.tableBody.countTotal = resp.data.data.pagenation.total;
              this.tableBody.data = resp.data.data.rows;
            }
          })
          .catch(_ => {})
      },
    },
    created() {
      this.load()
    }
  }

  const tableHeader = [
    { prop: "id", label: "订单ID" },
    { prop: "user_id", label: "用户ID" },
    { prop: "sheep_coin", label: "兑换绵羊币数量" },
    { prop: "m_coin", label: "兑换M币数量" },
    { prop: "created_at", label: "兑换时间" }
  ]

  const tableBody = {
    isLoad: true,
    header: tableHeader,
    data: [],
    curPage: 1, // 当前页数
    pageSize: 20, // 页大小
    countTotal: 0 // 页总数
  }
</script>

<style scoped>

</style>
