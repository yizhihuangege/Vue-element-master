<template>
    <section v-loading="loading">
        <section v-for="(item,key) in journalList" :key="key" class="log-item" v-if="journalList.length>0">
            <section class="date">{{item.updated_at}}</section>
            <section class="detail">{{item.change_detail}}</section>
        </section>
        <section style="text-align:center" v-if="journalList==0">暂无日志记录</section>
        <el-row class="area" type="flex" justify="center" v-if="journalList.length>0">
            <el-pagination @current-change="getData" background layout="total,prev, pager, next, jumper" :current-page.sync="pagination.curPage" :total="pagination.total"
                :page-size="pagination.pageSize"></el-pagination>
        </el-row>
        <el-row class="area" type="flex" justify="center" style="margin-top:20px">
            <el-button type="primary" @click="ok">确 定</el-button>
        </el-row>
    </section>
</template>
<script>
    export default{
        name:"journal",
        props:["data"],
        data(){
            return{
                loading:true,
                journalList:[],
                pagination:{
                    current:1,
                    total:0,
                    pageSize:10
                }
            }
        },
        created(){
            this.getData();
        },
        methods:{
            getData(){
                let params={
                    id:this.data.id,
                    page:this.pagination.curPage,
                    limit:this.pagination.pageSize
                }

                this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/user_change_log`,{params}).then(resp=>{
                    if(resp.data.success){
                        this.loading=false;
                        this.pagination.total=resp.data.data.pagenation.total;
                        this.journalList = resp.data.data.rows;
                    }else{
                        this.$message.error(resp.data.errors);
                    }
                }).catch(_=>{})
            },
            ok(){
                this.$emit("update:visible",false);
            }
        }
    }

</script>
<style scoped>
.date {
  font-weight: bold;
}
.log-item {
  border-bottom: 1px dashed #666;
}
.log-item section {
  line-height: 30px;
  font-size: 16px;
}
</style>

