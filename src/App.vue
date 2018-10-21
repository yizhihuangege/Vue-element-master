<template>
  <div id="app"
    v-loading="isLoad"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-header v-if="!$route.path.includes('login')" height="100px" class="top-header">
      <top-header></top-header>
    </el-header>

    <el-container class="top-main">
      <el-aside style="width:210px" v-if="!$route.path.includes('login')">
        <sheep-menu></sheep-menu>
      </el-aside>
      <el-main>
        <section>
          <router-view/>
        </section>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import topHeader from './components/logic/topHeader.vue';
  import menu from './components/logic/menu.vue';

  import bus from './plugin/box_bus.js';
  import {setRoutes} from "./util/setRoutes";

  import {areaData,areaAPI} from './commonalityNet/area.js';

  // import mixin from './components/mixin/mixin'
  export default {
    name: 'App',
    // mixins: [mixin],
    components: {
      topHeader,
      'sheep-menu': menu
    },
    data(){
      return {
        isLoad:false,
        loadingText:'拼命加载中'
      }
    },
    mounted() {
      if(this.$route.path!=="/login"){
        let path = setRoutes();

        this.$router.replace({
          path: path
        })
      }

      bus.$on('updateToken', this.updateToken)
      bus.$on('gotoLogin', this.gotoLogin);
      bus.$on('noticePermission', this.noticePermission);
      bus.$on('loadingAnime',this.loadingAnime);
      bus.$on('unLoadAnime',this.unloadAnime);
      bus.$on('updateLoadingText',this.updateLoadingText);
      bus.$on('message',this.showMessage)
    },
    methods: {
      // getAllMap(){
      //   areaAPI.getAllMap()
      // },
      loadingAnime(){
        this.isLoad = true;
      },
      updateLoadingText(text){
        this.loadingText = text || '拼命加载中';
      },
      unloadAnime(){
        this.isLoad = false;
      },
      updateToken() {
        const token = localStorage.getItem('token');
        this.$http.defaults.headers['Authorization'] = token;
      },
      showMessage(context){
        let methodName = context.method || 'info';
        this.$message[methodName](context.info)
      },
      gotoLogin() {
        localStorage.removeItem('token');
        this.$message({
          message: '登陆已失效，请重新登录',
          customClass: 'priority'
        })
        this.$router.replace({
          path: '/login'
        })
      },
       noticePermission(data){
         if(data.data.msg){
           this.$message({
             message: data.data.msg,
             customClass: 'priority'
           })
         }else{
           this.$message({
             message: '没有该页面或功能的访问权限',
             customClass: 'priority'
           })
         }

      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height:100vh;
  }

  .top-header {
    background: linear-gradient(13deg, rgb(102,158,183), lightblue);
    box-shadow: 0px 3px 25px rgb(102,158,183);
    z-index: 1;
    position: relative;
  }

  .top-main {
    height: calc(100vh - 100px);
    padding-top: 20px;
    box-sizing: border-box;
  }
</style>
