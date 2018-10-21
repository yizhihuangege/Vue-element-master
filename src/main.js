import Vue from 'vue'
import App from './App'
import router from './router'

import usePlugin from './plugin/index.js';

import './style/reset.css';
import './style/layout.css';


Vue.config.productionTip = false

usePlugin();

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
