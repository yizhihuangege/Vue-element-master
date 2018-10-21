<template>
  <section>
    <el-form>
        <el-form-item>
            <el-radio border v-model="is_banned" label="0">正常</el-radio>
            <el-radio border v-model="is_banned" label="1">封禁</el-radio>
        </el-form-item>
        <el-form-item>
            <el-input type="textarea" v-model="reason" placeholder="请输入状态变更原因"></el-input>
        </el-form-item>
    </el-form>

    

    <span slot="footer" class="dialog-footer">
        <el-row class="area" type="flex" justify="center">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok">完 成</el-button>
        </el-row>
    </span>
  </section>
</template>
<script>
export default {
  name: "ban-editor",
  props: ["data"],
  data() {
    return {
      is_banned: "",
      reason: ""
    };
  },
  created() {
    this.is_banned = this.data.is_banned.toString();
  },
  methods: {
    cancel() {
      this.$emit("update:visible", false);
    },
    ok() {
      let params = {
          id: this.data.id,
          reason: this.reason,
          is_banned: this.is_banned
        },
        str = this.is_banned === "0" ? "解禁" : "封禁";
      this.$http
        .post(`${process.env.GUESSING_HOST_URL}/api/admin/change_user_status`, params)
        .then(resp => {
          if (resp.data.success) {
            this.$message.success(`${str}成功`);
            this.$emit("update:visible",false);
            this.$emit("complete");
          } else {
            this.$message.error(resp.data.errors);
          }
        })
        .catch(_ => {});
    }
  }
};
</script>

<style scoped>
</style>