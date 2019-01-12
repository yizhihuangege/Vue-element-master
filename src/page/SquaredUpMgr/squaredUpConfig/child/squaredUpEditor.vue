<template>
  <section>
    <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" :inline-message="true">
            
      <el-form-item prop="prize_type" label="奖品类型">
        <el-select v-model="form.prize_type" placeholder="请选择奖品类型" clearable :disabled="isThanks">
          <el-option v-for="item of typeOption" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品折扣" prop="discount" v-if="form.prize_type==2">
        <el-select v-model="form.discount" clearable placeholder="请选择奖品折扣">
          <el-option v-for="item in discountOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="奖品名称" prop="prize_name">
        <el-input  v-model="form.prize_name" placeholder="奖品名称" class="mw300" clearable></el-input>
      </el-form-item>
    
      <el-form-item label="奖品ICON" prop="icon">
        <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                   :on-success="onFormPicUpload"
                   name="uploadfile">
          <img v-if="form.icon" :src="form.icon" class="bg">
          <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="中奖概率(%)" prop="chance">
        <el-input-number v-model="form.chance" :max="100" :precision="4" :step="0.01" :disabled="isThanks"></el-input-number>
      </el-form-item>

      <el-form-item label="奖品价值" prop="price" v-if="form.prize_type==1">
        <el-input type="number" v-model="form.price"  placeholder="请输入奖品价值" style="max-width:300px" clearable></el-input>
      </el-form-item>
      
      <el-form-item label="排序值" prop="sort">
        <el-input-number v-model="form.sort"></el-input-number>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio border :label="1">已上线</el-radio>
          <el-radio border :label="2">已下线</el-radio>
          <el-radio border :label="3" disabled>已删除</el-radio>
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
  name: "squared-up-editor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      isThanks:false,
      discountOption,
      typeOption,
      form: {
        id: "",
        prize_name: "",
        prize_type: "",
        icon: "",
        chance: "",
        price: "",
        status: 1,
        discount: "",
        sort:""
      }
    }
  },
  created() {
    this.init();
  },
  watch:{
    "form.discount":function(cur,old){
      if(cur!=old){
        this.form.prize_name=discountOption[cur].label;
      }
    }
  },
  methods: {
    init() {
      if(this.data.prize_type===4){
        this.isThanks=true;
      }
      if (this.type === "edit") {
        this.form = JSON.parse(JSON.stringify(this.data))
      }
    },
    //限制上传图片只能为 PNG
    beforeIconUpload(file) {
      const isPNG = file.type === "image/png";
      if (!isPNG) {
        this.$message.error("上传图标只能是 PNG 格式!");
      }
      return isPNG;
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
    //远程搜索
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let url = `${process.env.GUESSING_HOST_URL}/api/admin/create_jiugongge`,
            params = {
              prize_name: this.form.prize_name,
              prize_type: this.form.prize_type,
              chance: this.form.chance,
              price: ""+this.form.price,
              icon: this.form.icon,
              status: this.form.status,
              discount: this.form.discount,
              sort:this.form.sort
            },
            str = "添加";
          //如果是编辑，则商品ID必填
          if (this.type === "edit") {
            params.id = this.form.id;
            url = `${process.env.GUESSING_HOST_URL}/api/admin/edit_jiugongge`
            str = "编辑";
          }

          if(params.prize_type==1){
            params.discount=0;
          }

          this.$http.post(url, params).then(resp => {
            if (resp.data.success) {
              this.$message.success(`${str}成功`);
              this.cancel();
              this.$emit("complete");
            } else {
              this.$message.error(resp.data.errors);
            }
          })
        }
      });
    }
  }
}

const discountOption=[
  { label:"免费",value:0 },
  { label:"一折",value:1 },
  { label:"二折",value:2 },
  { label:"三折",value:3 },
  { label:"四折",value:4 },
  { label:"五折",value:5 },
  { label:"六折",value:6 },
  { label:"七折",value:7 },
  { label:"八折",value:8 },
  { label:"九折",value:9 },
]
const typeOption = [
  { value: 1, label: "猫币" },
  { value: 2, label: "折扣" },
  { value: 3, label: "其他" },
  { value:4, label:"谢谢参与" }
]

const rules = {
  prize_name: [{ required: true, message: "请输入奖品名称", trigger: "blur" }],
  discount: [{ message: "请输入商品折扣", required: true, trigger: "blur" }],
  prize_type: [{ required: true, message: "请选择奖品类型", trigger: "blur" }],
  chance: [{ required: true,message: "请输入中奖概率",trigger: "blur"}],
  price: [{required: true,message: "请输入奖品价值",trigger: "blur"}],
  icon: [{required: true,message: "请上传展示图标",trigger: "blur"}],
  status: [{required: true,message: "请选择状态",trigger: "blur"}],
  sort:[{required: true,message: "请输入排序值",trigger: "blur"}]
}
</script>
