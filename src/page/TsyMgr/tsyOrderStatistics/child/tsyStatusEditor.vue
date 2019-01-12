<template>
    <div>
        <el-form label-width="120px" >
            <el-form-item label="订单状态">
                <el-select v-model="status" clearable placeholder="请选择订单状态">
                    <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-row class="area" type="flex" justify="center">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok">完 成</el-button>
        </el-row>
    </div>
</template>
<script>
export default {
    name:"tsy-status-editor",
    props:["visible","data"],
    data(){
        return{
            statusOption,
            status:""
        }
    },
    created(){
        this.status=this.data.manual_status;
    },
    methods:{
        cancel(){
            this.$emit("update:visible",false)
        },
        ok(){
            this.$http.post(`${process.env.GUESSING_HOST_URL}/api/admin/manual_change_status`,{ id:this.data.id,m_status:this.status })
            .then(rsp=>{
                if(rsp.data.success){
                    this.$message.success("修改成功")
                    this.cancel()
                    this.$emit("complete")
                }else{
                    this.$message.error(rsp.data.errors)
                }
            }).catch(e=>{})
        }
    }
}

const statusOption=[
    { label:"未处理",value:0 },
    { label:"发货中",value:1 },
    { label:"用户确认",value:2 },
    { label:"已完成",value:3 },
]
</script>