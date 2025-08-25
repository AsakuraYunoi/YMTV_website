<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import '@/assets/dark/ActivitiesDark.css'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { ChevronUp, Search } from 'lucide-vue-next'

interface Activity {
  title: string
  time: string
  CloudDriveLink: string
  content: string
}

const allActivities = ref<Activity[]>([])
const displayedActivities = ref<Activity[]>([])
const drawerOpen = ref<number | null>(null)
const alertDialogOpen = ref(false)
const currentCloudDriveLink = ref<string | null>(null)
const lastOpenedDrawerIndex = ref<number | null>(null)
const searchQuery = ref('')
const isLoading = ref(true)
const page = ref(1)
const itemsPerPage = 20
const showScrollButton = ref(false)
const listContainer = ref<HTMLElement | null>(null)

// 过滤和搜索逻辑 - 检查 title, content, time
const filteredActivities = computed(() => {
  if (!searchQuery.value) {
    return allActivities.value
  }
  const query = searchQuery.value.toLowerCase()
  return allActivities.value.filter(activity =>
    activity.title.toLowerCase().includes(query) ||
    activity.content.toLowerCase().includes(query) ||
    activity.time.toLowerCase().includes(query)
  )
})

// 懒加载逻辑
const loadMoreItems = () => {
  if (displayedActivities.value.length < filteredActivities.value.length) {
    const start = (page.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    const newItems = filteredActivities.value.slice(start, end)
    displayedActivities.value = [...displayedActivities.value, ...newItems]
    page.value++
  }
}

// 监听滚动事件，处理回到顶部按钮的显示和懒加载
const handleScroll = () => {
  // 回到顶部按钮
  showScrollButton.value = window.scrollY > 200

  // 懒加载
  if (listContainer.value) {
    const listBottom = listContainer.value.getBoundingClientRect().bottom
    const windowHeight = window.innerHeight
    if (listBottom < windowHeight + 100) { // 在列表底部即将进入视窗时加载
      loadMoreItems()
    }
  }
}

// 回到顶部按钮
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleCloudDriveClick = (link: string, idx: number) => {
  currentCloudDriveLink.value = link
  lastOpenedDrawerIndex.value = idx
  drawerOpen.value = null
  alertDialogOpen.value = true
}

const confirmAndNavigate = () => {
  if (currentCloudDriveLink.value) {
    window.open(currentCloudDriveLink.value, '_blank')
  }
}

const onAlertDialogUpdateOpen = (isOpen: boolean) => {
  alertDialogOpen.value = isOpen
  if (!isOpen) {
    nextTick(() => {
      if (lastOpenedDrawerIndex.value !== null) {
        drawerOpen.value = lastOpenedDrawerIndex.value
      }
    })
  }
}

// 初始化加载数据
onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'instant' })
  window.addEventListener('scroll', handleScroll)

  try {
    const res = await fetch('/config/activities.json')
    const data = await res.json()
    allActivities.value = data.activities.sort((a: Activity, b: Activity) => b.time.localeCompare(a.time))
    handleSearch() // 初始加载第一页数据
  } catch (error) {
    console.error('Failed to fetch activities:', error)
  } finally {
    isLoading.value = false
  }
})

// 搜索事件处理函数 - 重置懒加载状态并加载第一页
const handleSearch = () => {
  page.value = 1
  displayedActivities.value = []
  loadMoreItems()
}
</script>

<template>
  <div class="activity-full-page-root">

    <div class="header-section">
      <h1>活动回顾</h1>
      <p class="intro-text">
        欢迎来到活动回顾页面！这里收录了我们历年来举办的精彩活动。您可以浏览过往的每一个瞬间，也可以通过搜索框快速查找感兴趣的内容。希望这些珍贵的回忆能带给您温暖与感动。
      </p>
      <div class="search-container">
        <Input
          v-model="searchQuery"
          placeholder="搜索标题、介绍或时间..."
          class="search-input"
          @input="handleSearch"
          @keyup.enter="handleSearch"
        />
        <Button @click="handleSearch" class="search-button">
          <Search class="h-4 w-4" />
        </Button>
      </div>
      <Separator />
    </div>

    <div class="activity-list-container" ref="listContainer">
      <div v-if="isLoading" class="loading-message">
        正在加载中...
      </div>
      <div v-else-if="filteredActivities.length === 0" class="no-results-message">
        没有找到相关的活动，请尝试其他关键词。
      </div>
      <div
        v-else
        v-for="(item, idx) in displayedActivities"
        :key="item.title"
        class="activity-list-item"
      >
        <Drawer :open="drawerOpen === idx" @update:open="val => drawerOpen = val ? idx : null">
          <DrawerTrigger as-child>
            <button
              class="activity-list-btn"
              @click.prevent
            >
              <span class="activity-title">{{ item.title }}</span>
              <span class="activity-time">{{ item.time }}</span>
            </button>
          </DrawerTrigger>
          <DrawerContent class="h-auto rounded-t-[1.5rem] mt-24">
            <div class="drawer-card">
              <DrawerHeader class="text-center pb-8">
                <DrawerTitle class="text-xl font-bold">{{ item.title }}</DrawerTitle>
                <DrawerDescription class="text-gray-600 mt-2">{{ item.content }}</DrawerDescription>
              </DrawerHeader>
              <div class="drawer-footer">
                <Button @click="handleCloudDriveClick(item.CloudDriveLink, idx)" class="w-full">
                  查看网盘资源
                </Button>
                <DrawerClose as-child>
                  <Button variant="outline" class="w-full">关闭</Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div v-if="displayedActivities.length > 0 && displayedActivities.length < filteredActivities.length" class="loading-more-message">
        加载更多...
      </div>
    </div>

    <transition name="fade">
      <Button
        v-if="showScrollButton"
        @click="scrollToTop"
        class="back-to-top-btn"
        size="icon"
      >
        <ChevronUp />
      </Button>
    </transition>

    <AlertDialog :open="alertDialogOpen" @update:open="onAlertDialogUpdateOpen">
      <AlertDialogContent class="w-[90vw] max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>资源使用注意事项</AlertDialogTitle>
          <AlertDialogDescription>
            使用者请自觉遵守以下使用条款：<br/><br/>
            1. 禁止侵权行为：不得以任何方式侵犯被拍摄者的名誉权和肖像权，禁止恶意剪辑或恶搞。
            <br/>
            2. 非商业用途：本资源仅供个人学习、纪念和分享，不支持任何形式的免费商用或盈利行为。
            <br/><br/>
            点击“我已知晓”即表示您同意并遵守以上所有条款，最终解释权归 YMTV 官方所有。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmAndNavigate">我已知晓</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<style scoped>
.activity-full-page-root {
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem 1rem;
  background: rgba(255,255,255,0.85);
}

.header-section {
  text-align: center;
  margin-top: 6rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
}

.header-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.intro-text {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.search-container {
  padding: 1rem 0;
  display: flex;
  gap: 0.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  flex-grow: 1;
}

.activity-list-container {
  margin-top: 1rem;
  width: 100%;
  min-height: 300px;
}

.activity-list-item {
  margin-bottom: 0.8rem;
}

.activity-list-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  border-radius: 0.6rem;
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  outline: none;
  transition:
    background 0.2s,
    transform 0.2s;
}

.activity-list-btn:hover {
  background: #fff;
  transform: translateY(-1px);
}

.activity-title {
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.01em;
}

.activity-time {
  font-size: 0.9rem;
  color: #888;
  margin-left: 1rem;
  font-family: 'JetBrains Mono', 'Menlo', 'monospace', sans-serif;
  letter-spacing: 0.04em;
}

.drawer-card {
  background: #fff;
  padding: 2rem 1.2rem 1.5rem 1.2rem;
  margin: 0 auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
}

.drawer-footer {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-bottom: 1rem;
}

.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.loading-message, .no-results-message, .loading-more-message {
  text-align: center;
  padding: 2rem;
  color: #888;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .activity-full-page-root {
    padding: 1rem 0.2rem 2rem 0.2rem;
  }
  .activity-list-btn {
    padding: 0.8rem 0.8rem;
    font-size: 0.9rem;
    border-radius: 0.6rem;
  }
  .drawer-card {
    padding: 1.2rem 0.4rem 1rem 0.4rem;
    max-width: 98vw;
  }
  .back-to-top-btn {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>