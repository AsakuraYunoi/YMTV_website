<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div id="smooth-wrapper"><!-- GSAP 平滑滚动 -->
      <NavBar /><!-- 全局导航栏 -->
    <div id="smooth-content">
    <div vaul-drawer-wrapper id="app"><!-- shadcn 弹窗缩背景 -->
      <RouterView /> <!-- 使用RouterView来渲染路由组件 -->
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