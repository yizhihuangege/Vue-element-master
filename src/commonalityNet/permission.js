/**
 * @file 统一处理 行政区域获取的API
 */
import { instance as $http } from '@/plugin/http';
import bus from '@/plugin/box_bus';

let permissionData = []
let permissionKey = []
let menuData = []
let roleList = []
let orgList = []

const getPermissionList=(callback)=>{
    const url = `${process.env.GUESSING_HOST_URL}/credits/admin/system/permissions`;
    return $http.get(url).then(resp=>{
        if(resp.data.success){
            permissionData = resp.data.data || [];
            handlePermissionData(permissionData);
            if(callback){
                callback(menuData)
            }
        }else {
            bus.$emit('message',{method:'error',info:'获取权限列表失败'});
            return {is_success:false,data:[]}
        }
    })
}


const handlePermissionData =(data) => {
    let arr = []
    let menu = []
    data.forEach(item => {
        if(item.hasOwnProperty('children')){
            item.children.forEach(child => {
                menu.push(child.name)
                if(child.hasOwnProperty('children')){
                    child.children.forEach(node => {
                        arr.push(node.id)
                    })
                }
            })
        }
    })
    menuData = menu;
    permissionKey = arr;
}

const getRoleList= () => {
    const url = `${process.env.GUESSING_HOST_URL}/credits/admin/system/roles`;
    return $http.get(url).then(resp=>{
        if(resp.data.success){
            let data = resp.data.data.data || [];
            if(data.length>0){
                let arr = []
                data.forEach(item => {
                    let role = {}
                    role.key = item.id
                    role.label = item.name
                    arr.push(role)
                })
                roleList = arr
            }
        }
    })
}

const getOrgList = () => {
    const url = `${process.env.GUESSING_HOST_URL}/credits/admin/system/admin/organizations`;
    return $http.get(url).then(resp => {
        if(resp.data.success){
            orgList = resp.data.data || []
        }
    })
}



export { getPermissionList,permissionData,permissionKey,menuData,roleList,getRoleList,getOrgList,orgList};