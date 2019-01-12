<template>
  <section>
    <el-form :form="form" label-width="100px" :ref="form" :model="form" :inline-message="true">
      <el-form-item label="用户ID：">
        <span>{{form.user_id}}</span>
      </el-form-item>

      <!-- <el-form-item label="用户昵称：">
        <span>{{form.user}}</span>
      </el-form-item> -->


      <el-form-item label="兑换商品：">
        <span>{{form.goods.name}}</span>
      </el-form-item>
      <el-form-item label="价格(元)：">
        <span>{{form.price}}</span>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select style="width:150px" v-model="form.status" filterable clearable placeholder="选择类型">
          <el-option v-for="item of statusOption" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="失败描述：" v-if="form.status===3">
        <el-input type="textarea" maxlength="500" v-model="form.failure_reason" placeholder="内容在此输入（最大字数500）" :autosize="{ minRows: 3, maxRows: 6}"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" style="display: block;text-align: right;">
        <el-row class="area" type="flex" justify="center">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok">完 成</el-button>
        </el-row>
      </span>
  </section>
</template>

<script>
  export default {
    name: "orderMgrEdit",
    props: ["data"],
    data() {
      return {
        statusOption,
        form: {},
      }
    },
    created() {
      this.form=JSON.parse(JSON.stringify(this.data));
    },
    methods: {
      // 弹出框取消
      cancel() {
        this.$emit("update:visible", false);
      },
      // 弹出框确定
      ok() {
        let params={
          id:this.form.id,
          status:this.form.status,
          failure_reason:this.form.failure_reason
        }
        this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/order/update`, params)
        .then(resp=>{
          if (resp.data.errors === "编辑成功" && resp.data.success) {
            this.$message.success("编辑成功");
            this.$emit("update:visible",false);
            this.$emit("complete");
          } else if (resp.data.errors === "已经失败的订单，不能再编辑" &&!resp.data.success) {
            this.$message.error(resp.data.errors);
          } else if (resp.data.errors === "编辑成功,退还M币成功" &&resp.data.success) {
            this.$message.success(resp.data.errors);
            this.$emit("update:visible",false);
            this.$emit("complete");
          } else if (resp.data.errors === "退还M币失败" &&!resp.data.success) {
            this.$message.error("退还M币失败");
          } else {
            this.$message.error("编辑失败");
          }
          
        }).catch(_=>{})
      },
    }
    
  }


  const statusOption= [
          { label: "未处理", id: 1 },
          { label: "已处理", id: 2 },
          { label: "失败", id: 3 },
        ]
</script>

<style scoped>
</style>
