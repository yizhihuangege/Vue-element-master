<template>
    <div>
        <el-form label-width="100px" size="small">
            <el-form-item v-for="item in itemOption" :label="item.label+'：'" :key="item.id">
                {{ data[item.prop] || "----------" }}
            </el-form-item>
        </el-form>

        <el-row class="area" type="flex" justify="center">
            <el-button type="primary" @click="cancel">确 定</el-button>
        </el-row>
    </div>
</template>
<script>
export default {
    name:"tsy-order-detail",
    props:["visible","data"],
    data(){
        return{
            itemOption,

        }
    },
    created(){

    },
    methods:{
        cancel(){
            this.$emit("update:visible",false)
        }
    }
}

const itemOption=[
    { label:"联系电话",prop:"phone" },
    { label:"QQ号码",prop:"qq" },
    { label:"游戏区服",prop:"game_server" },
    { label:"游戏账号",prop:"game_account" },
    { label:"备注",prop:"remarks" },
]
</script>
<style scoped>

</style>