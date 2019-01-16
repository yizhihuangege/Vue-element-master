<template>
    <section>
        <el-form :form="form" label-width="100px" :rules="rules" :ref="form" :model="form" :inline-message="true" v-loading="type==='edit' && loading">
            <el-form-item label="英雄名称" prop="game_hero_name">
                <el-autocomplete
                    class="mw300"
                    v-model="form.game_hero_name"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="输入搜索英雄名称"
                    @select="handleSelect"
                    clearable>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="皮肤名称" prop="skin_id">
                <el-select clearable placeholder="选择皮肤" v-model="form.skin_id" @change="skinSelect">
                    <el-option v-for="(item,index) in skinOption" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <!-- <section v-if="">关联淘手游商品ID：1111</section> -->
            </el-form-item>

            <el-form-item label="皮肤展示" prop="skin_avatar">
                <el-upload class="avatar-uploader" action="http://static.kuaifazs.com/sdkkitfile.php" :show-file-list="false"
                        :on-success="onFormPicUpload"
                        name="uploadfile">
                    <img v-if="form.skin_avatar" :src="form.skin_avatar" class="bg">
                    <i v-else class="el-icon-plus avatar-uploader-icon bg"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="皮肤价值" prop="price">
                <el-input-number v-model="form.price"></el-input-number>
            </el-form-item>

            <el-form-item label="上线轮次" prop="round">
                <el-select v-model="form.round" clearable placeholder="请选择上线轮次">
                    <el-option v-for="(item,index) in roundOption" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="每份价值" prop="per_mcoin">
                <el-select clearable v-model="form.per_mcoin">
                    <el-option v-for="(item,index) in perOption" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="状态" prop="status">
                <el-radio v-model="form.status" :label="1">上线</el-radio>
                <el-radio v-model="form.status" :label="2">下线</el-radio>
            </el-form-item>
        </el-form>
        <el-row class="area" type="flex" justify="center">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok(form)">完 成</el-button>
        </el-row>
    </section>
</template>

<script>
export default {
    name:"group-purchase-editor",
    props:["visible","type","data"],
    data(){
        return{
            loading:false,
            rules,
            skinOption:[],
            selectedSkin:{},
            roundOption,perOption,
            form:{
                game_hero_name:"",
                game_hero_id:"",
                skin_id:"",
                skin_avatar:"",
                price:"",
                round:"",
                status:1,
                per_mcoin:"",
            },
            related_id:"",           // 关联淘手游商品ID
        }
    },
    created(){
        this.loading=true;
        if(this.type==="edit"){
            this.form=JSON.parse(JSON.stringify(this.data));
            this.searchHero(this.form.game_hero_name,(data)=>{
                this.skinOption=data[0].skins;
                this.skinSelect(this.form.skin_id);
            })
        }
    },
    methods:{
        cancel(){
            this.$emit("update:visible",false)
        },
        searchHero(queryString,cb){
            this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/gamehero/search?name=${queryString}`)
            .then(resp=>{
                if(resp.data.success){
                    this.loading=false;
                    cb(resp.data.data);
                }else{
                    this.$message.error(resp.data.errors);
                }
            })
        },
        querySearchAsync(queryString, cb) {
            queryString=queryString.trim();
            if(!queryString){
                this.skinOption=[];
                this.curSkin={};
                this.form.skin_id="";
                this.form.skin_avatar="";
                this.form.price="";
                this.form.per_mcoin="";
            }
            this.searchHero(queryString,(data)=>{
                var lists =data.map(d=>{
                    d.value=d.name;
                    return d;
                });
                var results = queryString ? lists.filter(this.createFilter(queryString)) : lists;
                cb(results);
            })
        },
        createFilter(queryString) {
            return item => item.value.toLowerCase().includes(queryString.toLowerCase())
        },
        // 选择英雄
        handleSelect(item) {
            this.form.game_hero_id=item.id;
            this.skinOption=item.skins;
        },
        // 选择皮肤
        skinSelect(id){
            if(!id){
                this.form.skin_avatar="";
                this.form.price="";
                this.form.per_mcoin="";
                return;
            }
            let selectedItem=this.skinOption.filter(item=>item.id===id);
            this.selectedSkin=selectedItem[0];
            this.related_id=this.selectedSkin.tsy_goods_id;
            this.form.skin_avatar=this.selectedSkin.avatar;
            this.form.price=this.selectedSkin.price;
        },
        onFormPicUpload(response) {
            if (response.status !== 0) {
                this.$message.error(response.error_message);
            }
            this.form.skin_avatar = response.data.url;
        },
        ok(form){
            this.$refs[form].validate(valid=>{
                if(valid){
                    let url=`${process.env.GUESSING_HOST_URL}/api/admin/create_groupgood`,
                        str="添加",
                        params={
                            game_hero_id:this.form.game_hero_id,
                            skin_id:this.form.skin_id,
                            skin_avatar:this.form.skin_avatar,
                            price:Math.ceil(this.form.price),
                            status:this.form.status,
                            round:this.form.round,
                            per_mcoin:this.form.per_mcoin,
                        }

                    if(this.type==="edit"){
                        str="编辑";
                        url=`${process.env.GUESSING_HOST_URL}/api/admin/edit_groupgood`;
                        params.id=this.data.id;
                    }

                    this.$http.post(url,params).then(resp => {
                        if (resp.data.success) {
                            this.$message.success(`${str}成功`);
                            this.cancel();
                            this.$emit("complete");
                        } else {
                            this.$message.error(resp.data.errors);
                        }
                    });
                }else{
                    return false;
                }
            })
        },
    },
}

const perOption=[
    { label:"1000",value:1000 },
    { label:"2000",value:2000 },
    { label:"3000",value:3000 },
    { label:"4000",value:4000 },
    { label:"5000",value:5000 },
]

const roundOption=[
    { label:"0:00",value:0 },
    { label:"8:00",value:8 },
    { label:"10:00",value:10 },
    { label:"12:00",value:12 },
    { label:"14:00",value:14 },
    { label:"16:00",value:16 },
    { label:"18:00",value:18 },
    { label:"20:00",value:20 },
    { label:"22:00",value:22 },
]
const rules={
    // game_hero_name:[{ required:true,message:"英雄名称不能为空",trigger:"blur" }],
    skin_id:[{ required:true,message:"皮肤不能为空",trigger:"blur" }],
    skin_avatar:[{ required:true,message:"皮肤图片不能为空",trigger:"blur" }],
    price:[{ required:true,message:"物品价值不能为空",trigger:"blur" }],
    round:[{ required:true,message:"上线轮次不能为空",trigger:"blur" }],
}
</script>