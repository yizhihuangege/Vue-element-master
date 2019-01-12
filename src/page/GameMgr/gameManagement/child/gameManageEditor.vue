<template>
    <section>
        <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" :inline-message="true">
            <el-form-item label="游戏名称" prop="game_name">
                <el-input  v-model="form.game_name" :maxlength="14" placeholder="请输入游戏名称" style="width:300px" clearable></el-input>
            </el-form-item>
            <el-form-item label="封面图片" prop="cover">
                <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                        :on-success="onFormPicUpload"
                        name="uploadfile">
                <img v-if="form.cover" :src="form.cover" class="bg">
                <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
                </el-upload>
            </el-form-item>
            
            <el-form-item label="链接地址" prop="link">
                <el-input  v-model="form.link" :maxlength="14" placeholder="请输入链接地址" style="width:300px" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio v-model="form.status" :label="1" border>显示</el-radio>
                <el-radio v-model="form.status" :label="2" border>不显示</el-radio> 
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input  v-model="form.sort" type="number" style="width:150px" clearable></el-input>
            </el-form-item>

            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" type="textarea"></el-input>
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
  name: "gameManageEditor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      form: {
        game_name:"",
        cover:"",
        link:"",
        status:1,
        sort:"",
        description:""
      }
    };
  },
  created() {
    if(this.type==="edit"){
      this.form=JSON.parse(JSON.stringify(this.data));
      
    }
  },
  methods: {
    onFormPicUpload(response) {
      if (response.status !== 0) {
        this.$message.error(response.error_message);
      }
      this.form.cover = response.data.url;
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let params=JSON.parse(JSON.stringify(this.form)),
              str="添加",
              url=`${process.env.GUESSING_HOST_URL}/api/admin/create_gamemanagement`;
        
          if(this.type==="edit"){
            params.id=this.data.id;
            str="编辑";
            url=`${process.env.GUESSING_HOST_URL}/api/admin/edit_gamemanagement`;
          }
          // console.log(params);
          this.$http.post(url,params).then(resp=>{
            if(resp.data.success){
              this.$message.success(`${str}成功`);
              this.$emit("complete");
              this.$emit("update:visible", false);
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
  game_name: [{required: true,message: "游戏名称不能为空",trigger: "blur"}],
  cover: [{required: true,message: "封面图片不能为空",trigger: "blur"}],
  link: [{required: true,message: "链接地址不能为空",trigger: "blur"}],
  status: [{required: true,message: "请选择状态",trigger: "blur"}],
  sort: [{required: true,message: "排序值不能为空",trigger: "blur"}],
  description: [{required: true,message: "游戏描述不能为空",trigger: "blur"}]
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
