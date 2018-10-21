import photoWatcher from '../components/base/photoWatcher.vue';
import autoBreadCrumb from '../components/logic/autoBreadCrumb.vue';
import areaSelector from '../components/logic/areaSelector.vue';

function install(Vue,Option){
    const compList = [
        photoWatcher,
        autoBreadCrumb,
        areaSelector
    ]
    compList.forEach(com=>{
        Vue.component(com.name,com)
    })
}

export default install