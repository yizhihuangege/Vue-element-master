/**
 * @file  路由的入口文件，几个分路由分发在各个文件中
 * @author henk<speoth@163.com>
 */
import Vue from 'vue'
import Router from 'vue-router'
import mainRoutes from './mainRoutes.js';


import {setAuth} from '../util/setAuth.js'
import echarts from "echarts";
Vue.use(Router)



let routes = [
  ...mainRoutes,
]




const router = new Router({
  routes: setAuth(routes)
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || '';

  if (to.meta.requiresAuth == true && token !== '') {
      next();
  } else if (to.meta.requiresAuth == true && token == '') {
      next({ path: '/login' })
  } else if (to.meta.requiresAuth == false) {
      next();
  }

})




export default router
