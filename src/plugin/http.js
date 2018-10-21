import axios from 'axios';
import bus from '../plugin/box_bus';

import { TEST_URL, OFFICIAL_URL } from '../config/baseURL.js';

const BASE_URL = location.href.includes('10.8.') ? TEST_URL : OFFICIAL_URL;


// login成功后会手动设置一次token
let instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        Authorization: localStorage.getItem('token')
    }
});

/**
 * 拦截器
 */
instance.interceptors.response.use(function (response) {
    // Authorization若存在，那么就表示要更新token
    if (response.headers.authorization && typeof response.data != 'string') {
        localStorage.setItem('token', response.headers.authorization);
        bus.$emit('updateToken');
        return response;
    } else if (typeof response.data == 'string' && response.data.includes('Unauthorized')) {
        bus.$emit('gotoLogin')
        return Promise.reject(response)
    }

    return response;

}, function (error) {
    if(error.response.status === 403){
        bus.$emit('noticePermission',error.response)
    }else if (error.response.headers.authorization && error.response.status !== 401) {
        localStorage.setItem('token', response.headers.authorization);
        bus.$emit('updateToken');
    } else if (error.response.status === 401) {
        bus.$emit('gotoLogin')
    }
    return Promise.reject(error);
})


function install(Vue, Option) {
    Vue.prototype.$http = instance;
}

export { install, instance };
