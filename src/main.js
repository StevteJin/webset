// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
// 引入jquery
import 'jquery';
import Vuetify from 'vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'; // Ensure you are using css-loader
import 'babel-polyfill';// IE垫片

import 'lib-flexible/flexible';
// 引入axios
import axios from './http';

Vue.prototype.axios = axios;
//eharts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(Vuetify);
Vue.use(ElementUI);
Vue.config.productionTip = false;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
