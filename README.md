# small_sheep_credit_mgr

> A Vue.js project

## 项目大结构

###  util

### plugin
对Vue对象的扩展，其中box_bus.js只用于偶尔通信，目前只有http.js的拦截器通信element弹出窗口。实际上通信可以自己写一个简易通信机。优点（不用实例化一个新Vue，省内存）

### router
router按大菜单进行了分类， index.js聚合了各个routes，其中mainRoutes.js应该放在routes列表最后（因为最后有一个/*对应404）

index.js 中设置了全局路由，用于设置权限管理

### config
menuConfig.js 用于配置项目的菜单结构。这个配置一用于menu.vue左侧菜单，二用于自动面包屑生成面包头和标题。

### components
分为`base`和`logic`,`base`是较通用的组件，业务关联性不强，如图片查看器，一般我们认为可以几乎不做更改就把base中的组件拿到别的项目中用。logic中的组件业务关联性更强一点，有些可能会改很多地方，或者不具备迁移到别的项目的通用性。


## TODO
1. 优化menu.vue和自动面包屑的逻辑，使之可以可以适应无穷层级的嵌套
4. 封装一个download组件
5. table-page
6. 把menuConfig和routes结合
7. 封装图片上传组件，做大小检查，做裁切功能
8. 把组件改成按需引用的形式，减少数据请求（可中后期再做这个事情，当组件数量变得异常庞大时，做这个事情才比较有意义）
9. 地区可以一次性拉取，建议设置store.js，将地区列表注入，以免多次拉取(地区列表是更新很缓慢的东西，不必每次查)
10. get_all_map 放到登陆成功后请求
11. 尝试解决地区组件可能引起内存泄漏的问题
12. scripts增加一个 run build --lex 用来更换成lex版的API