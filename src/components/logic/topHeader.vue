<template>
    <section class="container">
        <section></section>
        <section>
            <h1>{{title}}</h1>
            <h3>{{titleEnglish}}</h3>
        </section>
        <section class="user-container">
            <el-button type="text" style="color:#000;cursor:default;" class="x-area">当前登录用户名:{{username}}</el-button>
            <el-dropdown>
                <el-button icon="el-icon-more" circle>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <!-- <el-dropdown-item @click.native="modifyPwd">修改密码</el-dropdown-item> -->
                    <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </section>
    </section>
</template>

<script>
export default {
  name: "main-top",
  data() {
    return {
      title: "",
      titleEnglish: "",
      username:''
    };
  },
  created() {
    const mgrChannel = localStorage.getItem("userName") || "abo";
    this.username = mgrChannel
    this.title = "欢迎使用龙猫管理后台";
      this.titleEnglish = "welcome to totoro mgr";
  },
  methods: {
    modifyPwd() {
      this.$router.push({
        path: "/modify-pwd"
      });
    },
    logout() {
      this.$http
        .post(process.env.GUESSING_HOST_URL + "/api/admin/logout")
        .then(resp => {
           this.$message.success("退出成功");
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            this.$router.replace({ path: "/login" });
        })
        .catch(resp => {});
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  color: #fff;
  position: relative;
}

.container h1 {
  font-size: 24px;
  font-weight: 600;
  text-shadow: 1px 1px 4px #1e379030;
}

.container h3 {
  font-size: 16px;
  font-weight: 200;
  text-shadow: 1px 1px 4px #1e379082;
}

.user-container {
  position: absolute;
  right: 0px;
}
</style>