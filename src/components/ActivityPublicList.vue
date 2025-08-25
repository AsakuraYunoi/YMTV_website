<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
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
import gsap from 'gsap'
import { useRouter } from 'vue-router'

interface Activity {
  title: string
  time: string
  CloudDriveLink: string
  content: string
}

const router = useRouter()
const activities = ref<Activity[]>([])
const drawerOpen = ref<number | null>(null)
const alertDialogOpen = ref(false)
const currentCloudDriveLink = ref<string | null>(null)
// 用于记录在打开弹窗前是哪个抽屉被打开了
const lastOpenedDrawerIndex = ref<number | null>(null)

// 1. 修改：处理弹窗与抽屉的交互
const handleCloudDriveClick = (link: string) => {
  currentCloudDriveLink.value = link
  lastOpenedDrawerIndex.value = drawerOpen.value // 记录当前打开的抽屉索引
  drawerOpen.value = null // 关闭抽屉
  alertDialogOpen.value = true // 打开确认弹窗
}

const confirmAndNavigate = () => {
  if (currentCloudDriveLink.value) {
    window.open(currentCloudDriveLink.value, '_blank')
  }
  // 关闭确认窗的操作会由 onAlertDialogUpdateOpen 统一处理
}

// 监听弹窗状态变化，以便在关闭后重新打开抽屉
const onAlertDialogUpdateOpen = (isOpen: boolean) => {
  alertDialogOpen.value = isOpen
  if (!isOpen) { // 当弹窗关闭时
    nextTick(() => {
      if (lastOpenedDrawerIndex.value !== null) {
        drawerOpen.value = lastOpenedDrawerIndex.value // 重新打开之前的抽屉
      }
    })
  }
}

const handleViewMore = async () => {
  await router.push('/activities')
  await nextTick() // 等待DOM更新
  window.scrollTo({ top: 0, behavior: 'smooth' }) // 平滑滚动到顶部
}

onMounted(async () => {
  const res = await fetch('/config/activities.json')
  const data = await res.json()
  const sortedActivities = data.activities.sort((a: Activity, b: Activity) => b.time.localeCompare(a.time))
  activities.value = sortedActivities.slice(0, 8) // 只显示前6个活动

  // GSAP 动画部分
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.from('.activity-list-item', {
          opacity: 0,
          y: 40,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out'
        })
        observer.disconnect()
      }
    })
  })
  const activityListRoot = document.querySelector('.activity-list-root')
  if (activityListRoot) {
    observer.observe(activityListRoot)
  }
})
</script>

<template>
  <div class="activity-list-root">
    <div class="activity-list-container">
      <div
        v-for="(item, idx) in activities"
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
                <Button @click="handleCloudDriveClick(item.CloudDriveLink)" class="w-full">
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
    </div>
    <Button @click="handleViewMore" variant="outline" class="mt-8 px-6 view-more-btn">
      查看全部
      <span class="arrow-icon">&rarr;</span>
    </Button>

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
.activity-list-root {
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem 1rem;
  background: rgba(255, 255, 255, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.activity-list-container {
  width: 100%;
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
  gap: 0.75rem; /* 控制两个按钮之间的间距 */
  margin-top: 1rem; /* 由于已给Header添加pb, 此处可适当减小 */
  padding-bottom: 1rem;
}

.view-more-btn {
  display: inline-flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform, box-shadow;
  margin-top: 2rem;
}

.view-more-btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.2);
  /* 使用一个常见的深色主题作为悬浮背景色 */
  background-color: #020817; 
  color: #fafafa;
  border-color: #020817;
}

.view-more-btn .arrow-icon {
  display: inline-block;
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
}

.view-more-btn:hover .arrow-icon {
  transform: translateX(4px);
}


@media (max-width: 600px) {
  .activity-list-root {
    padding: 1rem 0.2rem 2rem 0.2rem;
    max-width: 98vw;
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
}
</style>