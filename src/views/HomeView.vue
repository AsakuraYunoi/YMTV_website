<script setup lang="ts">
import { ref, onMounted } from 'vue';
import VideoCarousel from '@/components/VideoCarousel.vue';
import SocialMedia from '@/components/SocialMedia.vue';
import ActivityPublicList from '@/components/ActivityPublicList.vue';
import Shop from '@/components/Shop.vue';

const videoSrc = ref('');
const logoSrc = ref('');


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
});
</script>


<template>


  <!-- 滚动屏 -->
  <div class="scroll-container">
    
    <!-- 1.封面页 -->
    <div class="splash-container" id="splash">
      <video
        :src="videoSrc"
        type="video/mp4"
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
      <span class="delimiter_right">2 0 2 5 ·</span>
    </div>

    <!-- 2.视频轮播组件 -->
    <div class="page2" id="video-carousel" style="padding-bottom: 0rem; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div class="page2_title" style="padding-bottom: 4rem">
        <h1>RECOMMEND</h1>
        <h2>2025年度巨献</h2>
      </div>

      <div class="video-carousel"><VideoCarousel /></div>

    </div>

    <!-- 3.社交媒体链接 -->
    <div class="SocialMedia" id="social-media" style="height: 20vh;">
      <SocialMedia />
    </div>

    <!-- 4.活动列表 -->
    <div class="activity-section" id="activity-list">
      <div class="activity-header">
        <h2 class="activity-title">活动公式</h2>
        <button class="activity-all-btn" @click="">查看全部</button>
      </div>
      <div class="ActivityPublicList activity-list-scroll">
        <ActivityPublicList />
      </div>
    </div>

    <!-- 5.商店 -->
    <div class="shop-section" id="shop" style="padding: 2rem;">
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
}
.delimiter_right {
  margin-right: 2rem;
  justify-self: flex-end;
}


/* --活动列表样式-- */
.activity-section {
  padding: 2rem 0;

}
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.activity-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.activity-all-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
.activity-list-scroll {
  max-height: 400px;
  overflow-y: auto;
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

</style>