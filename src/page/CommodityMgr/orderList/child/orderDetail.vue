<template>
  <section>
    <!-- 游戏 -->
    <el-row v-if="data.goods.type === 4">
      <el-col :span="24" style="margin-top: 15px"><span class="gg">游戏名称：</span>{{goodsInfo.game_name}}</el-col>
      <el-col :span="24" style="margin-top: 15px"><span class="gg">玩家账号：</span>{{goodsInfo.game_accounts}}</el-col>
      <el-col :span="24" style="margin-top: 15px"><span class="gg">游戏区服：</span>{{goodsInfo.game_server}}</el-col>
      <el-col :span="24" style="margin-top: 15px"><span class="gg ">电话：</span>{{goodsInfo.phone}}</el-col>
      <el-col :span="24" style="margin-top: 15px"><span class="gg ">QQ号：</span>{{goodsInfo.qq}}</el-col>
      <el-col :span="24" style="margin-top: 15px"><span class="gg ">玩家留言：</span>{{goodsInfo.remarks}}</el-col>
    </el-row> 

    <!-- 通用 -->
    <el-row v-else>
      
      <el-col :span="24" style="margin-top: 15px"><span class="gg ">电话：</span>{{goodsInfo.phone}}</el-col>
      <el-col :span="24" style="margin-top: 15px"><span class="gg ">QQ号：</span>{{goodsInfo.qq}}</el-col>
      <el-col :span="24" style="margin-top: 15px"><span class="gg ">玩家留言：</span>{{goodsInfo.detail}}</el-col>
    </el-row> 
    <span slot="footer" class="dialog-footer">
      <el-row class="area" type="flex" justify="center">
          <el-button @click="cancel" type="primary">确 定</el-button>
      </el-row>
    </span>
  </section>
</template>

<script>
export default {
  name: "orderDetail",
  props:["data"],
  data() {
    return {
      goodsInfo: {
        game_accounts:'',
        game_name:'',
        game_server:'',
        remarks:'',
        game_password:'',
        name:'',
        phone:'',
        address:'',
        detail:''
      }
    }
  },
  methods:{
    // 弹出框取消
    cancel() {
      this.$emit("update:visible", false);
    },
    init() {
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/order/info?id=${this.data.id}`)
        .then(resp => {
          if(resp.data.success) {
            this.goodsInfo=resp.data.data[0];
          }else{
            this.$message.error(resp.data.errors);
          }
        })
        .catch(_ => {})
    },
  },
  created() {
    this.init()
  }
}
</script>

<style scoped>
.gg{
  font-size: 16px;
  font-weight: bold;
}
</style>
