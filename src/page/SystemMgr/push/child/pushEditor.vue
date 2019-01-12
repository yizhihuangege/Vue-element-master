<template>
    <section>
        <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" v-loading="loading">
            
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" style="width:300px" placeholder="请输入PUSH标题" clearable></el-input>
            </el-form-item>
            
            <el-form-item label="推送类型" prop="jump_type">
              <el-select v-model="form.jump_type" placeholder="请选择推送类型" clearable @change="typeSelect">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="推送内容" prop="bind_id" v-if="form.jump_type>1">
                <!-- 公告 -->
                <el-select v-model="form.bind_id" placeholder="请选择推送公告" clearable v-if="form.jump_type==='2'" @change="contentSelect">
                    <el-option v-for="item in contentOptions[1]" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
                <!-- 自定义 -->
                <el-input v-model="form.bind_content" style="width:300px" clearable placeholder="请输入自定义PUSH内容" v-else-if="form.jump_type==='3'"></el-input>
                <!-- 资讯 -->
                <el-select v-model="form.bind_id" placeholder="请选择推送资讯" clearable v-else-if="form.jump_type==='5'" @change="contentSelect">
                    <el-option v-for="item in contentOptions[4]" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
                <!-- 商品 -->
                <el-select v-model="form.bind_id" placeholder="请选择推送商品" clearable v-else-if="form.jump_type==='6'" @change="contentSelect">
                    <el-option v-for="item in contentOptions[5]" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="跳转链接" prop="jump_url" v-if="form.jump_type==='3'">
              <el-input v-model="form.jump_url" style="width:300px" clearable placeholder="请输入自定义跳转链接"></el-input>
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
              <el-date-picker v-model="form.push_at" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:SS"></el-date-picker>
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
      loading:true,
      rules,
      typeOptions,
      platformOptions,
      contentOptions:[],
      form: {
        title:"",
        jump_type:"",
        bind_id:"",
        bind_content:"",
        platform:1,
        status:1,
        push_at:"",
        jump_url:""
      },
      counts:0
    };
  },
  created() {
    // 获取推送内容的选项
    this.getContentOptions();

    //判断如果是编辑，则自动填充表单；并根据id查询推送的内容
    if(this.type==="edit"){
      // console.log(this.data);
      this.form={
        title:this.data.title,
        jump_type:""+this.data.jump_type,
        bind_id:this.data.bind_id,
        bind_content:this.data.bind_content,
        platform:this.data.platform,
        status:this.data.status,
        push_at:this.data.push_at,
        jump_url:this.data.jump_url
      }
    }
  },
  watch:{
    counts(cur,old){
      if(cur===3){
        this.loading=false;
      }
    }
  },
  methods: {
    cancel() {
      this.$emit("update:visible", false);
    },
    //获取所有
    getContentOptions(){
      //获取公告选项
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/announcement?page=1&limit=9999&status=1&type=1`)
      .then(resp=>{
        if(resp.data.success){
          this.counts++;
          this.contentOptions[1]=resp.data.data.rows.map(d=>{
            d.label=d.title;
            return d;
          });
        }
      });

      //获取活动资讯选项
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/news?page=1&limit=9999&status=1`)
      .then(resp=>{
        if(resp.data.success){
          this.counts++;
          this.contentOptions[4]=resp.data.data.rows.map(d=>{
            d.label=d.title;
            return d;
          });
        }
      });

      //获取商品选项
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/goods/index?page=1&limit=9999&status=1`)
      .then(resp=>{
        if(resp.data.success){
          this.counts++;
          this.contentOptions[5]=resp.data.data.data.map(d=>{
            d.label=d.name;
            return d;
          });
        }
      });
    },
    typeSelect(){
      this.form.bind_id="";
      this.form.bind_content="";
    },
    contentSelect(val){
      let arr=this.contentOptions[this.form.jump_type-1];
      for(var i=0;i<arr.length;i++){
        if(arr[i].id===val){
            return this.form.bind_content=arr[i].label;
        }
      }
      this.form.bind_content="";
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          
          let params={
              title:this.form.title,
              jump_type:parseInt(this.form.jump_type),
              bind_content:this.form.bind_content,
              status:this.form.status,
              platform:this.form.platform
            },
            str="添加",
            url=`${process.env.GUESSING_HOST_URL}/api/admin/create_push`;

          
          //  公告、资讯、商品，上传bind_id;自定义上传jump_url
          if(params.jump_type==2 || params.jump_type==5 || params.jump_type==6){
            params.bind_id=this.form.bind_id;
          }else if(params.jump_type==3){
            params.jump_url=this.form.jump_url;
          }
          //如果定时推送，上传推送时间
          if(params.status==2){
            params.push_at=this.form.push_at;
          }

          if(this.type==="edit"){
            str="编辑";
            url=`${process.env.GUESSING_HOST_URL}/api/admin/edit_push`;
            params.id=this.data.id;
          }
          this.$http.post(url,params)
          .then(resp=>{
            if(resp.data.success){
              this.$message.success(`${str}成功`);
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
    {value:"3",label:"自定义"},
    // {value:"4",label:"纯展示"},
    {value:"5",label:"活动资讯"},
    {value:"6",label:"商品"},
];

const rules = {
  title:[{required:true,message:"PUSH标题不能为空",trigger:"blur"}],
  jump_type:[{required:true,message:"推送类型不能为空",trigger:"blur"}],
  bind_content:[{required:true,message:"推送内容不能为空",trigger:"blur"}],
  jump_url:[{required:true,message:"跳转链接不能为空",trigger:"blur"}],
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
