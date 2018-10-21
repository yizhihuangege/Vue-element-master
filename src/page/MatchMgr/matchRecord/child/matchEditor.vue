<template>
  <section>
    <el-form :form="form" label-width="120px" :rules="rules" :ref="form" :model="form" :inline-message="true" v-loading="loading">
      <el-form-item label="选择游戏" prop="game_id">
        <el-select style="width:20%" v-model="form.game_id" filterable clearable placeholder="请选择" @change="selectGame" :disabled="type==='edit'">
          <el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="参赛队伍" prop="teams">
        <el-select style="width:20%" v-model="form.team_1.id" filterable clearable placeholder="请选择">
          <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
          vs
        <el-select style="width:20%" v-model="form.team_2.id" filterable clearable placeholder="请选择">
          <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="比赛名称" prop="match_name">
        <el-input v-model="form.match_name" placeholder="比赛名称" style="width:200px" clearable></el-input>
        <el-checkbox v-model="hasliveUrl" style="margin-left:20px">添加直播地址</el-checkbox>
        <el-input v-model="form.live_url" v-if="hasliveUrl" style="width:270px;margin-left:20px" placeholder="请输入直播地址" clearable></el-input>
      </el-form-item>

      <el-form-item label="开始时间" prop="start_time">
        <el-date-picker v-model="form.start_time" value-format="yyyy-MM-dd HH:mm:SS" type="datetime" placeholder="选择日期时间" clearable>
        </el-date-picker>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select style="width:20%" v-model="form.status" filterable clearable placeholder="选择状态" :disabled="type==='add'">
          <el-option v-for="item in statusOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
        <el-checkbox v-model="form.manual" style="margin-left:20px">状态手动变更</el-checkbox>
      </el-form-item>
      <!-- 已结算 -->
      <el-form-item label="结束时间" v-if="form.status===3" prop="end_time">
        <el-date-picker v-model="form.end_time" value-format="yyyy-MM-dd HH:mm:SS" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="结果" v-if="form.status===3" prop="results"> 
        <el-col :span="2">
            <el-input v-model="form.result_1" clearable></el-input>
        </el-col>
        <span class="vs">:</span>
        <el-col :span="2">
            <el-input v-model="form.result_2" clearable></el-input>
        </el-col>
      </el-form-item>
      
      <el-form-item label="最低下注金额" prop="min_bet" clearable>
        <el-input type="number" v-model="form.min_bet" style="width:20%" clearable></el-input>
      </el-form-item>
    </el-form>


    <span slot="footer" class="dialog-footer">
        <el-row class="area" type="flex" justify="center">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok(form)">完 成</el-button>
        </el-row>
    </span>
  </section>
</template>

<script>
export default {
  name: "match-editor",
  props: ["data", "type"],
  data() {
    return {
      rules,
      loading:true,
      hasliveUrl:false,
      statusOptions,
      gameList: [],
      teams: [],          //某一游戏下的所有队伍列表
      form: {
        id:"",
        game_id: "", 
        live_url:"",
        team_1: {name:"",id:""},
        team_2: {name:"",id:""},
        start_time: "",
        end_time: "",
        match_name: "",
        result_1: "",
        result_2: "",
        manual:false,
        min_bet:10,       //最低下注金额
        status: ""        //选中状态    1.竞猜中  2.比赛中  3.已结算(此时显示结束时间和比赛结果)
      }
    };
  },
  created() {
    this.getGameList();
    this.init();
  },
  methods: {
    init() {
      if (this.type === "add") {          //添加比赛,只能添加竞猜中的状态
        this.form.status=1;               
      } else {                            //编辑比赛
        this.form.id=this.data.id;
        this.form.status = this.data.status;  
        this.form.match_name = this.data.match_name;
        this.form.game_id = this.data.game_id;
        this.form.start_time=this.data.start_time;
        this.form.end_time=this.data.end_time;
        this.form.manual=this.data.manual==0?false:true;
        this.form.min_bet=this.data.min_bet;
        this.form.live_url=this.data.live_url;

        this.form.team_1.name=this.data.team_1;
        this.form.team_2.name=this.data.team_2;

        if(this.form.status===3){
          this.form.result_1=this.data.result.split(":")[0];
          this.form.result_2=this.data.result.split(":")[1];
        }
        if(this.data.live_url){
          this.hasliveUrl=true;
          this.form.live_url=this.data.live_url;
        }


        this.selectGame();
      }
    },
    //获取所有游戏列表
    getGameList() {
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/game/indexNoPage`)
        .then(resp => {
          if (resp.data.success) {
            this.loading=false;
            this.gameList = resp.data.data;  
          }
        })
        .catch(resp => {
          this.$message.error("游戏列表读取失败");
        });
    },
    //选择游戏失去焦点，根据game_id读取参赛队伍信息
    selectGame() {
      this.$http.get(`${process.env.GUESSING_HOST_URL}/api/admin/team/index?game_id=${this.form.game_id}`)
        .then(resp => {
          if (resp.data.success) {
            this.teams = resp.data.data.data;
            this.teams.map(d => {
              if (d.name === this.data.team_1) {
                this.form.team_1.id = d.id;
              } else if (d.name === this.data.team_2) {
                this.form.team_2.id = d.id;
              }
            });
          }
        })
        .catch(_ => {});
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    ok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let params={
            game_id: this.form.game_id,
            team_1: this.form.team_1.id,
            team_2: this.form.team_2.id,
            match_name: this.form.match_name,
            start_time: this.form.start_time,
            status:this.form.status,
            manual:this.form.manual?1:0,
            min_bet:this.form.min_bet,
            live_url:this.hasliveUrl?this.form.live_url:'',
          },
          url="",
          str="";
          
          //如果已结算，则结束时间与比赛结果必填
          if(params.status===3){
            params.end_time=this.form.end_time;
            params.result=`${this.form.result_1}:${this.form.result_2}`
          }
          
          if(this.type==="add"){
            str="添加";
            url=`${process.env.GUESSING_HOST_URL}/api/admin/add_match`;
          }else{
            str="编辑";
            url=`${process.env.GUESSING_HOST_URL}/api/admin/edit_match`;
            params.id=this.form.id;
          }

          //验证参赛队伍是否相同
          if(params.team_1===params.team_2){
            return this.$message.error("参赛队伍不能相同!");
          }

          //验证结束时间是否大于开始时间
          if(params.end_time && params.end_time<params.start_time){
            return this.$message.error("结束时间不能小于开始时间!");
          }
          
          //提交表单
          this.$http.post(url,params)
          .then(resp=>{
            if(resp.data.success){
              this.$message.success(`${str}成功`);
              this.$emit("update:visible",false);
              this.$emit("editComplete");
            }else{
              this.$message.error(resp.data.errors);
            }
          }).catch(_=>{})
        }
      })
    }
  }
};



const statusOptions=[
          { label: "竞猜中", id: 1, disabled: false },
          { label: "比赛中", id: 2, disabled: false },
          { label: "已结算", id: 3, disabled: false },
          { label: "流局", id: 4, disabled: false }
        ];
const rules={
  teams:[{
    required:false,
    message:"请选择参赛队伍",
    trigger:"blur"
  }],
  match_name:[{
    required:true,
    message:"请输入比赛名称",
    trigger:"blur"
  }],
  live_url:[{
    required:true,
    message:"请输入直播地址",
    trigger:"blur"
  }],
  start_time:[{
    required:true,
    message:"请选择开始时间",
    trigger:"blur"
  }],
  status:[{
    required:true,
    message:"请选择比赛状态",
    trigger:"blur"
  }],
  end_time:[{
    required:true,
    message:"请选择结束时间",
    trigger:"blur"
  }],
  results:[{
    required:false,
    message:"请输入比赛结果",
    trigger:"blur"
  }],
  min_bet:[{
    required:true,
    message:"请输入最低下注金额",
    trigger:"blur"
  }]
}




</script>

<style scoped>
.bg {
  width: 178px;
  height: 178px;
  display: block;
  line-height: 178px !important;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.vs {
  display: block;
  float: left;
  padding: 0 10px;
  font-weight: bold;
}
</style>
