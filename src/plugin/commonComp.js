import photoWatcher from '../components/photoWatcher';
import autoBreadCrumb from '../components/autoBreadCrumb';


function install(Vue,Option){
    const componentList = [
        photoWatcher,
        autoBreadCrumb
    ];
    componentList.map(component=>{
        Vue.component(component.name,component)
    });
}

export default install;