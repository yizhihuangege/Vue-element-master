<template>
  <section>
    <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" :inline-message="true">
      <el-form-item label="游戏名称" prop="game_name">
        <el-input v-model="form.game_name" style="width:60%" placeholder="请输入游戏名称"  clearable></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="order_value">
        <el-input type="number" v-model="form.order_value" style="width:60%" placeholder="请输入排序值" clearable></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-row class="area" type="flex" justify="center">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok(form)">完 成</el-button>
    </el-row>
    </span>

    
  </section>
</template>

<script>
export default {
  name: "configGameEditor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      form: {
        id: "",
        game_name: "",
        order_value: ""
      }
    };
  },
  methods: {
    cancel() {
      this.$emit("update:visible", false);
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let params = {
              game_name: this.form.game_name,
              order_value: this.form.order_value
            },
            str = "",
            url = `${process.env.GUESSING_HOST_URL}`;

          if(this.type==="add"){
            str="添加";
            url+="/api/admin/mall/game/store"
          }else{
            str="编辑";
            url+="/api/admin/mall/game/update";
            params.id=this.form.id;
          }

          this.$http.post(url,params)
          .then(resp=>{
            if(resp.data.success){
              this.$message.success(`${str}成功`);
              this.$emit("update:visible",false);
              this.$emit("complete");
            }else{
              this.$message.error(resp.data.errors);
            }
          }).catch(_=>{});
        }
      });
    }
  },
  created() {
    if (this.type === "edit") {
      this.form = JSON.parse(JSON.stringify(this.data));
    }
  }
};

const rules = {
  game_name: [
    {
      required: true,
      message: "请输入游戏名称",
      trigger: "blur"
    }
  ],
  order_value: [
    {
      required: true,
      message: "请输入排序值",
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
