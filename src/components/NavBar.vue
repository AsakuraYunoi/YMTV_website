<template>
  <nav class="backdrop-blur bg-background/80 border-b border-border shadow-sm fixed top-0 left-0 w-full z-50">
    <div class="container mx-auto flex items-center justify-between py-2 px-4">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <img src="/Logo.svg" alt="Logo" class="w-10 h-10 rounded-lg shadow" />
        <span class="font-bold text-xl tracking-wide text-primary">YMTV</span>
      </div>
      <!-- 导航链接 -->
      <ul class="hidden md:flex items-center gap-6">
        <li>
          <RouterLink to="/">
            <Button variant="ghost" class="text-base font-medium px-4 py-2">首页</Button>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/about">
            <Button variant="ghost" class="text-base font-medium px-4 py-2">关于我们</Button>
          </RouterLink>
        </li>
      </ul>
      <!-- 移动端菜单按钮 -->
      <div class="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem as-child>
              <RouterLink to="/">首页</RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <RouterLink to="/about">关于我们</RouterLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
</script>

<style scoped>
/* 导航栏整体样式：毛玻璃+渐变+阴影 */
.nav-bar {
  background: linear-gradient(90deg, rgba(34,40,49,0.85) 0%, rgba(57,62,70,0.85) 100%);
  color: #f8f8f8;
  padding: 0.7rem 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;
  backdrop-filter: blur(16px) saturate(180%);
  box-shadow: 0 4px 24px 0 rgba(34,40,49,0.10);
  border-bottom: 1.5px solid rgba(255,255,255,0.08);
  transition: background 0.3s;
}

/* 内容居中与间距 */
.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2vw;
}

/* Logo样式：更大更有呼吸感 */
.nav-logo {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  color: #f8f8f8;
  text-shadow: 0 2px 8px rgba(0,0,0,0.10);
  user-select: none;
}

.logo-img {
  width: 48px;
  height: 48px;
  margin-right: 14px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(34,40,49,0.10);
  background: #000000;
  object-fit: contain;
}

/* 导航链接列表 */
.nav-links {
  list-style: none;
  display: flex;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
}

/* 导航链接样式：高级感字体与动画 */
.nav-links a {
  color: #f8f8f8;
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-decoration: none;
  padding: 0.4rem 1.2rem;
  border-radius: 8px;
  position: relative;
  transition: 
    color 0.25s cubic-bezier(.4,0,.2,1),
    background 0.25s cubic-bezier(.4,0,.2,1),
    box-shadow 0.25s cubic-bezier(.4,0,.2,1);
  overflow: hidden;
}

/* 悬停效果：渐变高亮+底部滑动条 */
.nav-links a::after {
  content: "";
  display: block;
  position: absolute;
  left: 20%;
  right: 20%;
  bottom: 8px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #00c6fb 0%, #005bea 100%);
  opacity: 0;
  transform: scaleX(0.5);
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  pointer-events: none;
}

.nav-links a:hover,
.nav-links a:focus {
  color: #00c6fb;
  background: rgba(0,198,251,0.08);
  box-shadow: 0 2px 12px 0 rgba(0,198,251,0.08);
}

.nav-links a:hover::after,
.nav-links a:focus::after {
  opacity: 1;
  transform: scaleX(1);
}

/* 响应式布局优化 */
@media (max-width: 900px) {
  .nav-content {
    max-width: 98vw;
    padding: 0 1vw;
  }
  .nav-links {
    gap: 1.2rem;
  }
  .logo-img {
    width: 38px;
    height: 38px;
    margin-right: 8px;
  }
  .nav-logo {
    font-size: 1.3rem;
  }
}

@media (max-width: 600px) {
  .nav-content {
    flex-direction: column;
    align-items: stretch;
    padding: 0 2vw;
    gap: 0.5rem;
  }
  .nav-logo {
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  .nav-links {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .nav-links a {
    width: 100%;
    text-align: center;
    padding: 0.7rem 0;
    font-size: 1rem;
  }
}
</style>