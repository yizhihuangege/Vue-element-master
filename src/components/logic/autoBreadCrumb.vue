<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item,index) of path" :key="index">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import menuConfig from '../../config/menuConfig.js';

  export default {
    name: 'auto-bread-crumb',
    props: {
      needSetTitle: {
        type: Boolean,
        default: true
      },
      forcePath: {
        type: Array,
        default: function () {
          return ['', '']
        }
      }
    },
    data() {
      return {
        menu: {},
        path: ['', '']
      }
    },
    created() {
      let user = localStorage.getItem("userName");
      this.menu = menuConfig.menu;
      this.setPath();
      this.setForcePath();

    },
    methods: {
      setPath() {
        const path = this.$route.path;
        let targetRoute = {};
        this.menu.forEach(element => {
          targetRoute = {}
          element.groups.forEach((group) => {
            targetRoute = group.list.find(route => {
              return route.path === path;
            }) || targetRoute;
          })
          if (targetRoute.title && targetRoute.title != '') {
            // 处理一级path
            if (element.title && element.title != '') {
              this.path[0] = element.title
            }
            // 处理二级path
            this.path[1] = targetRoute.title;
            this.needSetTitle && this.setTitle(targetRoute.title);
          }
        });

        this.path.splice(0, 0);
      },
      setForcePath() {
        if (this.forcePath[0] == '' && this.forcePath[1] == '') {
          return
        }
        this.path = this.forcePath;
        this.path.splice(0, 0);
      },
      setTitle(title = '') {
        if (title != '') {
          document.title = `龙猫后台 | ${title}`
        }
      }
    }
  }
</script>
