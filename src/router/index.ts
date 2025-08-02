import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '../views/About.vue';
import Activities from '../views/Activities.vue';
import Recruitment from '../views/Recruitment.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/recruitment',
      name: 'recruitment',
      component: Recruitment,
    },
    {
      path: '/activities',
      name: 'activities',
      component: Activities,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: { title: '404 Not Found' }
    }
  ],

  // 设置路由的滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果有保存的滚动位置，则返回该位置
      return savedPosition;
    } else {
      // 否则，滚动到页面顶部
      return { top: 0 };
    }
  },
})

export default router
