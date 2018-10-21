<template>
  <section>
    <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" :inline-message="true" v-loading="loading">

      <el-form-item label="奖品名称" prop="prize_name">
        <el-input  v-model="form.prize_name" :maxlength="14" placeholder="奖品名称" style="width:300px" clearable></el-input>
      </el-form-item>
      
      <el-form-item prop="prize_type" label="奖品类型">
        <el-select v-model="form.prize_type" placeholder="请选择奖品类型" clearable :disabled="isThanks">
          <el-option v-for="item of prizeType" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="展示图标" prop="icon">
        <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                   :on-success="onFormPicUpload"
                   name="uploadfile"
                   :before-upload="beforeIconUpload">
          <img v-if="form.icon" :src="form.icon" class="bg">
          <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
          <span>上传图片大小为50X50</span>
        </el-upload>
      </el-form-item>

      <el-form-item label="有效时间" prop="expire_hour" v-if="form.prize_type!==4">
        <el-input type="number" v-model="form.expire_hour"  placeholder="请输入小时数" style="width:150px" clearable></el-input> 小时
      </el-form-item>

      <el-form-item label="商品折扣" prop="discount" v-if="form.prize_type!==4">
        <el-input type="number" v-model="form.discount" placeholder="“0”表示免费，0.8代表8折" style="width:300px" clearable></el-input>
      </el-form-item>

      <el-form-item label="中奖概率(%)" prop="chance">
        <el-input type="number" max="100" v-model="form.chance"  placeholder="输入值0~100，最小可到小数点后6位" style="width:300px" clearable></el-input>
      </el-form-item>

      <el-form-item label="关联商品" prop="tsy_goods_id" v-if="form.prize_type!==1 && form.prize_type!==4">
        <!-- 远程搜索 -->
        <el-autocomplete
          class="inline-input"
          v-model="tsy_goods_name"
          :fetch-suggestions="querySearchAsync"
          placeholder="搜索关联淘手游商品"
          @select="handleSelect"
          style="width:300px" 
          clearable
        ></el-autocomplete>

      </el-form-item>
      <el-form-item label="奖品价值" prop="price" v-if="form.prize_type!==4">
        <el-input type="number" v-model="form.price"  placeholder="奖品价值" style="width:300px" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status" :disable="form.prize_type===4">
          <el-radio border :label="1">已上线</el-radio>
          <el-radio border :label="2">即将上线</el-radio>
          <el-radio border :label="3">暂不上线</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="上线时间" prop="online_at" v-if="form.status===2">
        <el-date-picker v-model="form.online_at" type="datetime" value-format="yyyy-MM-dd HH:mm:SS" placeholder="选择日期时间" clearable></el-date-picker>
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
  name: "turntable-editor",
  props: ["data", "type"],
  data() {
    return {
      loading:true,
      rules,
      isThanks:false,
      prizeType,
      tsy_goods_name: "",
      tsy_goods_list: [],
      form: {
        id: "",
        prize_name: "",
        prize_type: 1,
        icon: "",
        chance: "",
        price: "",
        status: 1,
        online_at: "",
        expire_hour: "",
        discount: "",
        tsy_goods_id: ""
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if(this.data.prize_type===4){
        this.isThanks=true;
      }
      this.getTsyGameList();
      if (this.type === "edit") {
        this.form = Object.assign(this.form,JSON.parse(JSON.stringify(this.data)));
      }
    },
    //获取关联淘手游游戏列表
    getTsyGameList(){
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/tsy_game`)
      .then(resp=>{
        if(resp.data.success){
          this.loading=false;
          this.tsy_goods_list=resp.data.data.map(d=>{
            d.value=d.name;
            return d;
          })

          this.tsy_goods_list.map(d=>{
            if(this.form.tsy_goods_id===d.id){
              this.tsy_goods_name=d.name;
            }
          })
        }else{
          this.$message.error(resp.data.errors);
        }
      }).catch(_=>{})
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
    querySearchAsync(queryString, cb) {
      var lists = this.tsy_goods_list;
      var results = queryString ? lists.filter(this.createFilter(queryString)) : lists;
      cb(results);
    },
    createFilter(queryString) {
        return (item) => {
          return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
    handleSelect(item) {
      this.form.tsy_goods_id=item.id;
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let url = `${process.env.GUESSING_HOST_URL}/api/admin/rotary_store`,
            params = {
              prize_name: this.form.prize_name,
              prize_type: this.form.prize_type,
              chance: this.form.chance,
              price: this.form.price,
              icon: this.form.icon,
              status: this.form.status,
              discount: this.form.discount,
              expire_hour: this.form.expire_hour,
              tsy_goods_id:this.form.tsy_goods_id
            },
            str = "添加";
          //如果奖品类型为猫币，则不需要关联淘手游商品
          if(params.prize_type===1){
            params.tsy_goods_id=0
          }
          //如果为即将上线，则必传上线时间字段
          if (params.status === 2) {
            params.online_at = this.form.online_at;
          }
          //如果商品类型为谢谢参与,另外一套参数
          if(this.form.prize_type===4){
            params={
              prize_name: this.form.prize_name,
              prize_type: this.form.prize_type,
              chance:this.form.chance,
              icon:this.form.icon,
              status:this.form.status,
              price:0,
              discount:0
            }
          }
          //如果是编辑，则商品ID必填
          if (this.type === "edit") {
            params.id = this.form.id;
            url = `${process.env.GUESSING_HOST_URL}/api/admin/rotary_update`
            str = "编辑";
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

const prizeType = [
  {
    value: 1,
    label: "猫币"
  },
  {
    value: 2,
    label: "道具"
  },
  {
    value: 3,
    label: "其他"
  },
  {
    value:4,
    label:"谢谢参与"
  }
];

const rules = {
  prize_name: [
    {
      required: true,
      message: "请输入奖品名称",
      trigger: "blur"
    }
  ],
  expire_hour: [
    {
      required: true,
      message: "请输入有效时间",
      trigger: "blur"
    }
  ],
  discount: [
    {
      message: "请输入折扣",
      required: true,
      trigger: "blur"
    }
  ],
  prize_type: [
    {
      required: true,
      message: "请选择奖品类型",
      trigger: "blur"
    }
  ],
  chance: [
    {
      required: true,
      message: "请输入中奖概率",
      trigger: "blur"
    }
  ],
  price: [
    {
      required: true,
      message: "请输入奖品价值",
      trigger: "blur"
    }
  ],
  icon: [
    {
      required: true,
      message: "请上传展示图标",
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
  ],
  tsy_goods_id: [
    {
      required: true,
      message: "请选择淘手游商品",
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
