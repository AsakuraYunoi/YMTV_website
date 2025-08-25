<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// 导入我们创建的共享状态
import { smoother } from './plugins/gsap-smoother.ts';

import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue';

onMounted(() => {
  // 注册 GSAP 插件
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // 创建 ScrollSmoother 实例
  const smootherInstance = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.5, // 你可以根据需要调整平滑度
    effects: true, // 如果你需要视差等效果
  });

  // 将创建的实例赋值给共享状态
  smoother.value = smootherInstance;
});

onUnmounted(() => {
  // 在组件卸载时，清理 GSAP 实例，防止内存泄漏
  if (smoother.value) {
    smoother.value.kill();
    smoother.value = null;
  }
});
</script>

<template>
  <div id="smooth-wrapper"><!-- GSAP 平滑滚动 -->
      <NavBar /><!-- 全局导航栏 -->
    <div id="smooth-content">
    <div vaul-drawer-wrapper id="app"><!-- shadcn 弹窗缩背景 -->
      <RouterView /> <!-- 使用RouterView来渲染路由组件 -->
      <Footer /> <!-- 全局页脚 -->
    </div>
    </div>
      
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3d41;
  margin-top: 0; /* 移除margin-top */
  background-color: #fff;
}

@media (prefers-color-scheme: dark) {
  #app {
    background-color: #18181b; /* 因为shadcn-vue的抽屉组件默认的缩小背景样式是调用vue的黑暗模式添加的遮罩，不得以才出此下策，这使得vue自带的黑暗模式失去了用武之地 */
  }
}

/* 移除滚动条 */
html, body {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}
</style>