<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
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
import gsap from 'gsap'

interface Activity {
  title: string
  time: string
  CloudDriveLink: string
  drawer: {
    content: string
    preview: string
  }
}

const activities = ref<Activity[]>([])
const drawerOpen = ref<number | null>(null)

onMounted(async () => {
  const res = await fetch('/config/activities.json')
  const data = await res.json()
  activities.value = data.activities.sort((a: Activity, b: Activity) => b.time.localeCompare(a.time))
  await nextTick()
  gsap.from('.activity-list-item', {
    opacity: 0,
    y: 40,
    stagger: 0.12,
    duration: 0.7,
    ease: 'power2.out'
  })
})
</script>

<template>
  <div class="activity-list-root">
    <Accordion type="single" class="w-full" collapsible>
      <AccordionItem
        v-for="(item, idx) in activities"
        :key="item.title"
        :value="item.title"
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
          <DrawerContent>
            <div class="drawer-card">
              <DrawerHeader>
                <DrawerTitle>{{ item.title }}</DrawerTitle>
                <DrawerDescription>{{ item.drawer.content }}</DrawerDescription>
              </DrawerHeader>
              <div class="drawer-img-wrap">
                <img
                  v-if="item.drawer.preview"
                  :src="item.drawer.preview"
                  :alt="item.title"
                  class="drawer-img"
                />
                <a
                  v-if="item.CloudDriveLink"
                  :href="item.CloudDriveLink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>查看云盘资源</Button>
                </a>
              </div>
              <DrawerClose as-child>
                <Button variant="outline" class="drawer-close-btn">关闭</Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style scoped>
.activity-list-root {
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  padding: 2.5rem 1rem 3rem 1rem;
  background: rgba(255,255,255,0.85);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.activity-list-item {
  margin-bottom: 1.2rem;
  border: none;
  background: none;
}

.activity-list-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  border: none;
  outline: none;
  transition: 
    background 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
  position: relative;
  overflow: hidden;
}
.activity-list-btn:hover {
  background: #fff;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  transform: translateY(-2px) scale(1.02);
}

.activity-title {
  font-weight: 600;
  font-size: 1.08rem;
  letter-spacing: 0.01em;
}

.activity-time {
  font-size: 0.98rem;
  color: #888;
  margin-left: 1.2rem;
  font-family: 'JetBrains Mono', 'Menlo', 'monospace', sans-serif;
  letter-spacing: 0.04em;
}

.drawer-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  padding: 2rem 1.2rem 1.5rem 1.2rem;
  margin: 0 auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drawer-img-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.2rem;
}

.drawer-img {
  border-radius: 1rem;
  max-width: 260px;
  width: 100%;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.drawer-close-btn {
  width: 100%;
  margin-top: 1.2rem;
}

@media (max-width: 600px) {
  .activity-list-root {
    padding: 1.2rem 0.2rem 2rem 0.2rem;
    border-radius: 1.2rem;
    max-width: 98vw;
  }
  .activity-list-btn {
    padding: 0.8rem 0.8rem;
    font-size: 0.98rem;
    border-radius: 0.8rem;
  }
  .drawer-card {
    padding: 1.2rem 0.4rem 1rem 0.4rem;
    border-radius: 1rem;
    max-width: 98vw;
  }
  .drawer-img {
    max-width: 90vw;
  }
}
</style>