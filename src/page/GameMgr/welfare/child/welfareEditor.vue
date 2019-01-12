<template>
  <section>
    <el-form :form="form" label-width="120px" :rules="rules" :ref="form" :model="form" :inline-message="true">

      <el-form-item label="福利码价值" prop="price">
        <el-input  v-model="form.price" type="number" :maxlength="14" placeholder="请输入福利码价值" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item label="生成数量" prop="number">
        <el-input  v-model="form.number" type="number" :maxlength="14" placeholder="请输入生成数量" style="width:200px" clearable></el-input>
      </el-form-item>
      
      <el-form-item label="有效时间" prop="expire_at">
        <el-date-picker v-model="form.expire_at" type="datetime" value-format="yyyy-MM-dd HH:mm:SS" placeholder="请选择时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="创建说明" prop="description">
        <el-input  v-model="form.description" type="textarea" placeholder="请输入创建说明"></el-input>
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
  name: "welfare-editor",
  props: ["data"],
  data() {
    return {
      rules,
      form: {
        price:"",
        number:"",
        expire_at:"",
        description:""
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
          let params=JSON.parse(JSON.stringify(this.form));
          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/create_welfare`,params).then(resp=>{
            if(resp.data.success){
              this.$message.success("创建成功");
              this.$emit("complete");
              this.$emit("update:visible",false);
            }else{
              this.$message.error(resp.data.errors);
            }
          }).catch(_=>{})
        }
      });
    }
  }
};

const rules = {
  price: [{required: true,message: "福利码价值不能为空",trigger: "blur"}],
  number: [{required: true,message: "数量不能为空",trigger: "blur"}],
  expire_at: [{required: true,message: "有效时间不能为空",trigger: "blur"}],
  description: [{required: true,message: "创建描述不能为空",trigger: "blur"}],
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
