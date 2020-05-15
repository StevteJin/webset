// http配置
import axios from 'axios';
import router from './router';

// axios 配置
// 设置请求超时时间，现在，在超时前，所有请求都会等待 2.5 秒
axios.defaults.timeout = 5000;
console.log(window.location.host);
let a=window.location.host;
// 设置接口的域名
if(a!='localhost:8080'){
  axios.defaults.baseURL = 'http://'+a;
}else{
  axios.defaults.baseURL = 'http://139.129.39.75';
}
// axios.defaults.baseURL = 'http://139.129.39.75';

axios.defaults.withCredentials = false;// 让ajax携带cookie

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 如果存在token,请求头里面设置
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = token;
    // }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// 添加请求拦截器
axios.interceptors.response.use(
  response => {
    // console.log(JSON.stringify(response))
    if (response) {
      switch (response.data.code) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          // router.replace({
          //   path: '/login',
          //   query: { redirect: router.currentRoute.fullPath }
          // });
          break;
      }
    }
    return response;
  },
  error => {
    return Promise.reject(error.response.data);
  });
export default axios;
