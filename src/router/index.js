/**
 * @file  路由的入口文件，几个分路由分发在各个文件中
 * @author wangshuai
 */
import Vue from 'vue'
import Router from 'vue-router'
import { loginRoutes } from './allRoutes';

import { setAuth } from '../util/setAuth.js'

Vue.use(Router)

let routes = [ ...loginRoutes ]
const router = new Router({
  routes: setAuth(routes)
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || '';

  if (to.meta.requiresAuth && token !== '') {
      next();
  } else if (to.meta.requiresAuth && token == '') {
      next({ path: '/login' })
  } else if (!to.meta.requiresAuth) {
      next();
  }

})

export default router
