<template>
  <section>
    <el-form :form="form" label-width="80px" :rules="rules" :ref="form" :model="form">

      <el-form-item label="导航名称" prop="title">
        <el-input  v-model="form.title"  placeholder="请输入导航名称" style="width:300px" clearable></el-input>
      </el-form-item>
      
      <el-form-item prop="type" label="导航类型">
        <el-select v-model="form.type" placeholder="请选择导航类型" clearable>
          <el-option v-for="item of typeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="platform" label="选择平台">
        <el-select v-model="form.platform" placeholder="请选择平台" clearable>
          <el-option v-for="item of platformType" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上传图标" prop="icon">
        <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                   :on-success="onFormPicUpload"
                   name="uploadfile">
          <img v-if="form.icon" :src="form.icon" class="bg">
          <i v-else class="el-icon-plus avatar-uploader-icon bg"> </i>
        </el-upload>
      </el-form-item>

      <el-form-item label="链接地址" prop="link">
        <el-input  v-model="form.link"  placeholder="请输入链接地址" style="width:350px" clearable></el-input>
      </el-form-item>

      <el-form-item prop="status" label="显示状态">
        <el-select v-model="form.status" placeholder="请选择显示状态" clearable>
          <el-option v-for="item of statusType" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="排序" prop="sort">
        <el-input type="number" v-model="form.sort" style="width:250px" clearable></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok(form)">完 成</el-button>
    </span>
  </section>
</template>

<script>
export default {
  name: "nav-editor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      typeList,
      platformType,
      statusType,
      form: {
        title: "",
        type:"",
        platform:"",
        link:"",
        status:"",
        sort:"",
        icon:""
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.type == "edit") {
        this.form = Object.assign(
          this.form,
          JSON.parse(JSON.stringify(this.data))
        );
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
            let params=JSON.parse(JSON.stringify(this.form)),
                url=`${process.env.GUESSING_HOST_URL}`,
                str="";

            if(this.type==="add"){
                url+="/api/admin/create_navigation",
                str="添加"
            }else{
                params.id=this.data.id;
                url+="/api/admin/edit_navigation";
                str="编辑";
            }
            
            this.$http.post(url,params)
            .then(resp=>{
                if(resp.data.success){
                    this.$message.success(`${str}成功`);
                    this.$emit("update:visible", false);
                    this.$emit("complete")
                }else{
                    this.$message.error(resp.data.errors)
                }
            }).catch(_=>{})
        }
      });
    }
  }
};

const typeList=[
    {value:1,label:"系统"},
    {value:2,label:"H5"}
    ];
const statusType=[
    {value:1,label:"显示"},
    {value:2,label:"不显示"}
]
const platformType = [
  {
    value: 3,
    label: "全平台"
  },
  {
    value: 1,
    label: "安卓"
  },
  {
    value: 2,
    label: "IOS"
  }
];

const rules = {
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur"
    }
  ],
  type:[
      {
          required:true,
          message:"请选择导航类型",
          trigger:"change"
      }
  ],
  platform: [
    {
      required: true,
      message: "请选择平台",
      trigger: "change"
    }
  ],
  icon: [
    {
      required: true,
      message: "请输入链接地址",
      trigger: "change"
    }
  ],
  link: [
    {
      required: true,
      message: "请输入链接地址",
      trigger: "blur"
    }
  ],
  status: [
    {
      required: true,
      message: "请选择显示状态",
      trigger: "change"
    }
  ],
  sort: [
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
