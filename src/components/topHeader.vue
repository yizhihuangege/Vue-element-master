<template>
    <section class="container">
        <section></section>
        <section>
            <h1>欢迎使用龙猫管理后台</h1>
            <h3>welcome to totoro mgr</h3>
        </section>
        <section class="user-container">
            <el-button type="text" style="color:#000;cursor:default;" class="x-area">当前登录用户名:{{username}}</el-button>
            <el-dropdown>
                <el-button icon="el-icon-more" circle></el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </section>
    </section>
</template>

<script>
export default {
  name: "top-header",
  data() {
    return {
      username:""
    }
  },
  created() {
    this.username = localStorage.getItem("userName")
  },
  methods: {
    logout() {
      this.$http.post(process.env.GUESSING_HOST_URL + "/api/admin/logout").then(resp => {
        this.$message.success("退出成功");
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        this.$router.replace({ path: "/login" });
      })
    }
  }
}
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