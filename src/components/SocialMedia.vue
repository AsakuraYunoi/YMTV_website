<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

interface SocialMediaItem {
  name: string;
  url: string;
  icon: string;
  QRcode?: string;
}

const socialMedias = ref<SocialMediaItem[]>([]);

onMounted(async () => {
  try {
    const response = await fetch('/config/config.json');
    const config = await response.json();
    if (config.SocialMedia) {
      socialMedias.value = config.SocialMedia;
    }
    // GSAP 动画
    gsap.from('.social-media-btn', {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out'
    });
  } catch (error) {
    console.error('Failed to load SocialMedia config', error);
  }
});
</script>

<template>
  <div class="social-media-container">
    <h2 class="social-title">关注我们</h2>
    <div class="social-media-list">
      <template v-for="(item, idx) in socialMedias" :key="item.name">
        <a
          v-if="item.url"
          class="social-media-btn"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="item.icon" :alt="item.name" class="social-icon" />
          <span class="social-name">{{ item.name }}</span>
        </a>
        <div
          v-else
          class="social-media-btn"
          style="cursor: pointer; position: relative;"
        >
          <img :src="item.icon" :alt="item.name" class="social-icon" />
          <span class="social-name">{{ item.name }}</span>
          <div v-if="item.QRcode" class="qr-hover">
            <img :src="item.QRcode" alt="二维码" class="qr-img" />
            <span class="qr-tip">扫码关注</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.social-media-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0 4rem 0;
  background: rgba(255,255,255,0.85);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  margin: 0 auto;
  max-width: 700px;
}

.social-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #222;
  margin-bottom: 2rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.social-media-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: center;
  align-items: center;
}

.social-media-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  padding: 1.2rem 2.2rem;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  min-width: 110px;
  min-height: 120px;
  cursor: pointer;
  user-select: none;
}
.social-media-btn:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  z-index: 2;
}

.social-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.08));
}

.social-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.05em;
}

.qr-hover {
  display: none;
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  padding: 1rem 1.2rem 0.7rem 1.2rem;
  z-index: 10;
  text-align: center;
  min-width: 120px;
}
.social-media-btn:hover .qr-hover {
  display: block;
  animation: fadeIn 0.3s;
}
.qr-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}
.qr-tip {
  font-size: 0.95rem;
  color: #666;
  letter-spacing: 0.03em;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>