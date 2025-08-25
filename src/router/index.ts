// router/index.js

import { createRouter, createWebHistory } from 'vue-router'
// ... 导入你的组件
import HomeView from '../views/HomeView.vue'
import About from '../views/About.vue';
import Activities from '../views/Activities.vue';
import Recruitment from '../views/Recruitment.vue';

// 导入共享的 smoother 实例
import { smoother } from '../plugins/gsap-smoother.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ... 你的路由定义保持不变
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
    // 返回一个 Promise 来处理异步滚动
    return new Promise((resolve) => {
      // 优先使用保存的滚动位置
      const position = savedPosition || { top: 0 };

      // 如果共享的 smoother 实例已经存在
      if (smoother.value) {
        // 使用 GSAP 的 scrollTo 方法进行平滑滚动
        smoother.value.scrollTo(position.top, true); // 第二个参数 true 代表立即平滑滚动
        
        // 等待一小段时间让滚动动画开始，然后解决 Promise
        // 注意：这是一个简单的延迟，对于复杂的场景可能需要更精确的控制
        // GSAP 的 scrollTo 没有直接的 onComplete 回调，但我们可以监听 ScrollTrigger 的 "scrollEnd" 事件
        // 不过，一个简单的 setTimeout 对于路由切换来说通常足够了。
        setTimeout(() => {
            resolve(position);
        }, 300); // 延迟时间可以根据你的滚动动画时长调整

      } else {
        // 如果 smoother 实例还未创建（例如，页面首次硬刷新时），
        // 则回退到 Vue Router 的默认行为。
        resolve(position);
      }
    });
  },
})

export default router;