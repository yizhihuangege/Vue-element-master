<template>
  <section>
      <el-form label-width="150px" :form="form" v-loading="loading">
        <el-form-item label="游戏名称">
          <el-select style="width:30%" v-model="nameGame" filterable clearable placeholder="请选择游戏">
            <el-option v-for="item in gameLists" :key="item.id" :label="item.game_name" :value="item.game_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.name"  placeholder="请输入商品名称，16个字以内" style="width:30%" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select style="width:30%" v-model="form.type" filterable clearable placeholder="请选择类型">
            <el-option v-for="item of typeOption" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form.price" type="Number"  style="width:30%" placeholder="请输入价格" clearable></el-input>
        </el-form-item>
        <el-form-item label="图片上传">
          <el-upload class="avatar-uploader"
                     action="http://static.kuaifazs.com/sdkkitfile.php"
                     :show-file-list="false"
                     :on-success="onFormPicUpload"
                     name="uploadfile">
            <img v-if="form.pics" :src="form.pics" class="bg">
            <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select style="width:30%" v-model="form.status" filterable clearable placeholder="选择状态">
            <el-option v-for="item of statusOption" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input type="textarea"  maxlength="500" style="width:80%" v-model="form.content" placeholder="请输入商品描述（最大字数500）"></el-input>
        </el-form-item>

        <el-form-item label="库存">
          <el-input type="Number" style="width:30%" v-model="form.stock" placeholder="请输入库存" clearable></el-input>
        </el-form-item>
        <el-form-item label="每人每天兑换上限">
          <el-input type="Number" style="width:30%" v-model="form.exchange_limit" placeholder="请输入兑换上限" clearable></el-input>
        </el-form-item>

        <el-form-item label="关联淘手游商品">
          <el-switch v-model="ralateTsyGoods"  active-text="是" inactive-text="否"></el-switch>
        </el-form-item>

        <el-form-item label="关联商品" v-if="ralateTsyGoods">
          <!-- 远程搜索 -->
          <el-autocomplete
            class="inline-input"
            v-model="tsy_goods_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="搜索关联淘手游商品"
            @select="handleSelect"
            style="width:30%"  clearable
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="关联商品折扣"  v-if="ralateTsyGoods">
          <el-input type="Number" style="width:30%" v-model="form.discount" clearable placeholder="请输入折扣"></el-input>
        </el-form-item>

        <el-form-item label="关联商品有效时间"  v-if="ralateTsyGoods">
          <el-input type="Number" style="width:100px" v-model="form.expire_hour" clearable placeholder="请输入时间"></el-input> 小时
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row class="area" type="flex" justify="center">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok">完 成</el-button>
        </el-row>
      </span>
  </section>
</template>

<script>
export default {
  name: "addCommodityList",
  props: ["data", "isModify"],
  data() {
    return {
      loading:true,
      gameLists: [],
      typeOption,
      statusOption,
      nameGame: "",
      tsy_goods_name:"",
      tsy_goods_list: [],
      ralateTsyGoods: false,
      // 提交数据集合
      form: {
        id: "",
        gameName: "",
        name: "",
        type: "",
        status: "",
        price: "",
        content: "",
        mall_game_id: "",
        pics: "",
        stock: "",
        exchange_limit: "",
        tsy_goods_id: "",
        discount: "",
        expire_hour:""
      }
    };
  },
  methods: {
    onFormPicUpload(res) {
      if (res.status !== 0) {
        this.$message.error(res.error_message);
      }
      this.form.pics = res.data.url;
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    isEdit() {
      // 确认是编辑
      if (this.isModify) {
        this.form.id = this.data.id;
        this.form.name = this.data.name;
        this.form.type = this.data.type;
        this.form.status = this.data.status;
        this.form.price = this.data.price;
        this.form.content = this.data.content;
        this.form.pics = this.data.pics;
        this.form.mall_game_id = this.data.mall_game_id;
        this.form.tsy_goods_id=this.data.tsy_goods_id;
        this.form.discount=this.data.discount;
        this.form.expire_hour=this.data.expire_hour;

        if(this.data.tsy_goods_id!=""){
          this.ralateTsyGoods=true;
        }
        
        this.form.stock = this.data.stock;
        this.form.exchange_limit = this.data.exchange_limit;
        for (let i = 0; i < this.gameLists.length; i++) {
          if (this.form.mall_game_id === this.gameLists[i].id) {
            this.nameGame = this.gameLists[i].game_name;
            this.form.gameName = this.gameLists[i].game_name;
          }
        }
      }
    },
    // 弹出框确定
    ok() {
      this.$emit("complate", this.form, this.isModify);
      this.$emit("update:visible", false);
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
            if(this.form.tsy_goods_id== d.id){
              this.tsy_goods_name=d.name;
            }
          })
        }else{
          this.$message.error(resp.data.errors);
        }
      }).catch(_=>{})
    },

    //远程搜索
    querySearchAsync(queryString, cb) {
      var lists = this.tsy_goods_list;
      var results = queryString ? lists.filter(this.createFilter(queryString)) : lists;
      cb(results);
    },
    createFilter(queryString) {
        return (item) => {
          return item => item.value.toLowerCase().includes(queryString.toLowerCase())
        };
      },
    handleSelect(item) {
      this.form.tsy_goods_id=item.id;
    },
    getGameList() {
      let params = {
        is_page: 2
      };
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/mall/game/index`, {params})
        .then(resp => {
          if (resp.data.success) {
            this.gameLists = resp.data.data;
            this.isEdit();
          }
        })
        .catch(_ => {});
    }
  },
  watch: {
    nameGame(newval, oldval) {
      if (newval !== oldval) {
        for (let i = 0; i < this.gameLists.length; i++) {
          if (this.nameGame === this.gameLists[i].game_name) {
            this.form.mall_game_id = this.gameLists[i].id;
          }
        }
      }
    }
  },
  created() {
    this.getTsyGameList();
    this.getGameList();
  }
};

const typeOption = [
  {label:"游戏",id:4},
  {label:"通用",id:5}
];

const statusOption = [{ label: "已上架", id: 1 }, { label: "已下架", id: 2 }];
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
