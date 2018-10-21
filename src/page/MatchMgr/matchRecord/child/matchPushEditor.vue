<template>
  <section>
    <el-form :form="form" label-width="120px" :rules="rules" :ref="form" :model="form" :inline-message="true" >
      <el-form-item label="标题" prop="title">
        <el-input placeholder="请输入推送标题" style="width:80%" v-model="form.title" clearable></el-input>
      </el-form-item>
      
      <el-form-item label="推送平台" prop="platform">
        <el-radio-group v-model="form.platform">
          <el-radio border v-for="(item,index) of platformOptions" :key="index" :label="item.label">{{item.value}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="推送状态" prop="status">
        <el-radio border v-model="form.status" label="1">立即推送</el-radio>
        <el-radio border v-model="form.status" label="2">定时推送</el-radio>
      </el-form-item>

      <el-form-item label="推送时间" prop="push_at" v-if="form.status==2">
        <el-date-picker
          v-model="form.push_at"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:SS">
        </el-date-picker>
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
  name: "game-push-editor",
  props: ["id"],
  data() {
    return {
      rules,
      platformOptions,
      form: {
        title:"",
        platform:1,       // 1.安卓  2.IOS  3.全平台
        status:"1",
        push_at:""
      }
    };
  },
  created() {

  },
  methods: {
    cancel() {
      this.$emit("update:visible", false);
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let params={
            bind_id:this.id,
            title:this.form.title,
            platform:this.form.platform,
            status:parseInt(this.form.status)
          }
          //如果选定时推送，则上传推送时间
          if(params.status===2){
            params.push_at=this.form.push_at;
          }

          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/match_push`,params)
          .then(resp=>{
            if(resp.data.success){
              this.$message.success("推送成功");
              this.$emit("pushComplete");
              this.$emit("update:visible", false);
            }else{
              this.$message.error(resp.data.errors);
            }
          }).catch(_=>{})
        }
      })
    }
  }
};

const platformOptions=[
  {value:"安卓",label:1},
  {value:"IOS",label:2},
  {value:"全平台",label:3}
]


const rules={
  title:[{required:true,message:"推送标题不能为空",trigger:"blur"}],
  platform:[{required:true,message:"请选择推送平台",trigger:"blur"}],
  status:[{required:true,message:"请选择推送状态",trigger:"blur"}],
  push_at:[{required:true,message:"请选择推送时间",trigger:"blur"}],
}
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
.vs {
  display: block;
  float: left;
  padding: 0 10px;
  font-weight: bold;
}
</style>
