<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VideoCarousel from '@/components/VideoCarousel.vue';
import SocialMedia from '@/components/SocialMedia.vue';
import ActivityPublicList from '@/components/ActivityPublicList.vue';
import Shop from '@/components/Shop.vue';

import '@/assets/dark/HomeViewDark.css';

const videoSrc = ref('');
const logoSrc = ref('');

const currentYear = ref('...');

onMounted(async () => {
  try {
    const response = await fetch('/config/config.json');
    const config = await response.json();
    if (config.HomeView && config.HomeView.length > 0) {
      videoSrc.value = config.HomeView[0].videoSrc;
      logoSrc.value = config.HomeView[0].logoSrc;
    }
  } catch (error) {
    console.error('Failed to load Config', error);
  }

  // 获取年份
  try {
    const res = await fetch('/api/year');
    const data = await res.json();
    currentYear.value = data.year;
  } catch (error) {
    currentYear.value = new Date().getFullYear().toString();
  }

});
</script>


<template>


  <!-- 滚动屏 -->
  <div class="scroll-container">
    
    <!-- 1.封面页 -->
    <div class="splash-container" id="splash">
      <video
        :src="videoSrc"
        type="video/webm"
        autoplay
        muted
        loop
        class="background-video"
      >
      </video>

      <div class="content">
        <div class="logo-container">
          <img :src="logoSrc" alt="Logo" class="logo" />
        </div>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="delimiter">
      <span class="delimiter_left">· YOUTH_MOMENT_TV</span>
      <span class="delimiter_middle">INFINITE PROGRESS</span>
      <span class="delimiter_right">{{ currentYear }}·</span>
    </div>

    <!-- 2.视频轮播组件 -->
    <div class="page2" id="video-carousel" style="padding-bottom: 0rem; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div class="page2_title" style="padding-bottom: 4rem; text-align: center;">
        <h2 style="font-size: 1.5rem; color: #aaa; margin-top: 0.5rem;">RECOMMEND</h2>
        <h1 style="font-size: 2.5rem; color: #333; font-weight: bolder; letter-spacing: 0.2rem;">{{ currentYear }}年度巨献</h1>
      </div>
      
      <div class="video-carousel"><VideoCarousel /></div>

    </div>

    <!-- 3.社交媒体链接 -->
    <div class="SocialMedia" id="social-media" style="height: 20vh;">
      <SocialMedia />
    </div>

    <!-- 4.活动列表 -->
    <div class="activity-section" id="activity-list">
      <div class="blockContent-header">
        <div class="blockContent-title">
          <h3>MATERIAL</h3>
          <h2>活动公式</h2>
        </div>
        <button class="blockContent-all-btn" @click="$router.push('/activities')">
          查看全部
          <span class="plus-icon">+</span>
        </button>
      </div>

      <div class="activity-list-scroll">
        <ActivityPublicList />
      </div>
    </div>

    <!-- 5.商店 -->
    <div class="shop-section" id="shop">
      <div class="blockContent-header">
        <div class="blockContent-title">
          <h3>SHOP</h3>
          <h2>周边商店</h2>
        </div>
        <button class="blockContent-all-btn" @click="$router.push('/shop')">
          查看全部
          <span class="plus-icon">+</span>
        </button>
      </div>
      <Shop />
    </div>

    
  </div>



</template>

<style scoped>
/* --滚动容器样式-- */

.scroll-container {
  overflow-y: auto; /* 允许垂直滚动 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.scroll-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}


/* --闪屏页容器样式-- */
.splash-container {
  position: relative; /* 相对定位 */
  width: 100%;
  height: 100vh; /* 初始高度占据整个屏幕 */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 背景视频样式 */
.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translateX(-50%) translateY(-50%);
  z-index: 0;
  object-fit: cover;
}
/* 内容容器样式 */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  max-width: 90vw;
  max-height: 90vh;
  opacity: 0;
  animation: fadeIn 1s ease-in forwards;
  animation-delay: 0.2s;
}
/* Logo容器样式 */
.logo-container {

}
/* Logo图片样式 */
.logo {
  max-width: 300px;
  max-height: 200px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}


/* --视频轮播图样式-- */
.video-carousel {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* --分隔线样式-- */
.delimiter {
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  position: relative;
}
.delimiter_left{
  margin-left: 2rem;
  justify-self: flex-start;
}
.delimiter_middle{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  letter-spacing: 0.1rem; /* 增加字母间距 */
}
.delimiter_right {
  margin-right: 2rem;
  justify-self: flex-end;
  letter-spacing: 0.2rem; /* 增加字母间距 */
}

/* --活动列表样式-- */
.activity-section {
  padding: 2rem 0 0 0;
  margin-bottom: 4rem;
}
.activity-list-scroll {
  
  overflow-y: auto;
}

/* --商店样式-- */
.shop-section {
  padding: 2rem 0 0 0;
}

/* --块级标题样式-- */
.blockContent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  margin-left: 2rem;
  margin-right: 2rem;
}
.blockContent-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.blockContent-title h2 {
  font-size: 2rem;
  color: #333;
  font-weight: bold;
  margin: 0;
}
.blockContent-title h3 {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}
.blockContent-all-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #000000; 
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.plus-icon {
  margin-left: 0.5rem; 
  font-size: 1.2rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

.blockContent-all-btn:hover .plus-icon {
  transform: rotate(90deg); /* 顺时针旋转90度 */
}

/* 动画关键帧 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 媒体查询 响应式布局 */
@media (max-width: 768px) {
  .delimiter_left,
  .delimiter_right {
    display: none; /* 隐藏左右分隔线 */
  }}
</style>