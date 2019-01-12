<template>
    <section>
        <el-form :form="form" label-width="120px" :rules="rules" :ref="form" :model="form" :inline-message="true">

            
            <el-form-item label="选择游戏" prop="position">
                <el-select v-model="form.relate_game" placeholder="请选择游戏" clearable>
                    <el-option v-for="(item,index) in relateGameOption" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="英雄称号" prop="alias">
                <el-input  v-model="form.alias" placeholder="请输入英雄称号" style="max-width:300px" clearable></el-input>
            </el-form-item>
            <el-form-item label="英雄名字" prop="name">
                <el-input  v-model="form.name" placeholder="请输入英雄名字" style="max-width:300px" clearable></el-input>
            </el-form-item>
            <el-form-item label="英雄定位" prop="position">
                <el-select v-model="form.positions" placeholder="请选择英雄定位" clearable multiple>
                    <el-option v-for="item in positionOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="英雄头像" prop="avatar">
                <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                        :on-success="onFormPicUpload"
                        name="uploadfile">
                    <img v-if="form.avatar" :src="form.avatar" class="bg">
                    <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
                </el-upload>
            </el-form-item>
            
            <el-form-item label="排序" prop="sort">
                <el-input-number  v-model="form.sort"></el-input-number>
            </el-form-item>
            <el-form-item label="是否热门" prop="is_hot">
                <el-switch v-model="form.is_hot" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
            <el-form-item label="状态" prop="status" v-if="type=='edit'">
                <el-radio v-model="form.status" :label="1" border>已上线</el-radio>
                <el-radio v-model="form.status" :label="2" border>已下线</el-radio> 
                <el-radio v-model="form.status" :label="3" disabled border>已删除</el-radio> 
            </el-form-item>

            <!-- <el-form-item prop="pics" label="宣传图(1-5张)">
                <el-upload
                    multiple
                    class="upload-demo"
                    action="http://static.kuaifazs.com/sdkkitfile.php"
                    :on-remove="handleRemove"
                    :on-success="handleChange"
                    :file-list="form.pics"
                    list-type="picture-card"
                    name="uploadfile">
                <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item> -->
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
  name: "game-hero-editor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      positionOption,
      relateGameOption,
      form: {
          relate_game:"",
          alias:"",
          name:"",
          avatar:"",
          positions:[],
        //   pics:[],
          sort:99,
          status:"",
          is_hot:0
      }
    };
  },
  created() {
    if(this.type==="edit"){
      this.form=JSON.parse(JSON.stringify(this.data));
    //   this.form.positions=this.form.positions;
    //   this.form.pics=this.form.pics.split(",").map(d=>{
    //       return d={ url:d }
    //   })
    }
  },
  methods: {
    onFormPicUpload(response) {
      if (response.status !== 0) {
        this.$message.error(response.error_message);
      }
      this.form.avatar = response.data.url;
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    // handleRemove(file, fileList) {
    //   this.form.pics=fileList;
    // },
    // handleChange(response, file, fileList) {
    //     if(fileList.length>5) fileList.pop();
    //     this.form.pics=fileList.map(d=>{
    //         if(d.response){
    //             d.url=d.response.data.url
    //         }else{
    //             d.url=d.url
    //         }
    //         return d;
    //     });
    // },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
            let str="添加",
                url=`${process.env.GUESSING_HOST_URL}/api/admin/create_gamehero`,
                params={
                    alias:this.form.alias,
                    name:this.form.name,
                    avatar:this.form.avatar,
                    position:this.form.positions.join(","),
                    relate_game:this.form.relate_game,
                    sort:this.form.sort,
                    is_hot:this.form.is_hot,
                    // pics:this.form.pics.map(d=>d.url)
                };
            
            if(this.type==="edit"){
                params.id=this.data.id;
                params.status=this.form.status;
                str="编辑";
                url=`${process.env.GUESSING_HOST_URL}/api/admin/edit_gamehero`;
            }
            this.$http.post(url,params).then(resp=>{
                if(resp.data.success){
                    this.$message.success(`${str}成功`);
                    this.$emit("complete");
                    this.cancel();
                }else{
                    this.$message.error(resp.data.errors);
                }
            }).catch(err=>{
                this.$message.error(err.response.data.msg)
            })
        }
      });
    }
  }
};

const relateGameOption=[
    { label:"王者荣耀",value:1 },
    { label:"英雄联盟",value:2 },
]


const positionOption=[
    { label:"坦克",value:1 },
    { label:"战士",value:2 },
    { label:"刺客",value:3 },
    { label:"法师",value:4 },
    { label:"射手",value:5 },
    { label:"辅助",value:6 },
];

const rules = {
  alias: [{required: true,message: "英雄称号不能为空",trigger: "blur"}],
  name: [{required: true,message: "英雄名字不能为空",trigger: "blur"}],
  avatar: [{required: true,message: "英雄头像不能为空",trigger: "blur"}],
  positions: [{required: true,message: "英雄类型不能为空",trigger: "blur"}],
  sort: [{required: true,message: "排序值不能为空",trigger: "blur"}],
  pics: [{required: true,message: "宣传图不能为空",trigger: "blur"}]
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
