<template>
    <section>
        <el-form label-width="120px">
            <el-form-item label="下轮折扣">
                <el-select v-model="discount" clearable>
                    <el-option v-for="item in discountOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-row class="area" type="flex" justify="center">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok">完 成</el-button>
        </el-row>
    </section>
</template>
<script>

export default {
    name:"discount-config",
    data(){
        return {
            discountOption,
            discount:5
        }
    },
    created(){
        this.init();
    },
    methods:{
        cancel(){
            this.$emit("update:visible",false);
        },
        init(){

        },
        ok(){
            if(!this.discount){
                this.$message.error("必填项不能为空")
                return false
            }
            this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/config_jiugongge_discount`,{ value:this.discount })
            .then(rsp=>{
                if(rsp.data.success){
                    this.$message.success("配置成功")
                    this.cancel()
                }else{
                    this.$message.error(rsp.data.errors)
                }
            }).catch(e=>{
                this.$message.error("配置失败")
            })            
        }
    }
}

const discountOption=[
    { label:"免费",value:0 },
    { label:"一折",value:1 },
    { label:"三折",value:3 },
    { label:"五折",value:5 },
]
</script>