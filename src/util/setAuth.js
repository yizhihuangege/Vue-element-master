/**
 * 路由可以不设置meta，这个方法会给所有路由都加上meta,并且默认meta.requireAuth为true(需要登陆后才展示)
 * 但如果路由本身设置了meta.requireAuth，本方法不会覆盖它们
 * @param {Array} routes
 * @param {Boolean} defaultRequireAuth
 */
const setAuth = (routes, defaultRequireAuth = true) => {
  
  routes = routes.map(route => {
    if (!route.meta) {
      route.meta = Object.assign({}, { requiresAuth: defaultRequireAuth })
    } else {
      const shadow_meta = JSON.parse(JSON.stringify(route.meta))
      route.meta = Object.assign(route.meta, { requiresAuth: defaultRequireAuth }, shadow_meta)// 如果meta.requiresAuth不存在则覆盖创建，存在则不覆盖
    }

    return route;
  })

  return routes
}
export {setAuth};
