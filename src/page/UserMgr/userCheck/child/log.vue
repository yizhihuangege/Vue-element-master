<template>
  <section v-loading="isLoad">
    <el-row style="text-align:center" v-if="logData.length===0">暂无日志记录</el-row>
    <el-row>
        <section v-for="(item,index) in logData" :key="index" class="item">
            <section class="date">{{item.created_at}}</section>
            <section>{{item.remark}}</section>
        </section>
    </el-row>
    <el-row class="area" type="flex" justify="center" style="margin-top:20px">
        <el-button type="primary" @click="ok">确 定</el-button>
    </el-row>
  </section>
</template>
<script>
export default {
  name: "log",
  props: ["id"],
  data() {
    return {
      isLoad: true,
      logData: []
    };
  },
  created() {
    this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/video_change_log?id=${this.id}`)
      .then(resp => {
        if (resp.data.success) {
          this.isLoad = false;
          this.logData = resp.data.data;
        }
      });
  },
  methods: {
    ok() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style scoped>
.item {
  border-bottom: 1px dashed #ccc;
  font-size: 14px;
}
.item section {
  line-height: 30px;
}
.date {
  font-weight: bold;
}
</style>