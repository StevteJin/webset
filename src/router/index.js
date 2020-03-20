import Vue from 'vue';
import Router from 'vue-router';

import index from '@/pages/index/index';
import h5 from '@/pages/h5/h5';
import draw from '@/pages/draw/draw';
import h5draw from '@/pages/h5draw/h5draw';

Vue.use(Router);

const routes = [{
  path: '/pc',
  meta: {
    title: 'PC版'
  },
  component: index
}, {
  path: '/h5',
  meta: {
    title: 'h5版'
  },
  component: h5
}, {
  path: '/draw',
  meta: {
    title: '图表'
  },
  component: draw
}, {
  path: '/h5draw',
  meta: {
    title: '图表'
  },
  component: h5draw
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
