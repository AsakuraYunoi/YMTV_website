<template>
  <footer class="site-footer">

    <div class="footer-content-wrapper">

      <div class="footer-main-content">

        <div class="info-columns">

          <div class="footer-column">
            <h4>FOLLOW US</h4>
            <a href="https://space.bilibili.com/667815074" target="_blank" rel="noopener noreferrer">Bilibili</a>
          </div>

          <div class="footer-column">
            <h4>SAY HI</h4>
            <a href="mailto:contact@yourschool.com">contact@yourschool.com</a>
          </div>
        </div>

        <div class="cta-column">
          <div class="decorative-dots"></div>
          <h2 class="cta-heading">
            Explore our<br>
            creative spirit.
          </h2>
        </div>
      </div>
    </div>

    <div class="footer-bottom-bar">
      <span>YOUTH MOMENT TV</span>
      <span>Copyright©1998-{{ currentYear }}</span>
    </div>

    <div class="card-area">
        <div class="card-scene" @click="flipCard">
          <div class="card" :class="{ 'is-flipped': isFlipped }">
            <div class="card-face card-face--front">
              <div class="logo-container">
                <img src="/src/images/schoolLogo.png" alt="校徽" class="logo-img school-logo" />
                <span class="logo-x">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <line x1="4" y1="4" x2="18" y2="18" stroke="#d1d1d1" stroke-width="2"/>
                    <line x1="18" y1="4" x2="4" y2="18" stroke="#d1d1d1" stroke-width="2"/>
                  </svg>
                </span>
                <img src="/Logo.svg" alt="台徽" class="logo-img tai-logo" />
              </div>
              
            </div>
            <div class="card-face card-face--back">
              <div class="card-back-content">
                <p class="hitokoto">{{ hitokoto }}</p>
                <p class="info-line">辽ICP备06021230号-2</p>
                <p class="info-line">
                  <a href="https://github.com/AsakuraYunoi/YMTV_website" target="_blank" rel="noopener noreferrer">GitHub Source</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isFlipped = ref(false);
const hitokoto = ref('Loading...');
const currentYear = ref('...');

const flipCard = () => {
  isFlipped.value = !isFlipped.value;
};

onMounted(async () => {
  try {
    const response = await fetch('/api/hitokoto'); // c=i 获取诗歌分类，c=d 获取文学分类
    const data = await response.json();
    hitokoto.value = data.hitokoto;
  } catch (error) {
    console.error('Failed to fetch Hitokoto:', error);
    hitokoto.value = '每一个不曾起舞的日子，都是对生命的辜负。';
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');

/* --- 基础布局 --- */
.site-footer {
  min-height: 80vh;
  position: relative; /* 关键：为内部绝对定位的元素提供参照物 */
  background-color: #f0f0f0;
  color: #1a1a1a;
  font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  overflow: hidden;
  padding-bottom: 120px; /* 关键：为底部黑条留出空间 */
}

.footer-content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 80px 5%;
  position: relative;
}

.footer-main-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* 底部对齐，让艺术字和信息栏对齐 */
  flex-wrap: wrap;
  gap: 40px;
}

.info-columns {
  display: flex;
  gap: 80px; /* 加大栏间距 */
  flex-wrap: wrap;
}

.footer-column h4 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 25px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #888;
}

.footer-column a,
.info-line a {
  position: relative;
  display: inline-block;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 15px;
  transition: color 0.3s cubic-bezier(.77,0,.175,1);
  z-index: 1;
  /* 允许与文字重叠 */
  background: none;
  padding-bottom: 2px;
}

/* 保证 .footer-column 下的 a 标签换行显示 */
.footer-column a {
  position: relative;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 15px;
  transition: color 0.3s cubic-bezier(.77,0,.175,1);
  z-index: 1;
  background: none;
  padding-bottom: 2px;
}

.footer-column a::after,
.info-line a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 1px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #d1d1d1 60%, transparent 100%);
  opacity: 0.7;
  z-index: 0;
  transition: transform 0.4s cubic-bezier(.77,0,.175,1);
  transform: scaleX(1);
  pointer-events: none;
}

.footer-column a:hover,
.info-line a:hover {
  color: #555;
}

.footer-column a:hover::after,
.info-line a:hover::after {
  transform: scaleX(0);
  opacity: 0.3;
}

.info-line a {
  font-size: 13px;
  margin-bottom: 0;
}

/* --- 艺术字与装饰 --- */
.cta-column {
  position: relative;
  text-align: right;
  padding-right: 20px;
}

.cta-heading {
  font-size: 4.5rem; /* 大号字体 */
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
  color: #1a1a1a;
}
/* 艺术字下方的装饰线 */
.cta-heading::after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background-color: #1a1a1a;
  margin-top: 20px;
}

/* 装饰性点阵 */
.decorative-dots {
  position: absolute;
  top: -50px;
  left: -80px;
  width: 120px;
  height: 80px;
  background-image: radial-gradient(#d1d1d1 1px, transparent 1px);
  background-size: 15px 15px;
  opacity: 0.7;
}

/* --- 3D 卡片 - 核心部分 --- */
.card-area {
  position: absolute; /* 绝对定位 */
  bottom: 80px; /* 从 footer 底部开始计算 */
  right: 5%; /* 从 footer 右侧开始计算，与内容区 padding 保持一致 */
  z-index: 10; /* 确保卡片在最上层，能够遮挡底部黑条 */
}

.card-scene {
  width: 550px;
  height: 20vh;
  perspective: 1200px;
  cursor: pointer;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s;
  transform-style: preserve-3d;
  border-radius: 18px; /* 添加圆角 */
  box-shadow: 0 2px 16px 0 rgba(60, 60, 60, 0.10); /* 默认轻微阴影 */
}
.card:hover {
  box-shadow: 0 8px 32px 0 rgba(60, 60, 60, 0.18); /* hover时增强阴影，立体感 */
}

.card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fdfdfd;
  border: 1px solid #e0e0e0;
  border-radius: 18px; /* 卡片正反面都圆角 */
  overflow: hidden;
}
.logo-container { 
    display: flex;
    gap: 15px;
    align-items: center;
}
.logo-img.school-logo {
  height: 35px;
  width: auto;
}
.logo-img.tai-logo {
  height: 70px;
  width: auto;
}
.logo-x {
  display: flex;
  align-items: center;
  margin: 0 10px;
  opacity: 0.7;
}

.card-face--back {
  transform: rotateY(180deg);
  padding: 20px;
}
.card-back-content { text-align: center; }
.hitokoto { font-size: 15px; margin-bottom: 15px !important; }
.info-line { font-size: 13px; color: #555; margin: 6px 0 !important; }
.info-line a { display: inline; font-size: 13px; }

/* --- 底部黑条 --- */
.footer-bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px; /* 固定高度 */
  background-color: #1a1a1a;
  color: #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 1; /* 比卡片低，但比内容高 */
}

/* --- 响应式布局 --- */

@media (max-width: 1027px) {
    .card-area {
      right: 50%; /* 居中 */
      left: auto; /* 取消左侧定位 */
      transform: translateX(50%); /* 居中 */
      bottom: 20px; /* 调整卡片与黑条的距离，或使其重叠 */
    }
}

@media (max-width: 1027px) {
    .site-footer { 
        height: 90vh;
        padding-bottom: 100px; /* 移动端底部黑条变高 */
    }

    .footer-content-wrapper { 
        padding-top: 60px; 
    }

    .footer-main-content {
        flex-direction: column;
        align-items: center; /* 居中对齐 */
        text-align: center; /* 文本居中 */

    }

    .cta-heading { font-size: 3rem; }

    .info-columns { 
        gap: 40px;
    }

    .info-columns a,h4{
        font-size: 14px; /* 调整链接和标题字体大小 */
    }
  
  /* 移动端卡片居中 */
  .card-area {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    bottom: 100px;
    
  }

  .card-scene { 
    width: 80vw;
    height: 180px;
}


  /* 移动端底部黑条 */
  .footer-bottom-bar {
    height: 120px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
}
</style>