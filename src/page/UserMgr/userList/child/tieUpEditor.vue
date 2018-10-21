<template>
  <section>
    <el-form label-width="100px">
      <el-form-item label="当前手机号：">
        <span>{{old_mobile}}</span>
      </el-form-item>
        
      <el-form-item label="新的手机号：">
          <el-input type="number" v-model="new_mobile" style="width:80%" placeholder="请输入你要更换的手机号" clearable></el-input>
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
  name: "tie-up-editor",
  props: ["data"],
  data() {
    return {
      id: "",
      old_mobile: "",
      new_mobile: ""
    };
  },
  created() {
    this.id = this.data.id;
    this.old_mobile = this.data.mobile;
  },
  methods: {
    cancel() {
      this.$emit("update:visible", false);
    },
    ok() {
      if (!/^1[34578]\d{9}$/.test(this.new_mobile)) {
        this.$message.error("手机号码格式有误");
      } else {
        let params = {
          id: this.id,
          mobile: this.new_mobile
        };
        this.$http
          .post(`${process.env.GUESSING_HOST_URL}/api/admin/change_mobile`, params)
          .then(resp => {
            if (resp.data.success) {
              this.$message.success("换绑成功");
              this.$emit("update:visible", false);
              this.$emit("complete");
            } else {
              this.$message.error(resp.data.errors);
            }
          });
      }
    }
  }
};
</script>

<style scoped>
</style>