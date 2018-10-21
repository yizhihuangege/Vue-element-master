function install(Vue,Option){
    Vue.prototype.$bus = new Vue();
}

export default install