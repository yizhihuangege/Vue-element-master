<template>
    <section>
        <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form">
            <el-form-item label="标题名称" prop="title">
                <el-input  v-model="form.title" :maxlength="14" placeholder="请输入标题名称" style="width:300px" clearable></el-input>
            </el-form-item>
            <el-form-item label="弹窗图标" prop="url">
                <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                        :on-success="onFormPicUpload"
                        name="uploadfile">
                <img v-if="form.url" :src="form.url" class="bg">
                <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="有效日期" prop="expire_at">
                <el-date-picker v-model="form.expire_at" type="datetime" value-format="yyyy-MM-dd HH:mm:SS" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>

            <el-form-item label="跳转类型" prop="jump_type">
              <el-select v-model="form.jump_type" clearable placeholder="请选择">
                <el-option
                  v-for="item in jump_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="跳转链接" clearable prop="jump_url" v-if="form.jump_type && form.jump_type!=4">
              <el-select v-model="form.bind_id" placeholder="请选择竞猜项链接" v-if="form.jump_type===1" clearable>
                <el-option v-for="item in itemList" :key="item.id" :label="item.match_name" :value="item.id"></el-option>
              </el-select>
              
              <el-select v-model="form.bind_id" placeholder="请选择公告链接" v-else-if="form.jump_type===2" clearable>
                <el-option v-for="item in announcementList" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select>

              <el-input v-model="form.jump_url" placeholder="请输入跳转链接" v-else-if="form.jump_type===3" style="width:300px" clearable></el-input>
            </el-form-item>


            <el-form-item label="当前状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio border :label="1">已上线</el-radio>
                  <el-radio border :label="2">即将上线</el-radio>
                  <el-radio border :label="3">暂不上线</el-radio>
                  <el-radio border :label="4" disabled>已过期</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上线时间" prop="online_at" v-if="form.status===2">
                <el-date-picker v-model="form.online_at" type="datetime" value-format="yyyy-MM-dd HH:mm:SS" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="form.remark" style="width:80%"></el-input>
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
  name: "toast-editor",
  props: ["data", "type"],
  data() {
    return {
      jump_options,
      rules,
      announcementList:[],      //公告跳转内容
      itemList:[],              //竞猜项跳转内容
      form: {
        title: "",
        url: "",
        expire_at: "",
        status: 1,
        online_at: "",
        remark: "",
        jump_type: "",
        bind_id:"",
        jump_url:""
      }
    };
  },
  created() {
    this.init();
  },
  computed:{
    jump_type(){
      return this.form.jump_type
    }
  },
  watch:{
    jump_type(newVal,oldVal){
      if(oldVal){
        this.form.bind_id="";
        this.form.jump_url="";
      }
    }
  },
  methods: {
    init() {
      if (this.type == "edit") {
        this.form=JSON.parse(JSON.stringify(this.data));
      }

      //  竞猜：1，公告：2，链接：3，纯展示：4
      //获取公告下的跳转内容列表
        this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/_announcement`)
        .then(resp=>{
          if(resp.data.success){
            this.announcementList=resp.data.data;
          }else{
            this.$message.error(resp.data.errors);
          }
        }).catch(_=>{})

      //获取竞猜项下的跳转内容列表
        this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/_item`)
        .then(resp=>{
          if(resp.data.success){
            this.itemList=resp.data.data;
          }else{
            this.$message.error(resp.data.errors);
          }
        }).catch(_=>{})
    },
    onFormPicUpload(response) {
      if (response.status !== 0) {
        this.$message.error(response.error_message);
      }
      this.form.url = response.data.url;
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let url = `${process.env.GUESSING_HOST_URL}/api/admin/create_advertising`,
            str = "添加",
            params = {
              title: this.form.title,
              url: this.form.url,
              expire_at: this.form.expire_at,
              status: this.form.status,
              remark: this.form.remark,
              jump_type:this.form.jump_type
            };

          // 如果为编辑
          if (this.type === "edit") {
            params.id = this.form.id;
            url = `${process.env.GUESSING_HOST_URL}/api/admin/edit_advertising`;
            str = "编辑";
          }

          // 即将上线添加上线时间字段
          if (params.status === 2) {
            params.online_at = this.form.online_at;
          }

          // 跳转类型判定
          if(params.jump_type===1 || params.jump_type===2){
            params.bind_id=this.form.bind_id
          }else if(params.jump_type===3){
            params.jump_url=this.form.jump_url;
          }

          this.$http.post(url, params)
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

const jump_options=[
        { label: "竞猜", value: 1 },
        { label: "公告", value: 2 },
        { label: "链接", value: 3 },
        {label:"纯展示",value:4}
      ];

const rules = {
  
  title: [
    {
      required: true,
      message: "请输入标题名称",
      trigger: "blur"
    }
  ],
  jump_type: [
    {
      required: true,
      message: "请选择跳转类型",
      trigger: "blur"
    }
  ],
  url: [
    {
      required: true,
      message: "请上传弹窗图标",
      trigger: "blur"
    }
  ],
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
