<template>
  <section class="login-container">
    <h1 class="login-header">
      龙猫管理后台
      <h3>totoro mgr console</h3>
    </h1>
    <section class="login-window">
      <el-card class="box-card">
        <template >
          <el-form ref="form" :model="form" :rules="rules" class="login-content">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="form.password" type="password" @keyup.enter.native="submit('form')"></el-input>
            </el-form-item>
            <section class="login-btn-container ">
              <el-button type="primary" @click="submit('form')">登陆</el-button>
            </section>
          </el-form>
        </template>
        <template v-if="token=='123456'">
          <section class="logined-info">
            <header>{{userName}},您于{{loginTime}}已登陆，进直接进入后台</header>
            <main>
              <el-button @click="enter">进入后台</el-button>
            </main>
          </section>
        </template>


      </el-card>
    </section>
  </section>
</template>

<script>
import { setRoutes } from "../../util/setRoutes";
import { formatDateAndTime } from "@/util/time.js";
import bus from "@/plugin/box_bus.js";

export default {
  name: "login",
  created() {
    document.title = "龙猫管理后台";
    this.setLoginTime();
  },
  data() {
    return {
      isLoad: false,
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("userName"),
      loginTime: "",
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    setLoginTime() {
      let loginTime = parseFloat(localStorage.getItem("loginTime"));
      this.loginTime = formatDateAndTime(loginTime) || "";
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            username: this.form.username,
            password: this.form.password
          };

          bus.$emit("loadingAnime");
          bus.$emit("updateLoadingText", "正在验证登陆信息");
          this.$http.post(process.env.GUESSING_HOST_URL + "/api/admin/login", params)
            .then(resp => {
              if (resp.data.success) {
                const data = resp.data.data;
                this.$message.success("登陆成功");
                
                bus.$emit("updateLoadingText", "正在载入页面");
                this.loginSuccess(data.id, data.Authorization);
              } else {
                this.$message.error(resp.data.errors);
                bus.$emit("unLoadAnime");
              }
            }).catch(resp => {
              this.$message.error("登陆失败!");
              setTimeout(() => {
                bus.$emit("unLoadAnime");
              }, 1500);
            });
        } else {
          this.$message.error("用户名或密码格式不正确");
        }
      });
    },
    loginSuccess(userid = -1,token = '') {
      localStorage.setItem("token", token);
      localStorage.setItem("userid", userid);
      localStorage.setItem("userName", this.form.username);
      localStorage.setItem("loginTime", Date.now());
      let path = setRoutes();
      localStorage.setItem("enterRoute",path);
      this.$http.defaults.headers["Authorization"] = token;
      location = window.location.href.replace("/login", path);
      this.$router.replace(path);
    },
    enter() {
      let path = localStorage.getItem("enterRoute",path);
      this.$router.push({path:'/loading'});
      location.reload();
    }
  }
};
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(18deg, lightgreen, #24489a);
}

.login-header {
  text-align: center;
  font-size: 30px;
  font-weight: 300;
  color: #fff;
  text-shadow: 1px 1px 10px #6f6b6b;
  margin-bottom: 1em;
}

.login-header h3 {
  font-size: 24px;
  font-weight: 200;
}


.login-btn-container {
  padding: 15px 0px;
  text-align: right;
  position: absolute;
  right: 20px;
  bottom: 10px;
}

.box-card {
  width: 600px;
  height: 310px;
  position: relative;
}

.logined-info {
  height: 270px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.logined-info header {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
