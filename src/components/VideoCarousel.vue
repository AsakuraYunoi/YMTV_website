<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

import emblaCarousel from 'embla-carousel'
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'

// 类型定义
interface CarouselItem {
  title: string
  subtitle: string
  cover: string
  preview: string
  link: string
}

// Embla Carousel 配置
const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: 'center',
  containScroll: 'trimSnaps',
  dragFree: false,
  skipSnaps: false,
  duration: 25,
  startIndex: 1,
  slidesToScroll: 1,
  inViewThreshold: 0.7,
  dragThreshold: 20,
  watchResize: true
}

// 组件状态
const items = ref<CarouselItem[]>([])
const emblaRef = ref<HTMLElement | null>(null)
const emblaApi = ref<EmblaCarouselType | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

// Tween Scale 动画配置
const TWEEN_FACTOR = {
  BASE: 0.52,
  SCALE_MIN: 0,
  SCALE_MAX: 1,
  TRANSITION: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
}

let tweenNodes: HTMLElement[] = []
let tweenFactor = 0

// 动画相关函数
const setupTweenScale = (embla: EmblaCarouselType) => {
  const setTweenNodes = () => {
    tweenNodes = embla.slideNodes().map((node) => {
      return node.querySelector('.embla__slide__number') as HTMLElement
    })
  }

  const setTweenFactor = () => {
    tweenFactor = TWEEN_FACTOR.BASE * embla.scrollSnapList().length
  }

  const tweenScale = (eventName?: string) => {
    const engine = embla.internalEngine()
    const scrollProgress = embla.scrollProgress()
    const slidesInView = embla.slidesInView()

    embla.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (eventName === 'scroll' && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()
            if (slideIndex === loopItem.index && target !== 0) {
              diffToTarget = target < 0 
                ? scrollSnap - (1 + scrollProgress)
                : scrollSnap + (1 - scrollProgress)
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor)
        const scale = Math.min(Math.max(tweenValue, TWEEN_FACTOR.SCALE_MIN), TWEEN_FACTOR.SCALE_MAX)
        
        if (tweenNodes[slideIndex]) {
          tweenNodes[slideIndex].style.transform = `scale(${scale})`
          tweenNodes[slideIndex].style.transition = TWEEN_FACTOR.TRANSITION
        }
      })
    })
  }

  // 初始化
  setTweenNodes()
  setTweenFactor()
  tweenScale()

  // 事件监听
  return embla
    .on('reInit', () => {
      setTweenNodes()
      setTweenFactor()
      tweenScale()
    })
    .on('scroll', () => tweenScale('scroll'))
    .on('slideFocus', () => tweenScale())
}

// 轮播图控制函数
const scrollPrev = () => emblaApi.value?.scrollPrev()
const scrollNext = () => emblaApi.value?.scrollNext()
const onSelect = () => {
  if (!emblaApi.value) return
  canScrollPrev.value = emblaApi.value.canScrollPrev()
  canScrollNext.value = emblaApi.value.canScrollNext()
}

// 初始化
onMounted(async () => {
  try {
    const response = await fetch('/config/carousel.json')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    items.value = data.items

    await nextTick()
    if (!emblaRef.value) return

    emblaApi.value = emblaCarousel(emblaRef.value, OPTIONS)
    emblaApi.value.on('select', onSelect)
    emblaApi.value.on('init', onSelect)
    onSelect()
    setupTweenScale(emblaApi.value)
  } catch (err) {
    console.error('Failed to load carousel data:', err)
  }
})

// 2. 视频预览和弹窗相关
const showModal = ref(false)
const currentVideo = ref<{title:string, link:string}|null>(null)

function openModal(item: typeof items.value[0]) {
  currentVideo.value = item
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  currentVideo.value = null
}

// 3. 视频控制函数
function handleVideoPlay(e: Event) {
  const video = e.target as HTMLVideoElement
  if (video) {
    video.play()
  }
}

function handleVideoPause(e: Event) {
  const video = e.target as HTMLVideoElement
  if (video) {
    video.pause()
  }
}
</script>

<template>
  <div class="embla">

    <!-- 轮播图容器 -->
    <div class="embla__viewport" ref="emblaRef">
      <div class="embla__container">
        <div 
          v-for="(item, idx) in items" 
          :key="idx" 
          class="embla__slide"
          @click="openModal(item)"
          style="cursor:pointer"
        >
          <div class="embla__slide__number" style="padding:0;">
            <div style="position:relative;width:100%;height:100%;">
              <!-- 预览视频/图片 -->
              <template v-if="item.preview">
                <video 
                  :src="item.preview" 
                  :poster="item.cover"
                  style="width:100%;height:100%;object-fit:cover;border-radius:1.8rem;"
                  muted
                  loop
                  preload="none"
                  @mouseenter="handleVideoPlay"
                  @mouseleave="handleVideoPause"
                />
              </template>
              <template v-else>
                <img 
                  :src="item.cover" 
                  :alt="item.title"
                  style="width:100%;height:100%;object-fit:cover;border-radius:1.8rem;"
                />
              </template>
              <!-- 标题遮罩 -->
              <div style="position:absolute;left:0;bottom:0;width:100%;background:rgba(0,0,0,0.4);color:#fff;padding:0.5rem 1rem;border-radius:0 0 1.8rem 1.8rem;">
                <div style="font-size:1.2rem;font-weight:600;">{{ item.title }}</div>
                <div v-if="item.subtitle" style="font-size:0.9rem;">{{ item.subtitle }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <button 
      class="embla__button embla__button--prev" 
      @click="scrollPrev"
      :disabled="!canScrollPrev"
    >
      <svg class="embla__button__svg" viewBox="0 0 532 532">
        <path fill="currentColor" d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.216C172.192 194.973 332.731 34.31 355.66 11.354Z"/>
      </svg>
    </button>
    <button 
      class="embla__button embla__button--next" 
      @click="scrollNext"
      :disabled="!canScrollNext"
    >
      <svg class="embla__button__svg" viewBox="0 0 532 532">
        <path fill="currentColor" d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.39c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.404 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.216-45.865 45.889-206.404 206.552-229.333 229.504Z"/>
      </svg>
    </button>

    <!-- 视频弹窗 -->
    <div v-if="showModal" class="video-modal" @click.self="closeModal">
      <div class="video-modal-content">
        <button class="close-btn" @click="closeModal">×</button>
        <iframe
          v-if="currentVideo"
          :src="currentVideo.link"
          frameborder="0"
          allowfullscreen
          style="width:80vw;height:45vw;border-radius:1rem;"
        ></iframe>
        <div style="margin-top:0.5rem;color:#fff;">{{ currentVideo?.title }}</div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 轮播图容器的主要样式 */
.embla {
  width: 100vw;
  margin: auto;
  --slide-spacing: 0.3rem;
  --slide-size: 60%;
  position: relative;
}
.embla__viewport {
  overflow: hidden;
}
.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
}
.embla__slide {
  transform: translate3d(0, 0, 0);
  flex: 0 0 var(--slide-size);
  min-width: 0;
  padding-left: var(--slide-spacing);
}
.embla__slide__number {
  box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);
  border-radius: 1.8rem;
  font-size: 4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
@media (max-height: 768px) {
  .embla__slide__number {
    height: 50vh;
  }
  
}

/* 控制按钮容器样式 */
.embla__controls {
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: space-between;
  gap: 1.2rem;
  margin-top: 1.8rem;
}

/* 导航按钮组样式 */
.embla__buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  align-items: center;
}

/* 导航按钮基础样式 */
.embla__button {
  -webkit-tap-highlight-color: rgba(60,60,60,0.5);
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  touch-action: manipulation;
  display: inline-flex;
  text-decoration: none;
  cursor: pointer;
  border: 0;
  padding: 0;
  margin: 0;
  box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast, #e0e0e0), 
              0 2px 8px 0 rgba(0,0,0,0.10);
  width: 3.6rem;
  height: 3.6rem;
  z-index: 1;
  border-radius: 50%;
  color: #333;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: box-shadow 0.2s;
}

/* 按钮禁用状态样式 */
.embla__button:disabled {
  color: #bbb;
  opacity: 0.3;
  cursor: not-allowed;
}

/* 按钮内图标样式 */
.embla__button__svg {
  width: 35%;
  height: 35%;
  margin: auto;
}

/* 上一张/下一张按钮位置 */
.embla__button--prev {
  left: 5rem;
}
.embla__button--next {
  right: 5rem;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 600px) {
  .embla {
    --slide-size: 90%; /* 移动端幻灯片占比更大 */
    --slide-height: 12rem; /* 降低高度 */
    padding: 0.5rem;
  }
  .embla__slide__number {
    font-size: 2rem;
    border-radius: 1rem;
  }
}

/* 视频模态框样式 */
.video-modal {
  position: absolute;
  z-index: 99;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0); /* 半透明遮罩 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 模态框内容区域样式 */
.video-modal-content {
  position: relative;
  background: #222;
  padding: 1.5rem 1rem 1rem 1rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 关闭按钮样式 */
.close-btn {
  position: absolute;
  right: 1rem; top: 1rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  z-index: 2;
}
</style>