<template>
  <section v-loading="isLoad" class="log">
    <section v-for="(item,key) in logData" :key="key" class="log-item" v-if="logData.length>0">
        <section class="date">{{item.updated_at}}</section>
        <section class="detail">{{item.change_detail}}</section>
    </section>
    <section style="text-align:center" v-if="logData.length==0">
      暂无日志记录
    </section>
    <el-row class="area" type="flex" justify="center" v-if="logData.length>0">
        <el-pagination @current-change="getLogs" background layout="total,prev, pager, next, jumper" :current-page.sync="paginateData.curPage" :total="paginateData.total"
            :page-size="paginateData.pageSize"></el-pagination>
    </el-row>

    <el-row class="area" type="flex" justify="center" style="margin-top:20px">
        <el-button type="primary" @click="ok">确 定</el-button>
    </el-row>

  </section>
</template>

<script>
export default {
  name: "log",
  props: ["data"],
  data() {
    return {
      isLoad: true,
      logData: [],
      paginateData: {
        curPage: 1,
        total: 0,
        pageSize: 10
      }
    };
  },
  created() {
    this.getLogs();
  },
  methods: {
    getLogs() {
      let params = {
        id: this.data.id,
        page: this.paginateData.curPage,
        limit:this.paginateData.pageSize
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/rotary_log`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.isLoad = false;
            this.paginateData.total=resp.data.data.pagenation.total;
            this.logData = resp.data.data.rows;
          } else {
            this.$message.error(resp.data.errors);
          }
        })
        .catch(_ => {});
    },
    ok() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style scoped>
.date {
  font-weight: bold;
}
.log-item {
  border-bottom: 1px dashed #666;
}
.log-item section {
  line-height: 30px;
  font-size: 16px;
}
</style>
