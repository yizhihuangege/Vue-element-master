<template>
  <section>
    <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" :inline-message="true">
      

      <el-form-item label="所属游戏" prop="game_id">
        <el-select v-model="form.game_id" clearable placeholder="请选择游戏">
          <el-option v-for="item in gameOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="轮播名称" prop="title">
        <el-input  v-model="form.title" placeholder="轮播名称" class="mw300" clearable></el-input>
      </el-form-item>
    
      <el-form-item label="轮播图" prop="cover">
        <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                   :on-success="onFormPicUpload"
                   name="uploadfile">
          <img v-if="form.cover" :src="form.cover" class="bg">
          <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="排序值" prop="sort">
        <el-input-number v-model="form.sort"></el-input-number>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio border :label="1">已上线</el-radio>
          <el-radio border :label="2">已下线</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
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
  name: "squared-up-banner-editor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      gameOption,
      form: {
        game_id:"",
        title:"",
        cover:"",
        sort:"",
        status:1,
        remark:""
      }
    }
  },
  created() {
    if(this.type === "edit") {
      this.form = JSON.parse(JSON.stringify(this.data))
    }
  },
  methods: {
    onFormPicUpload(response) {
      if (response.status !== 0) {
        this.$message.error(response.error_message);
      }
      this.form.cover = response.data.url;
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    //远程搜索
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let url = `${process.env.GUESSING_HOST_URL}/api/admin/create_jiugonggeactivity`,
            params = {
              game_id:this.form.game_id,
              title:this.form.title,
              cover:this.form.cover,
              sort:this.form.sort,
              status:this.form.status,
              remark:this.form.remark
            },
            str = "添加";
          if (this.type === "edit") {
            params.id = this.form.id;
            url = `${process.env.GUESSING_HOST_URL}/api/admin/edit_jiugonggeactivity`
            str = "编辑";
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
      })
    }
  }
}


const gameOption=[
  { label:"王者荣耀",value:1 },
]

const rules = {
  game_id: [{ required: true, message: "请选择游戏", trigger: "blur" }],
  title: [{ required: true, message: "请输入轮播标题", trigger: "blur" }],
  cover: [{ required: true, message: "请上传轮播图片", trigger: "blur" }],
  sort: [{ required: true, message: "请填写排序字段", trigger: "blur" }],

}
</script>
