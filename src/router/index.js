import Vue from 'vue';
import Router from 'vue-router';

import index from '@/pages/index/index';
import h5 from '@/pages/h5/h5';

Vue.use(Router);

const routes = [{
  path: '/pc',
  meta: {
    title: 'PC版'
  },
  component: index
},{
  path: '/h5',
  meta: {
    title: 'h5版'
  },
  component: h5
}];

const router = new Router({
  routes
});

export default router;

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  window.scrollTo(0, 0);

  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  // if (token) {
  //   if (to.path === '/login' || to.path === '/signup') {
  //     window.document.title = '首页';
  //     next({ path: '/' });
  //   } else {
  //     next();
  //   };
  // } else {
  //   next();
  // }
  next();
});
