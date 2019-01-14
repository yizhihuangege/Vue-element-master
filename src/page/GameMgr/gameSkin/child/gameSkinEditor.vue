<template>
    <section>
        <el-form :form="form" label-width="120px" :rules="rules" :ref="form" :model="form" :inline-message="true">
            <el-form-item label="皮肤名称" prop="name">
                <el-input clearable v-model="form.name" class="mw300" placeholder="请输入皮肤名称"></el-input>
            </el-form-item>
            <el-form-item label="皮肤展示" prop="avatar">
                <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                        :on-success="onFormPicUpload"
                        name="uploadfile">
                    <img v-if="form.avatar" :src="form.avatar" class="bg">
                    <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" clearable>
                <el-option label="已上线" :value="1"></el-option>
                <el-option label="已下线" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联商品" prop="tsy_goods_id">
                <el-autocomplete
                    class="inline-input mw300"
                    v-model="tsy_goods_name"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="搜索关联淘手游商品"
                    @select="handleSelect"
                    clearable>
                </el-autocomplete>
            </el-form-item>

            
            <el-form-item label="皮肤价格">{{ curPrice }}</el-form-item>


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
  name: "game-skin-editor",
  props: ["data", "type","hero_id"],
  data() {
    return {
      rules,
      tsy_goods_name:"",
      tsy_goods_list:[],

      curPrice:"0.00",
      form: {
          name:"",
          avatar:"",
          tsy_goods_id:"",
          status:""
      }
    };
  },
  created() {
    this.getTsyGameList();
    if(this.type==="edit"){
      this.form=JSON.parse(JSON.stringify(this.data));
      this.curPrice=this.form.price;
    }
  },
  methods: {
    onFormPicUpload(response) {
      if (response.status !== 0) {
        this.$message.error(response.error_message);
      }
      this.form.avatar = response.data.url;
    },
    getTsyGameList(){
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/tsy_skin`).then(resp=>{
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
      })
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    querySearchAsync(queryString, cb) {
      var lists = this.tsy_goods_list;
      var results = queryString ? lists.filter(this.createFilter(queryString)) : lists;
      cb(results);
    },
    createFilter(queryString) {
      return item => item.value.toLowerCase().includes(queryString.toLowerCase())
    },
    handleSelect(item) {
      this.curPrice=item.price;
      this.form.tsy_goods_id=item.id;
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
            let str="添加",
                url=`${process.env.GUESSING_HOST_URL}/api/admin/create_gameheroskin`,
                params={
                    game_hero_id:this.hero_id,
                    name:this.form.name,
                    avatar:this.form.avatar,
                    tsy_goods_id:this.form.tsy_goods_id,
                    price:this.curPrice,
                    status:this.form.status
                };
            
            if(this.type==="edit"){
                params.id=this.data.id;
                str="编辑";
                url=`${process.env.GUESSING_HOST_URL}/api/admin/edit_gameheroskin`
            }

            this.$http.post(url,params).then(resp=>{
                if(resp.data.success){
                    this.$message.success(`${str}成功`);
                    this.$emit("complete");
                    this.cancel();
                }else{
                    this.$message.error(resp.data.errors);
                }
            })
        }
      });
    }
  }
};

const rules = {

};
</script>
