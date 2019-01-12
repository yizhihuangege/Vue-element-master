<template>
    <section v-loading="isLoad">
        <el-form label-width="300px">
            <el-form-item v-for="item in itemList" :key="item.id" :label="item.name+'：'">
                <el-switch v-model="item.value" active-value="1" active-text="开启" inactive-text="关闭" inactive-value="2" @change="change(item)"></el-switch>
            </el-form-item>
        </el-form>
        <el-row class="area" type="flex" justify="center">
            <el-button @click="cancel" type="primary">确 定</el-button>
        </el-row>
    </section>
</template>
<script>

export default{
    name:"chance-editor",
    props:[],
    data(){
        return{
            isLoad:true,
            itemList:[]
        }
    },
    created(){
        this.initData()
    },
    methods:{
        initData(){
            this.isLoad=true;
            this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/server_config_index`).then(rsp=>{
                if(rsp.data.success){
                    this.isLoad=false;
                    this.itemList=rsp.data.data;
                }else{
                    this.$message.error(rsp.data.errors)
                }
            })
        },
        change(item){
            let params={
                id:item.id,
                value:item.value
            }
            this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/server_config_edit`,params).then(rsp=>{
                if(rsp.data.success){
                    this.$message.success("修改成功");
                }else{
                    this.$message.error(rsp.data.errors);
                }
            })
        },
        cancel(){
            this.$emit("update:visible",false)
        }
    }
}
</script>
