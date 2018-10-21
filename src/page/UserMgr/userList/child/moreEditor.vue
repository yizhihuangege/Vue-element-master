<template>
  <section v-loading="loading">
    <el-form>
        <el-form-item label="设备码：">
          <span>{{form.device_id}}</span>
        </el-form-item>
        <el-form-item label="收货信息：">
          <section v-for="(item,index) in form.delivery" :key="index" style="boder-bottom:1px dashed #ccc">
            <br/><section style="margin-left:60px">
              <section style="margin-left:-12px"> {{index+1}}.收件人：{{item.name}}</section>
              <section>联系方式：{{item.phone}}</section>
            </section><br/>
            <section style="margin-left:60px;margin-top:-40px">
              <span>收货地址：{{item.address}}</span>
            </section>
          </section><br/>
          <!-- 收货信息分页 -->
          <el-row class="area" type="flex" justify="center">
            <el-pagination @current-change="getData"
                          background
                          layout="total,prev, pager, next, jumper"
                          :current-page.sync="curPage"
                          :total="countTotal"
                          v-if="form.delivery.length">
            </el-pagination>
          </el-row>
        </el-form-item>
        <el-form-item label="用户累计获得猫币：">
          <span>{{form.total_get}} M币</span>
        </el-form-item>
        <el-form-item label="用户累计消费猫币：">
          <span>{{form.total_spend}} M币</span>
        </el-form-item>
    </el-form>
    <el-row class="area" type="flex" justify="center">
        <el-button type="primary" @click="cancel">确 定</el-button>
    </el-row>
  </section>
</template>
<script>
export default {
  name: "more-editor",
  props: ["data"],
  data() {
    return {
      loading:true,
      form:{
        device_id:"",
        delivery:[],
        total_get:"",
        total_spend:"",
      },
      curPage:1,
      countTotal:0
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData(){
      this.loading=true;
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/address?id=${this.data.id}&page=${this.curPage}`)
      .then(resp=>{
        if(resp.data.success){
          this.loading=false;
          let data=resp.data.data;
          this.form.device_id=data.device_id;
          this.form.total_get=data.total_get;
          this.form.total_spend=data.total_spend;
          this.form.delivery=data.rows;
          this.countTotal=data.pagenation.total;

        }else{
          this.$message.error(resp.data.errors);
        }
      }).catch(_=>{})
    },
    cancel() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style scoped>
</style>