<template>
    <section>
        <el-form :form="form" label-width="80px" :rules="rules" :ref="form" :model="form">
            <el-form-item label="标题" prop="title">
                <el-input  v-model="form.title" :maxlength="14" placeholder="请输入公告标题" style="width:300px" clearable ></el-input>
            </el-form-item>
            
            <el-form-item label="类型" prop="type">
              <el-radio  border v-model="form.type" label="1">公告</el-radio>
              <el-radio border v-model="form.type" label="2">活动资讯</el-radio>
            </el-form-item>
            <el-form-item label="资讯封面" prop="cover" v-if="form.type==2">
              <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                      :on-success="onFormPicUpload"
                      name="uploadfile">
              <img v-if="form.cover" :src="form.cover" class="bg">
              <i v-else class="el-icon-plus avatar-uploader-icon bg"> </i>
            </el-upload>
            </el-form-item>


            <el-form-item label="发布方式" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio border :label="1">立即发布</el-radio>
                  <el-radio border :label="2">定时发布</el-radio>
                  <el-radio border :label="3">暂不发布</el-radio>
                  <el-radio border :label="4" disabled>已过期</el-radio>                
                </el-radio-group>
            </el-form-item>

            <el-form-item label="发布时间" prop="online_at" v-if="form.status===2">
                <el-date-picker v-model="form.online_at" type="datetime" value-format="yyyy-MM-dd HH:mm:SS" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="有效日期" prop="expire_at">
                <el-date-picker v-model="form.expire_at" type="datetime" value-format="yyyy-MM-dd HH:mm:SS" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>

            <el-form-item prop="content" label="正文">
              <!-- vue-editor存在一个页面不能有两个实例的bug，打开子窗口时注销父窗口中的editor -->
              <vue-editor  v-model="form.content" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
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
import { VueEditor } from "vue2-editor";
export default {
  name: "notice-editor",
  props: ["data", "type"],
  components: {
    VueEditor
  },
  data() {
    return {
      rules,
      imgUploading:false,     // 图片上传时的状态提示
      form: {
        title: "",
        type:"1",
        cover:"",
        status: 1,
        online_at: "",
        content:"",
        expire_at:""
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.type === "edit") {
        this.form = Object.assign(this.form,JSON.parse(JSON.stringify(this.data)));
      }
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    onFormPicUpload(response) {
      if (response.status !== 0) {
        this.$message.error(response.error_message);
      }
      this.form.cover = response.data.url;
    },
    handleImageAdded: function(file, Editor, cursorLocation) {
      var formData = new FormData();
      formData.append("uploadfile", file);
      this.$http({
        url: "http://static.kuaifazs.com/sdkkitfile.php",
        method: "POST",
        data: formData,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false
      })
        .then(result => {
          let url = result.data.data.url;
          Editor.insertEmbed(cursorLocation, "image", url); 
          this.$message.success("图片上传成功");
        })
        .catch(err => {
          this.$message.error("图片上传失败");
        });
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let url = `${process.env.GUESSING_HOST_URL}/api/admin/create_announcement`,
            str = "创建",
            params = {
              title: this.form.title,
              expire_at: this.form.expire_at,
              status: this.form.status,
              content:this.form.content,
              type:parseInt(this.form.type)
            };


          if (this.type === "edit") {
            params.id = this.form.id;
            url = `${process.env.GUESSING_HOST_URL}/api/admin/edit_announcement`;
            str = "编辑";
          }
          if (params.status === 2) {
            params.online_at = this.form.online_at;
          }
          if(params.type===2){
            params.cover=this.form.cover;
          }

          // console.log(params)

          this.$http.post(url, params)
            .then(resp => {
              // console.log(resp);
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
  title: [
    {
      required: true,
      message: "请输入标题名称",
      trigger: "blur"
    }
  ],
  type:[{
    required:true,message:"请选择公告类型",trigger:"blur"
  }],
  cover:[{
    required:true,message:"请上传资讯封面",trigger:"blur"
  }],
  expire_at: [
    {
      required: true,
      message: "请选择有效日期",
      trigger: "blur"
    }
  ],
  status: [
    {
      required: true,
      message: "请选择状态",
      trigger: "blur"
    }
  ],
  online_at: [
    {
      required: true,
      message: "请输入上线时间",
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
