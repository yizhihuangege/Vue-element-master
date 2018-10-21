<template>
  <section>
    <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" :inline-message="true">
      <el-form-item label="游戏名称" prop="name">
        <el-input  v-model="form.name" :maxlength="14" placeholder="游戏名称(不超过14个字符)" style="width:300px" clearable ></el-input>
      </el-form-item>
      <el-form-item label="背景图片" prop="bg_img">
        <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                   :on-success="onFormPicUpload"
                   name="uploadfile">
          <img v-if="form.bg_img" :src="form.bg_img" class="bg">
          <i v-else class="el-icon-plus avatar-uploader-icon bg"> </i>
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
  name: "game-editor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      form: {
        bg_img: "",
        id: "",
        name: ""
      }
    };
  },
  created() {
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
      this.form.bg_img = response.data.url;
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let params = {
              name: this.form.name,
              bg_img: this.form.bg_img
            },
            str = "";

          if (this.type === "edit") {
            str = "编辑";
            params.id = this.form.id;
          } else {
            str = "添加";
          }

          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/game/update`,params)
            .then(resp => {
              if (resp.data.success) {
                this.$message.success(`${str}成功`);
                this.$emit("update:visible", false);
                this.$emit("complete");
              } else {
                this.$message.error(resp.data.errors);
              }
            })
            .catch(_ => {});
        }
      });
    }
  }
};

const rules = {
  name: [
    {
      required: true,
      message: "请输入游戏名称",
      trigger: "blur"
    }
  ],
  bg_img: [
    {
      required: true,
      message: "请上传背景图片",
      trigger: "blur"
    }
  ]
};
</script>

<style scoped>
.bg {
  width: 178px;
  height: 178px;
  display: block;
  line-height: 178px !important;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
