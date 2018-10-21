<template>
  <section v-loading="loading">
    <section>
      <h3>当前用户ID：{{data.user_id}}</h3>
    </section>

    <el-row class="area" type="flex" justify="center">
      <el-carousel v-if="pics.length>0" trigger="click" style="width:300px;height:500px;">
        <el-carousel-item v-for="(item,index) in pics" :key="index" style="width:100%;height:100%;">
          <img :src="'data:image/jpeg;base64,'+item.pic" alt="" style="height:100%">
        </el-carousel-item>
      </el-carousel>

      <section v-if="pics.length==0" style="width:300px;height:300px;" class="banner-text">
        暂无视频图片
      </section>
    </el-row>
    <!-- 表单 -->
    <el-form v-if="type==='edit'" label-width="80px" style="margin-top:20px">
        <el-form-item label="审核意见">
            <el-radio  border v-model="status" label="1">通过</el-radio>
            <el-radio  border v-model="status" label="2">拒绝</el-radio>
        </el-form-item>
        <el-form-item label="说明:">
            <el-input type="textarea" v-model="comment" placeholder="请输入你的审核意见" style="width:80%"></el-input>
        </el-form-item>
    </el-form>

    <section v-if="type==='view'">
      <section class="desc">
        审核意见：{{status==='1'?"通过":(status==='2'?"拒绝":"未审核")}}
      </section>
      <section class="desc">
        说明：{{comment}}
      </section>
    </section>
    <span slot="footer" class="dialog-footer">
        <el-row class="area" type="flex" justify="center" v-if="type==='edit'">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok">完 成</el-button>
        </el-row>
        <el-row class="area" type="flex" justify="center" v-else>
            <el-button type="primary" @click="cancel">确 定</el-button>
        </el-row>
    </span>
    
  </section>
</template>
<script>
export default {
  name: "user-check-editor",
  props: ["data","type"],
  data() {
    return {
      loading:true,
      pics:[],
      status:"1",
      comment:""
    };
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      this.status=(this.data.status).toString();
      this.comment=this.data.comment;
      
      //获取认证详情
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/detail_video?id=${this.data.user_id}`)
      .then(resp=>{
        if(resp.data.success){
          this.loading=false;
          let data=resp.data.data[0];
          this.pics=data.pics;
        }else{
          this.$message.error(resp.data.errors);
        }
      }).catch(_=>{})
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    ok() {
      let params={
        id:this.data.id,
        status:this.status,
        comment:this.comment
      }

      this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/video_check_check`,params)
      .then(resp=>{
        if(resp.data.success){
          this.$message.success("审核成功");
          this.$emit("update:visible",false);
          this.$emit("complete");
        }else{
          this.$message.error(resp.data.errors);
        }
      }).catch(_=>{})
    }
  }
};
</script>

<style scoped>
  .banner-text{
    line-height: 300px;
    text-align: center;
    border:1px dashed #ccc;
    font-size: 20px;
  }
  .desc{
    margin-top:10px;font-size:16px
  }
</style>