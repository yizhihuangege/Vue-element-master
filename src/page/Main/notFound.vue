<template>
    <section class="container">
        <section class="text-container">
            <h1 class="text">
                <i class="el-icon-error"></i>
                目标页不存在
            </h1>
            <h3>
                <el-button type="text" @click="goback">返回上一页</el-button>
                <el-button type="text" @click="gohome">返回首页</el-button>
            </h3>
        </section>
    </section>
</template>

<script>
    export default {
        name:'not-found',
        methods:{
            goback(){
                this.$router.go(-1)
            },
            gohome(){
                this.$router.replace({path:'/'})
            }
        }
    }
</script>

<style scoped>
.container {
    width:100%;
    height:100%;
    display:flex;
    justify-content: center;
}

.text-container {
    font-weight: 200;
    color: #2a4fa5;
    margin-top:5em;
}

.text-container h1 {
    font-weight: 200;
    font-size: 35px;
}

.text-container h3 {
    font-weight: 200;
    font-size: 20px;
    padding:0.5em 2.5em;
    display:flex;
    justify-content: space-between;
}

</style>