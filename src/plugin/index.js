import Vue from 'vue';

import Bus from './bus.js';
import {install as Http} from './http.js';
import commonComp from './commonComp.js';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
const use = () => {
    Vue.use(Bus);
    Vue.use(Http);
    Vue.use(commonComp);
    Vue.use(ElementUI);
}

export default use;
