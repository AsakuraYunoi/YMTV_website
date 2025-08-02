<script setup>
import { ref, onMounted } from 'vue';

const shopItems = ref([]);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await fetch('config/shop.json');
    if (!response.ok) {
      throw new Error(`网络请求失败: ${response.statusText}`);
    }
    const data = await response.json();
    shopItems.value = data.ShopItems;
  } catch (e) {
    error.value = `无法加载商品信息: ${e.message}`;
    console.error(e);
  }
});
</script>

<template>
  <div class="shop-wrapper">
    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-else-if="shopItems.length" class="shop-container">
      <div
        v-for="item in shopItems"
        :key="item.id"
        :class="['shop-item', `item-${item.id}`]"
      >
        <a :href="item.link" target="_blank" rel="noopener noreferrer" class="item-link-wrapper">
          <div class="image-container" :style="{ backgroundImage: `url(${item.image})` }"></div>
          
          <div class="item-info">
            <p class="item-title">{{ item.title }}</p>
            <p class="item-sub-title">{{ item.description }}</p>
            <p class="item-price">¥ {{ item.price }}</p>
          </div>
        </a>
      </div>
    </div>

    <p v-else>正在加载商品...</p>
  </div>
</template>

<style scoped>
.shop-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 15px;
  box-sizing: border-box;
}

.shop-container {
  display: grid;
  gap: 15px;
}

.shop-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.item-link-wrapper {
  display: contents;
  color: inherit;
  text-decoration: none;
}

/* 图片容器样式 */
.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: top right;
  transition: transform 0.35s ease-in-out;
  z-index: 1;
}

/* 鼠标悬浮时图片放大效果 */
.shop-item:hover .image-container {
  transform: scale(1.05);
}

.item-info {
  position: relative;
  z-index: 2;
  padding: 15px;
  text-align: left;
  color: white;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.0) 80%);
}

/* 为所有文字添加细微的描边和阴影，增强可读性 */
.item-info p {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  margin: 0;
}

.item-info .item-title {
  font-size: 16px;
  font-weight: bold;
}

.item-info .item-sub-title {
  font-size: 12px;
  color: #eee;
  margin: 4px 0;
}

.item-info .item-price {
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
}

/* ---- 桌面端布局 (屏幕宽度 > 768px) ---- */
@media (min-width: 769px) {
  .shop-container {
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(6, 1fr);
    /* 七个 */
    grid-template-areas:
      "item-1 item-1 item-1 item-2 item-2 item-3 item-3 item-4 item-4"
      "item-1 item-1 item-1 item-2 item-2 item-3 item-3 item-4 item-4"
      "item-1 item-1 item-1 item-2 item-2 item-3 item-3 item-4 item-4"
      "item-1 item-1 item-1 item-5 item-5 item-6 item-6 item-7 item-7"
      "item-1 item-1 item-1 item-5 item-5 item-6 item-6 item-7 item-7"
      "item-1 item-1 item-1 item-5 item-5 item-6 item-6 item-7 item-7";

    min-height: 80vh;
  }

  .item-1 { grid-area: item-1; }
  .item-2 { grid-area: item-2; }
  .item-3 { grid-area: item-3; }
  .item-4 { grid-area: item-4; }
  .item-5 { grid-area: item-5; }
  .item-6 { grid-area: item-6; }
  .item-7 { grid-area: item-7; }

  .item-3,
  .item-5,
  .item-7 {
    background-color: #e9e9e9;
  }
}

/* ---- 移动端布局 (屏幕宽度 <= 768px) ---- */
@media (max-width: 768px) {
  .shop-container {
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
    grid-template-areas:
      "item-1   item-1"
      "item-2   item-3"
      "item-4   item-5"
      "item-6   item-7";
  }

  .item-1 { grid-area: item-1; aspect-ratio: 16 / 9; }
  .item-2 { grid-area: item-2; aspect-ratio: 1 / 1; }
  .item-3 { grid-area: item-3; aspect-ratio: 1 / 1; }
  .item-4 { grid-area: item-4; aspect-ratio: 1 / 1; }
  .item-5 { grid-area: item-5; aspect-ratio: 1 / 1; }
  .item-6 { grid-area: item-6; aspect-ratio: 1 / 1; }
  .item-7 { grid-area: item-7; aspect-ratio: 1 / 1; }
  
  .shop-item:not(.item-1):nth-of-type(odd) {
      background-color: #e9e9e9;
  }
}

.error-message {
  color: #d9534f;
  text-align: center;
  padding: 20px;
  font-size: 18px;
}
</style>