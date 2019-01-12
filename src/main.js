import Vue from 'vue'
import App from './App'
import router from './router'

import usePlugin from './plugin/index.js';

import "./assets/js/passiveSupported"     // Chrome让页面滑动更加流畅的新特性
import './assets/style/public.css'

Vue.config.productionTip = false;

usePlugin()

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
