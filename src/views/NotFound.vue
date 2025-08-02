<template>
  <div class="not-found-container">
    <div class="sky">
      <div class="star"></div>
      <div class="star-2"></div>
      <div class="star-3"></div>
      <div class="star-4"></div>
      <div class="star-5"></div>
      <div class="star-6"></div>
      <div class="comet"></div>
    </div>
    <div class="not-found-content">
      <div class="space-ship">
        <div class="window"></div>
        <div class="fire"></div>
      </div>
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>不好意思，你好像迷失在宇宙的某个角落了。</p>
      <router-link to="/" class="home-button">
        返回地球
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>
/* 基本容器和背景 */
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  background: #0d1117;
  color: #c9d1d9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
  position: relative;
}

/* 宇宙星空 */
.sky {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
}

.star, .star-2, .star-3, .star-4, .star-5, .star-6 {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 5px #ffffff;
  opacity: 0;
  animation: twinkle 5s infinite;
}

.star { top: 10%; left: 20%; animation-delay: 0s; }
.star-2 { top: 50%; left: 70%; animation-delay: 1s; }
.star-3 { top: 80%; left: 40%; animation-delay: 2s; }
.star-4 { top: 30%; left: 85%; animation-delay: 3s; }
.star-5 { top: 60%; left: 15%; animation-delay: 4s; }
.star-6 { top: 20%; left: 55%; animation-delay: 5s; }

@keyframes twinkle {
  0%, 100% { transform: scale(1); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
}

/* 彗星动画 */
.comet {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 10px #ffffff;
  top: 10%;
  left: 120%;
  animation: shoot 10s linear infinite;
  animation-delay: 3s;
}
.comet::before {
  content: '';
  position: absolute;
  width: 150px;
  height: 1px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.8), transparent);
  transform: rotate(-45deg);
  top: 50%;
  left: 50%;
}

@keyframes shoot {
  0% { transform: translate(-100vw, 0); }
  100% { transform: translate(100vw, 100vh); }
}

/* 主要内容区域 */
.not-found-content {
  text-align: center;
  z-index: 1;
}

h1 {
  font-size: 15rem;
  margin: 0;
  color: #e55353;
  text-shadow: 0 0 20px rgba(229, 83, 83, 0.5);
  animation: float-text 4s ease-in-out infinite;
}

h2 {
  font-size: 3rem;
  margin: -30px 0 20px;
}

p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

@keyframes float-text {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* 宇宙飞船 */
.space-ship {
  position: relative;
  width: 100px;
  height: 100px;
  background: #39424c;
  margin: 0 auto 50px;
  border-radius: 50% 50% 10% 10%;
  border-bottom: 10px solid #5d6d7e;
  animation: float-ship 3s ease-in-out infinite;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.space-ship::before {
  content: '';
  position: absolute;
  width: 120px;
  height: 50px;
  background: #39424c;
  top: -15px;
  left: -10px;
  border-radius: 50% 50% 0 0;
  border-top: 5px solid #5d6d7e;
  z-index: -1;
}

.window {
  position: absolute;
  width: 30px;
  height: 30px;
  background: #4682b4;
  border: 3px solid #2c313a;
  border-radius: 50%;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.fire {
  position: absolute;
  width: 50px;
  height: 80px;
  background: linear-gradient(to top, #ff4500, #ffa500, transparent);
  bottom: -75px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  opacity: 0.8;
  animation: fire-flicker 0.5s infinite;
}

@keyframes float-ship {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25px); }
}

@keyframes fire-flicker {
  0%, 100% { height: 80px; opacity: 0.8; }
  50% { height: 90px; opacity: 1; }
}

/* 按钮样式 */
.home-button {
  display: inline-block;
  padding: 12px 24px;
  background: #4682b4;
  color: #ffffff;
  text-decoration: none;
  border-radius: 30px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.home-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  background: #5d97c7;
}

</style>