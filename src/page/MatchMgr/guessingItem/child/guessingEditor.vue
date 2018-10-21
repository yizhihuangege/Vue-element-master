<template>
  <section>
    <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" :inline-message="true">
      <el-form-item label="比赛名称" prop="match_name">
        <span>{{match_name}}</span>
      </el-form-item>
      <el-form-item label="竞猜名称" prop="guessing_name">
        <el-input  v-model="form.guessing_name" :maxlength="50" placeholder="输入竞猜项名称" style="width:400px;"  clearable></el-input>
      </el-form-item>

      <el-form-item label="竞猜项" prop="guessing_item">
        <el-input  v-model="form.item_1"  style="width:200px;" placeholder="竞猜项1" clearable></el-input>
        <el-input  v-model="form.item_2"  style="width:200px;" placeholder="竞猜项2" clearable></el-input>
      </el-form-item>

      <el-form-item label="开始时间" prop="start_time">
        <el-date-picker v-model="form.start_time" type="datetime" value-format="yyyy-MM-dd HH:mm:SS" placeholder="选择日期时间" clearable></el-date-picker>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select style="width:200px" v-model="form.status" filterable clearable placeholder="选择类型" :disabled="!type">
          <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="结果" v-if="this.form.status===3" prop="result">
        <el-radio-group v-model="form.result">
          <el-radio border :label="form.item_1">{{form.item_1}}</el-radio>
          <el-radio border :label="form.item_2">{{form.item_2}}</el-radio>
        </el-radio-group>
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
  name: "guessingItemEditor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      match_name: "",
      options,
      form: {
        id: "",
        guessing_name: "",
        item_1: "",
        item_2: "",
        start_time: "",
        status: 1,
        result: ""        // status为3必填，值必须为item_1或item_2其一
      }
    };
  },
  created() {
    this.match_name=localStorage.matchName;
    this.init();
  },
  methods: {
    init() {
      if (this.type) {
        this.form.id=this.data.id;
        this.form.guessing_name=this.data.item_name;
        this.form.item_1=this.data.item_1;
        this.form.item_2=this.data.item_2;
        this.form.start_time=this.data.start_time;
        this.form.status=this.data.status;
        this.form.result=this.data.result;
      }
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let params={
            item_name:this.form.guessing_name,
            item_1:this.form.item_1,
            item_2:this.form.item_2,
            start_time:this.form.start_time
          },
            str="",
            url="";

          //如果是编辑
          if(this.type){
            params.id=this.form.id;
            params.status=this.form.status;
            url=`${process.env.GUESSING_HOST_URL}/api/admin/edit_item`;
            str="编辑";
          }else{
            params.id=localStorage.matchId;
            url=`${process.env.GUESSING_HOST_URL}/api/admin/add_item`;
            str="添加";
          }

          //已结算,则结果必填
          if(params.status===3){
            params.result=this.form.result;
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
          }).catch(_=>{})
        }
      })
    },
    
  }
  
};


const options=[
        { label: "竞猜中", id: 1 },
        { label: "比赛中", id: 2 },
        { label: "已结算", id: 3 },
        { label: "流局", id: 4 }
      ];

const rules={
  guessing_name:[{
    required:false,
    message:"请输入竞猜名称",
    trigger:"blur"
  }],
  guessing_item:[{
    required:false,
    message:"请输入竞猜项",
    trigger:"blur"
  }],
  start_time:[{
    required:false,
    message:"请选择开始时间",
    trigger:"blur"
  }],
  status:[{
    required:false,
    message:"请选择竞猜状态",
    trigger:"blur"
  }],
  result:[{
    required:false,
    message:"请选择竞猜结果",
    trigger:"blur"
  }]
}
</script>

<style scoped>

.el-radio__inner{
  border:1px solid #333;
}
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
.el-radio__inner{
  border:1px solid #ccc;
}
</style>
