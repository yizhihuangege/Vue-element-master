<template>
  <section>
    <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" :inline-message="true">
      <el-form-item label="游戏名称:">
        <span>{{gameName}}</span>
      </el-form-item>
      <el-form-item  label="队伍名称:" prop="name">
        <el-input placeholder="队伍名称" v-model="form.name" style="max-width:300px" clearable ></el-input>
      </el-form-item>

      <el-form-item label="队伍icon:" prop="icon">
        <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                   :on-success="onFormPicUpload"
                   name="uploadfile">
          <img v-if="form.icon" :src="form.icon" class="bg">
          <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
        </el-upload>
      </el-form-item>
    </el-form>

    <el-row class="area" type="flex" justify="center">
      <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="ok(form)">完 成</el-button>
    </el-row>

  </section>
</template>

<script>
export default {
  name: "group-editor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      form: {
        icon: "",
        name: "",
        id: ""
      },
      gameName: "",
      gameID: ""
    };
  },
  created() {
    this.gameName = this.$route.params.gameName;
    this.gameID = this.$route.params.gameID;
    this.init();
  },
  methods: {
    init() {
      if (this.type === "edit") {
        this.form = JSON.parse(JSON.stringify(this.data));
      }
    },
    onFormPicUpload(response) {
      if (response.status !== 0) {
        this.$message.error(response.error_message);
      }
      this.form.icon = response.data.url;
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let param = {
              name: this.form.name,
              icon: this.form.icon,
              game_id: this.gameID
            },
            opStr = "添加";
          if (this.type == "edit") {
            param.id = this.form.id;
            opStr = "编辑";
          }

          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/team/update`,param)
            .then(resp => {
              if (resp.data.success) {
                this.$message.success(`${opStr}成功`);
                this.$emit("update:visible", false);
                this.$emit("complete");
              } else {
                this.$message.error(resp.data.errors);
              }
            })
        }
      });
    }
  }
};

const rules = {
  name: [ { required: true, message: "请输入队伍名称", trigger: "blur" } ],
  icon: [ { required: true, message: "请上传队伍icon", trigger: "blur" } ],
}
</script>