<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <NavBar />
      <RouterView /> <!-- 使用RouterView来渲染路由组件 -->
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
}


</style>