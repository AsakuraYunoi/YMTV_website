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
      </a>
      <div
        v-else
        class="social-media-btn"
      >
        <img :src="item.icon" :alt="item.name" class="social-icon" />
        <div v-if="item.QRcode" class="qr-hover">
          <img :src="item.QRcode" alt="二维码" class="qr-img" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.social-media-list {
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1.5rem 0;
  background: none;
}

.social-media-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
  border-radius: 1.5rem;
  box-shadow: none;
  width: 54px;
  height: 54px;
  transition: 
    width 0.3s cubic-bezier(.4,2,.6,1), 
    height 0.3s cubic-bezier(.4,2,.6,1),
    box-shadow 0.3s, 
    background 0.3s;
  position: relative;
  cursor: pointer;
  user-select: none;
  overflow: visible;
}

.social-media-btn:hover {
  width: 140px;
  height: 90px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  z-index: 2;
}

.social-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.08));
  transition: width 0.3s, height 0.3s;
}

.qr-hover {
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  padding: 0.5rem 0.7rem 0.4rem 0.7rem;
  z-index: 10;
  text-align: center;
  min-width: 70px;
  animation: fadeIn 0.3s;
}

.social-media-btn:hover .qr-hover {
  display: block;
}

.qr-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin: 0 auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -40%);}
  to { opacity: 1; transform: translate(-50%, -50%);}
}

/* 响应式适配 */
@media (max-width: 600px) {
  .social-media-list {
    gap: 0.7rem;
    padding: 1rem 0;
  }
  .social-media-btn {
    width: 40px;
    height: 40px;
  }
  .social-media-btn:hover {
    width: 100px;
    height: 60px;
  }
  .social-icon {
    width: 20px;
    height: 20px;
  }
  .qr-img {
    width: 36px;
    height: 36px;
  }
}
</style>