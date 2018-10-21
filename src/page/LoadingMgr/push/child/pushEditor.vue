<template>
    <section>
        <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form">
            
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" style="width:300px" placeholder="请输入PUSH标题" clearable></el-input>
            </el-form-item>
            
            <el-form-item label="推送类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择推送类型" clearable @change="typeSelect">
                  <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="推送内容" prop="bind_content" v-if="form.type>1 && form.type<6">
              <el-select v-model="form.bind_content" placeholder="请选择推送内容" clearable v-if="form.type!=5" @change="contentSelect">
                  <el-option
                      v-for="item in contentOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label">
                  </el-option>
              </el-select>
              <el-input v-model="form.bind_content" style="width:300px" clearable placeholder="请输入自定义PUSH内容" v-else></el-input>

            </el-form-item>

            <el-form-item label="推送平台" prop="platform">
              <el-radio-group v-model="form.platform">
                <el-radio border v-for="(item,index) of platformOptions" :key="index" :label="item.label">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="推送状态" prop="status">
              <el-radio border v-model="form.status" :label="1">立即推送</el-radio>
              <el-radio border v-model="form.status" :label="2">定时推送</el-radio>
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
  name: "push-editor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      typeOptions,
      platformOptions,
      contentOptions:[],
      form: {
        title:"",
        type:"",
        bind_id:"",
        bind_content:"",
        platform:1,
        status:1,
        push_at:""
      }
    };
  },
  created() {
    if(this.type==="edit"){
      this.form={
        title:this.data.title,
        type:""+this.data.type,

      }
    }
  },
  computed:{
    bind_type(){
      return this.form.type;
    }
  },
  watch:{
    bind_type(cur,old){
      this.form.bind_content="";
    }
  },
  methods: {
    cancel() {
      this.$emit("update:visible", false);
    },
    // 选择推送类型，查询对应的列表数据
    typeSelect(val){
      // 2.公告  3.活动资讯  4.商品
      this.form.bind_id="";
      if(!val) return;
      let params={
          page:1,
          limit:1000,
          status:1
        },
        url="";
      
      if(val==2 || val==3){
        url=`${process.env.GUESSING_HOST_URL}/api/admin/announcement`;
        params.type=val==2?1:2;
      }else if(val==4){
        url=`${process.env.GUESSING_HOST_URL}/api/admin/goods/index`;
      }

      this.$http.get(url,{params})
      .then(resp=>{
        if(resp.data.success){
          if(val==2 || val==3){
            this.contentOptions=resp.data.data.rows.map(d=>{
              d.label=d.title;
              return d;
            });
          }else if(val==4){
            this.contentOptions=resp.data.data.data.map(d=>{
              d.label=d.name;
              return d;
            });
          }
        }else{
          this.$message.error(resp.data.errors);
        }
      }).catch(_=>{});
    },
    contentSelect(val){
      for(var i=0;i<this.contentOptions.length;i++){
        if(this.contentOptions[i].label===val){
          this.form.bind_id=this.contentOptions[i].id;
        }else{
          this.form.bond_id="";
        }
      }
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          
          let params={
            title:this.form.title,
            type:parseInt(this.form.type),
            bind_content:this.form.bind_content,
            status:this.form.status,
            platform:this.form.platform
          }
          
          //  如果是公告、资讯、商品  ，则上传bind_id
          if(params.type==2 || params.type==3 || params.type==4){
            params.bind_id=this.form.bind_id;
          }
          //如果定时推送，上传推送时间
          if(params.status==2){
            params.push_at=this.form.push_at;
          }

          this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/create_push`,params)
          .then(resp=>{
            if(resp.data.success){
              this.$message.success("添加成功");
              this.$emit("update:visible",false);
              this.$emit("complete");
            }else{
              this.$message.error(resp.data.errors)
            }
          }).catch(_=>{})
        }
      });
    }
  }
};



const platformOptions=[
  {value:"安卓",label:1},
  {value:"IOS",label:2},
  {value:"全平台",label:3}
]

const typeOptions=[
    // {value:"1",label:"比赛"},
    {value:"2",label:"公告"},
    {value:"3",label:"活动资讯"},
    {value:"4",label:"商品"},
    {value:"5",label:"自定义跳转"},
];

const rules = {
  title:[{required:true,message:"PUSH标题不能为空",trigger:"blur"}],
  type:[{required:true,message:"推送类型不能为空",trigger:"blur"}],
  bind_content:[{required:true,message:"推送内容不能为空",trigger:"blur"}],
  platform:[{required:true,message:"推送平台不能为空",trigger:"blur"}],
  status:[{required:true,message:"推送状态不能为空",trigger:"blur"}],
  push_at:[{required:true,message:"推送时间不能为空",trigger:"blur"}],

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
