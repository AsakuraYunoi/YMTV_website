<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

// 引入 Sheet 组件用于移动端抽屉菜单
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

// 是否显示 Components 按钮, 默认为 false
const showComponentsBtn = ref(false)
// 控制移动端抽屉菜单的开关状态
const isMobileMenuOpen = ref(false)
// 一言内容
const hitokoto = ref('Loading...');
onMounted(async () => {
  try {
    const response = await fetch('https://v1.hitokoto.cn?c=i&c=d'); // c=i 获取诗歌分类，c=d 获取文学分类
    const data = await response.json();
    hitokoto.value = data.hitokoto;
  } catch (error) {
    console.error('Failed to fetch Hitokoto:', error);
    hitokoto.value = '每一个不曾起舞的日子，都是对生命的辜负。';
  }
});

// 切换移动端菜单的开关状态
onMounted(async () => {
  try {
    const response = await fetch('/config/config.json')
    const config = await response.json()
    // 读取 NavBar 配置
    const navBarConfig = config.NavBar?.[0]
    // 支持字符串和布尔值
    showComponentsBtn.value =
      navBarConfig &&
      (navBarConfig["招新按钮"] === true || navBarConfig["招新按钮"] === "True")
  }
  catch (error) {
    console.error('Failed to load config', error)
  }
})

const router = useRouter()

/**
 * 导航到主页, 然后滚动到指定的锚点。
 * @param anchor 要滚动到的元素的 ID。
 */
async function goHomeAndScroll(anchor: string) {
  if (router.currentRoute.value.path !== '/')
    await router.push('/')

  setTimeout(() => {
    scrollToAnchor(anchor)
    isMobileMenuOpen.value = false // 点击后关闭移动端菜单
  }, 100)
}

/**
 * 将窗口滚动到指定的锚点元素。
 * @param anchor 要滚动到的元素的 ID。
 */
function scrollToAnchor(anchor: string) {
  const el = document.getElementById(anchor)
  if (el) {
    const NAV_HEIGHT = 70 // 导航栏高度
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>

<template>
  <nav class="backdrop-blur bg-background/80 border-b border-border shadow-sm fixed top-0 left-0 w-full z-50">
    <div class="flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2">
        <img src="/Logo.svg" alt="YMTV Logo" class="w-10 h-10 rounded-lg shadow">
        <span class="font-bold text-xl tracking-wide text-primary">YMTV</span>
      </div>
      
      <!-- 桌面端菜单 -->
      <NavigationMenu class="hidden lg:flex pl-50 pr-10">
        <NavigationMenuList class="flex items-center gap-4">
          <NavigationMenuItem>
            <NavigationMenuTrigger>首页</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid gap-3 p-6 lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
                <li class="row-span-3">
                  <NavigationMenuLink as-child>
                    <a
                      class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/#splash"
                      @click.prevent="goHomeAndScroll('splash')"
                    >
                      <img src="/Logo.svg" alt="YMTV Logo" class="h-10 w-10 mb-4" >
                      <div class="mb-2 mt-4 text-lg font-medium" style="padding-bottom: 1rem;">
                        首页
                      </div>
                      <p class="text-sm leading-tight text-muted-foreground">
                        大连育明高级中学<br>电视台<br>YOUTH MOMENT TV
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink as-child>
                    <a
                      href="#video-carousel"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      @click.prevent="goHomeAndScroll('video-carousel')"
                    >
                      <div class="text-sm font-medium leading-none">热门作品</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        2025年度巨献
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink as-child>
                    <a
                      href="#activity-list"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      @click.prevent="goHomeAndScroll('activity-list')"
                    >
                      <div class="text-sm font-medium leading-none">活动公式</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        大型活动的照片在这里
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink as-child>
                    <a
                      href="#shop"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      @click.prevent="goHomeAndScroll('shop')"
                    >
                      <div class="text-sm font-medium leading-none">周边商店</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        YMTV官方义卖周边
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem v-if="showComponentsBtn">
            <RouterLink to="/recruitment">
              <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                招贤纳士
              </NavigationMenuLink>
            </RouterLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <RouterLink to="/about">
              <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                关于我们
              </NavigationMenuLink>
            </RouterLink>
          </NavigationMenuItem>

        </NavigationMenuList>

      </NavigationMenu>

      <!-- 移动端菜单按钮 -->
      <div class="lg:hidden">
  <Drawer v-model:open="isMobileMenuOpen">
    <DrawerTrigger as-child>
      <Button variant="outline" size="icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>
    </DrawerTrigger>
    <DrawerContent side="right" class="w-screen max-w-full px-0 flex flex-col h-full">
      <!-- 顶部Logo和标题 -->
      <div class="flex flex-col items-center py-6 border-b border-border bg-background/80">
        <img src="/Logo.svg" alt="YMTV Logo" class="w-14 h-14 rounded-lg shadow mb-2">
        <!-- 一言 -->
              <div class="text-base text-muted-foreground mt-2 mb-1 px-4 text-center" style="min-height:2em; margin-top: 1.5rem;">
                {{ hitokoto }}
              </div>
      </div>
      <!-- 菜单项 -->
      <nav class="flex-1 flex flex-col items-center justify-center divide-y divide-border text-center">
        <a
          href="#splash"
          @click.prevent="goHomeAndScroll('splash')"
          class="w-full px-8 py-5 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >首页</a>
        <a
          href="#video-carousel"
          @click.prevent="goHomeAndScroll('video-carousel')"
          class="w-full px-8 py-5 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >热门作品</a>
        <a
          href="#activity-list"
          @click.prevent="goHomeAndScroll('activity-list')"
          class="w-full px-8 py-5 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >活动公式</a>
        <a
          href="#shop"
          @click.prevent="goHomeAndScroll('shop')"
          class="w-full px-8 py-5 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >周边商店</a>
        
        <RouterLink
          v-if="showComponentsBtn"
          to="/recruitment"
          @click="isMobileMenuOpen = false"
          class="w-full px-8 py-5 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground block"
        >招贤纳士</RouterLink>

        <RouterLink
          to="/about"
          @click="isMobileMenuOpen = false"
          class="w-full px-8 py-5 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground block"
        >关于我们</RouterLink>
      </nav>
      <!-- 底部版权信息 -->
      <div class="py-4 text-center text-xs text-muted-foreground border-t border-border">
        © 2025 YMTV. All rights reserved.
      </div>
    </DrawerContent>
  </Drawer>
</div>

    </div>
  </nav>
</template>