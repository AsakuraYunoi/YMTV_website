<script setup lang="ts">
// 引入 Vue 的核心函数
import { ref, onMounted, nextTick } from 'vue'

// 引入 GSAP 动画库和插件
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

// 引入 shadcn-vue 的 Button 组件
import { Button } from '@/components/ui/button'

// 引入静态资源
import heroBgUrl from '/src/images/Recruitment/bg.png'
import ctaVideoUrl from '/src/videos/tmpVideo.webm'

// 引入 GSAP 的 random 工具函数
import { random } from 'gsap/all'

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger, Draggable)

// 定义图片数据接口，增加可读性
interface GalleryImage {
  id: number;
  src: string;
  depth: number;
  style: {
    top: string;
    left: string;
    width?: string;
    height?: string;
    transform: string;
    boxShadow: string;
    zIndex: number;
    opacity: number;
    transition: string;
  };
}

// 使用 ref 创建响应式引用，用于获取 DOM 元素
const mainContainerRef = ref<HTMLElement | null>(null)
const heroSectionRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const scrollPromptRef = ref<HTMLElement | null>(null) 
const gallerySectionRef = ref<HTMLElement | null>(null)
const galleryImageRefs = ref<HTMLElement[]>([])
const starBgRef = ref<HTMLElement | null>(null)
const ctaSectionRef = ref<HTMLElement | null>(null)
const galleryTextRefs = ref<HTMLElement[]>([]) // 新增：用于获取文字块的引用

const galleryImages = ref<GalleryImage[]>([]);

// 画廊部分的文字内容
const galleryTexts = [
  "我们是YMTV，用镜头记录育明的每一个青春瞬间。",
  "在这里，你将接触到策划、拍摄、剪辑的全过程。",
  "我们寻找有创意、有热情、有责任心的你。",
  "无论你擅长哪个领域，这里都有你发光的舞台。",
]

onMounted(async () => {
  // 定义需要加载的图片数据
  const imagesDataToLoad = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    src: `/src/images/Recruitment/${i + 1}.png`,
    depth: Math.random() * 0.8 + 0.2, // 为每张图片生成一个随机深度值，用于视差效果
  }));

  const initialImages: GalleryImage[] = [];

  imagesDataToLoad.forEach((data, i) => {
    const NUM_IMAGES = imagesDataToLoad.length;
    const verticalRange = 90;
    const verticalStart = 5;
    const verticalSlot = verticalRange / NUM_IMAGES;
    const top = verticalStart + i * verticalSlot + (Math.random() - 0.5) * 4;
    let left;
    if (i % 2 === 0) {
      left = 25 + (Math.random() - 0.5) * 10;
    } else {
      left = 75 + (Math.random() - 0.5) * 10;
    }
    const rotation = (Math.random() - 0.5) * 8;
    const scale = 0.8 + data.depth * 0.4;
    const zIndex = Math.round(data.depth * 10);
    const boxShadow = `0 10px 40px rgba(0,0,0,0.6)`; 

    initialImages.push({
      ...data,
      style: {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        zIndex,
        boxShadow,
        opacity: 0,
        transition: 'opacity 0.6s ease-in-out, transform 0.3s ease',
      },
    });

    // 预加载图片以获取尺寸，并设置最终样式
    const img = new Image();
    img.src = data.src;

    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      let baseWidthVW;
      if (aspectRatio > 1.2) { 
        baseWidthVW = 30 + Math.random() * 5; 
      } 
      else if (aspectRatio < 0.8) { 
        baseWidthVW = 20 + Math.random() * 5; 
      } 
      else {
        baseWidthVW = 25 + Math.random() * 5; 
      }
      
      const MIN_ASPECT_RATIO = 4 / 5;
      const MAX_ASPECT_RATIO = 16 / 9;
      const clampedAspectRatio = Math.max(MIN_ASPECT_RATIO, Math.min(aspectRatio, MAX_ASPECT_RATIO));
      
      const finalWidthVW = baseWidthVW;
      const finalHeightVW = finalWidthVW / clampedAspectRatio;

      const targetImage = galleryImages.value.find(item => item.id === data.id);
      if (targetImage) {
        targetImage.style.width = `${finalWidthVW}vw`;
        targetImage.style.height = `${finalHeightVW}vw`;
        targetImage.style.opacity = 1;
      }
    };
  });

  galleryImages.value = initialImages;
  
  // 等待 DOM 更新后执行动画设置
  await nextTick()
  setupHeroAnimation()
  animateSubTitle()
  setupGalleryAnimation()
  setupStarryBackground()
  setupCTAAnimation()
})

/**
 * 设置画廊部分的动态星空背景
 */
function setupStarryBackground() {
  if (!starBgRef.value) return
  const container = starBgRef.value
  const numStars = 150;
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div')
    star.classList.add('star')
    const size = random(1, 3) // 随机星星大小
    gsap.set(star, {
      x: random(0, container.offsetWidth),
      y: random(0, container.offsetHeight),
      width: size,
      height: size,
      opacity: random(0.2, 0.8),
    })
    container.appendChild(star)
    // 为每颗星星添加一个轻微的、无限循环的动画
    gsap.to(star, {
      x: '+=random(-50, 50)',
      y: '+=random(-50, 50)',
      opacity: '+=random(-0.3, 0.3)',
      duration: random(20, 40),
      repeat: -1,
      yoyo: true, // 循环时来回播放
      ease: 'sine.inOut'
    })
  }
}

/**
 * 设置主页标题和背景的滚动动画
 */
function setupHeroAnimation() {
  if (!heroSectionRef.value || !mainContainerRef.value || !scrollPromptRef.value) return
  // GSAP from 动画，用于初始加载时文字的飞入效果
  gsap.from('.hero-decor-text span', { y: 100, autoAlpha: 0, rotationX: -90, transformOrigin: '50% 50% -50px', stagger: 0.05, duration: 1, ease: 'power3.out', delay: 0.2 })
  
  // 创建一个时间线，并将其绑定到滚动触发器
  const heroToGalleryTimeline = gsap.timeline({ scrollTrigger: { trigger: heroSectionRef.value, start: 'top top', end: '+=150%', scrub: 1, pin: true } })
  
  heroToGalleryTimeline
    .to('.hero-decor-text, .decor-svg', { autoAlpha: 0, ease: 'power2.in' }, 0) // 文字和SVG淡出
    .to(heroTitleRef.value, { scale: 15, z: 1200, autoAlpha: 0, ease: 'power2.in' }, 0) // 标题放大并淡出
    .to('.hero-bg', { scale: 1.2, autoAlpha: 0, ease: 'power2.in' }, 0) // 背景放大并淡出
    .to(mainContainerRef.value, { backgroundColor: '#111827', ease: 'sine.inOut' }, 0.2) // 背景色渐变
    .to(scrollPromptRef.value, { autoAlpha: 1, y: -20, ease: 'power2.out' }, 0.2) // 滚动提示出现
    .to(scrollPromptRef.value, { autoAlpha: 0, y: 0, ease: 'power2.in' }, 0.7) // 滚动提示淡出
}

/**
 * 设置画廊部分的图片和文字动画
 */
function setupGalleryAnimation() {
  if (!gallerySectionRef.value) return

  // 图片视差和玻璃光泽动画
  galleryImageRefs.value.forEach(imgWrapper => {
    // 为每个图片包装器添加视差滚动效果
    gsap.fromTo(imgWrapper, { y: 100 }, { y: -100, ease: 'none', scrollTrigger: { trigger: imgWrapper, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    const sheen = imgWrapper.querySelector('.glass-sheen');
    if (sheen) {
      // 玻璃光泽的动画效果，随滚动移动
      gsap.fromTo(sheen, 
        { '--sheen-x': '-100%', '--sheen-y': '-100%' },
        {
          '--sheen-x': '100%',
          '--sheen-y': '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: imgWrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        }
      );
    }
  })

  // 拖拽逻辑（仅在桌面端启用）
  ScrollTrigger.matchMedia({
    '(min-width: 769px)': () => {
      galleryImageRefs.value.forEach(img => {
        Draggable.create(img, {
          bounds: gallerySectionRef.value, edgeResistance: 0.25, type: 'x,y',
          onPress() { gsap.to(img, { duration: 0.2, scale: '+=0.05' }) },
          onRelease() { gsap.to(img, { duration: 0.2, scale: '-=0.05' }) },
        })
      })
    },
    '(max-width: 768px)': () => {},
  })

  // --- 波浪形飞入动画 ---
  galleryTextRefs.value.forEach((textBlock) => {
    const words = textBlock.querySelectorAll('.word');
    if (words.length > 0) {
      // 获取每个词的横向位置
      const parentRect = textBlock.getBoundingClientRect();
      const delays: number[] = [];
      words.forEach(word => {
        const rect = word.getBoundingClientRect();
        // 计算每个词的中心点相对于父容器的 left 偏移
        const centerX = rect.left + rect.width / 2 - parentRect.left;
        delays.push(centerX);
      });
      // 归一化 delay，形成波浪（中心先动，两边后动）
      const min = Math.min(...delays);
      const max = Math.max(...delays);
      const mid = (min + max) / 2;
      // 距离中心越远，delay越大
      const waveDelays = delays.map(x => Math.abs(x - mid));
      const maxWave = Math.max(...waveDelays) || 1;
      // 设定最大延迟为 0.4s，最小为 0s
      const delayBase = 0.03; // 每个词基础间隔
      const delayWave = 0.4;  // 最大波浪延迟
      // 生成最终 delay 数组
      const finalDelays = waveDelays.map(d => (d / maxWave) * delayWave);

      // 为每个词分别创建动画
      words.forEach((word, i) => {
        gsap.from(word, {
          y: '100%',
          autoAlpha: 0,
          rotationX: -90,
          transformOrigin: '50% 50% -50px',
          duration: 0.8,
          ease: 'power3.out',
          delay: finalDelays[i] + i * delayBase,
          scrollTrigger: {
            trigger: textBlock,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
          }
        });
      });
    }
  });
}

/**
 * 设置 CTA (Call to Action) 部分的动画
 */
function setupCTAAnimation() {
  if (!ctaSectionRef.value || !mainContainerRef.value) return
  // 创建一个时间线，用于背景色变化和 CTA 部分的淡入效果
  gsap.timeline({ scrollTrigger: { trigger: ctaSectionRef.value, start: 'top 80%', end: 'top 50%', scrub: 1 } })
    .to(mainContainerRef.value, { backgroundColor: '#ffffff', ease: 'sine.inOut' }) // 背景色变为白色
    .from(ctaSectionRef.value, { autoAlpha: 0, ease: 'sine.inOut' }, '<') // CTA 部分淡入
}

// 辅助函数：将字符串按词拆分并用 span 包装，以便进行逐词动画
const splitTextIntoWords = (text: string) => {
  return text.split(/(\s+)/).filter(s => s.length > 0).map(word => {
    if (/\s+/.test(word)) {
      return `<span class="word whitespace-pre">${word}</span>`; // 保留空格
    }
    return `<span class="word">${word}</span>`;
  }).join('');
};

/* 新增：处理副标题的动画 */
const subTitleRef = ref<HTMLElement | null>(null);

function animateSubTitle() {
  const text = "九月招新";
  if (!subTitleRef.value) return;
  subTitleRef.value.textContent = "";
  gsap.from(subTitleRef.value, { y: 60, opacity: 0, duration: 1, ease: "power3.out" });
  let i = 0;
  function type() {
    if (i <= text.length) {
      subTitleRef.value!.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 120);
    }
  }
  type();
}
</script>

<template>
  <div ref="mainContainerRef" class="main-container">

    <section ref="heroSectionRef" class="hero-section">
      <div class="hero-bg" :style="{ backgroundImage: 'url(' + heroBgUrl + ')' }"></div>
      <div class="hero-content">
        <div ref="heroTitleRef" class="hero-title">
          <h1 class="main-title">大连育明高级中学校园电视台</h1>
          <p class="sub-title" ref="subTitleRef"></p>
        </div>
        <div class="hero-decor-text ymtv">
          <span>Y</span><span>M</span><span>T</span><span>V</span>
        </div>
        <svg class="decor-svg dots" width="100" height="100" viewBox="0 0 100 100">
          <circle v-for="i in 9" :key="i" :cx="((i-1)%3)*30+20" :cy="Math.floor((i-1)/3)*30+20" r="3" fill="white"/>
        </svg>
        
      </div>


      <div ref="scrollPromptRef" class="scroll-prompt chinese-font">
        <div class="introduction-text">
          <p>我们是YMTV，用镜头记录育明的每一个青春瞬间。</p>
          <p> 在这里，你将接触到策划、拍摄、剪辑的全过程。</p>
          <p> 我们寻找有创意、有热情、有责任心的你。</p>
          <p> 无论你擅长哪个领域，这里都有你发光的舞台。</p>
        
        </div>

        <p>向下滚动，探索更多</p>
        <svg class="prompt-arrow" width="80" height="82" viewBox="0 0 344 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M37.672 289.835C39.7918 287.724 43.7336 285.594 43.7036 283.511C43.6046 275.787 49.6213 273.44 54.1381 269.647C61.5939 275.09 63.0183 279.165 60.1401 286.675C53.9399 302.868 47.7906 319.078 41.5766 335.268C40.6154 337.778 39.6959 340.381 38.2513 342.61C35.7679 346.437 33.4659 350.871 27.5616 349.733C22.0816 348.683 20.6319 344.15 18.9567 339.823C17.1701 335.222 15.441 330.6 13.6831 325.988C7.82257 310.6 -0.450247 295.847 1.12646 278.5C1.25735 277.059 1.73633 275.644 2.24651 273.353C8.36797 276.374 10.9248 281.166 12.904 286.485C14.7355 291.416 16.6645 296.314 18.5492 301.226C19.332 301.177 20.108 301.126 20.8909 301.077C22.5217 293.761 24.6594 286.515 25.6986 279.115C29.2973 253.463 35.3608 228.541 46.81 205.173C53.0159 192.508 58.7286 179.475 66.2817 167.637C72.6275 157.681 80.4366 148.258 89.1588 140.315C102.56 128.113 117.584 118.044 136.002 114.257C157.929 109.746 177.981 114.401 196.88 125.622C199.172 126.984 201.341 128.557 202.098 129.059C205.802 117.944 210.212 106.607 213.336 94.9222C220.372 68.581 231.18 44.3053 248.598 23.0365C257.521 12.1357 268.8 5.40749 281.871 1.13536C283.299 0.666927 284.921 0.483524 286.42 0.592836C305.076 1.95057 322.625 6.97103 338.482 17.0775C343.396 20.2112 343.212 20.4986 343.412 28.5781C338.239 31.3367 333.999 28.1875 329.404 26.416C319.382 22.5539 309.489 17.3684 299.074 15.747C283.294 13.2949 269.666 19.1903 259.185 31.9307C241.671 53.2256 232.082 78.1687 225.327 104.389C222.469 115.483 220.445 126.807 218.451 138.103C218.05 140.372 218.753 143.59 220.197 145.324C237.386 165.916 249.454 189.346 258.462 214.391C267.97 240.817 272.088 268.108 267.911 296.056C266.873 303.023 263.594 310.111 259.735 316.104C252.074 327.998 239.41 329.437 228.267 320.59C219.29 313.463 213.064 304.246 208.845 293.683C202.944 278.903 200.022 263.348 198.678 247.635C196.229 218.989 196.175 190.193 201.151 161.872C203.315 149.556 196.626 143.904 189.043 138.616C183.182 134.529 175.923 131.914 168.913 130.095C146.021 124.161 125.321 129.949 107.388 144.593C80.7435 166.35 63.8132 194.499 53.4629 227.271C48.9434 241.583 44.7075 255.79 42.3507 270.593C41.8091 273.981 41.2613 278.249 39.0403 280.296C35.3968 283.66 36.974 286.695 37.5985 290.082C37.996 290.932 38.3892 291.785 38.7798 292.634C38.4472 292.715 38.1147 292.796 37.7777 292.88C37.7412 291.856 37.7028 290.839 37.6663 289.815L37.672 289.835ZM217.035 166.435C216.098 166.894 215.154 167.352 214.217 167.811C210.113 204.215 209.345 240.554 217.648 276.63C220.162 287.546 223.599 298.099 231.823 306.519C235.932 310.725 239.988 313.292 246.225 311.407C256.199 297.757 256.274 281.914 254.89 266.224C252.852 243.09 247.206 220.604 237.099 199.66C231.5 188.062 223.792 177.482 217.037 166.439L217.035 166.435Z" fill="#FFDA3D"/>
        </svg>
      </div>

    </section>

    <section ref="gallerySectionRef" class="gallery-section">
      <div ref="starBgRef" class="star-background"></div>

      <div class="gallery-images-container">
        <!-- 画廊介绍文字部分加字体类 -->

        <svg class="decor-image-svg decor-image-svg-1" viewBox="0 0 96 92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M63.5198 22.5582C55.1303 12.0661 52.7744 -0.0111616 37.7386 1.06737C22.7028 2.14589 31.2958 37.6035 31.2958 37.6035C31.2958 37.6035 -2.00648 41.6545 1.2202 54.7982C4.13384 66.6668 31.2958 63.3956 31.2958 63.3956C31.2958 63.3956 24.0157 82.2306 31.2958 89.1876C41.2462 98.6962 59.2232 67.6942 59.2232 67.6942C59.2232 67.6942 77.3126 81.6847 86.0765 75.2169C96.0105 67.8855 77.4814 45.1286 77.4814 45.1286C77.4814 45.1286 97.8141 32.062 94.6695 22.5582C90.8466 11.0039 63.5198 22.5582 63.5198 22.5582Z"/>
      </svg>
      <svg class="decor-image-svg decor-image-svg-2" viewBox="0 0 78 69" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5997 59.4874L1.73438 44.9688"/>
        <path d="M35.7505 50.9458L22.8047 15.793"/>
        <path d="M55.6797 50.2842L52.9453 4.88281"/>
      </svg>
      <svg class="decor-image-svg decor-image-svg-3" viewBox="0 0 174 184" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.45259 64.744L25.3428 38.8321"/>
        <path d="M36.3017 75.5169L83.9507 43.1994"/>
        <path d="M63.3475 101.158L142.719 62.6467"/>
        <path d="M91.905 128.979L135.549 110.25M84.3691 163.327L134.465 150.779"/>
      </svg>
      <svg class="decor-image-svg decor-image-svg-4" viewBox="0 0 288 209" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M126.902 169.412C129.125 163.408 131.512 157.462 133.534 151.388C136.889 141.307 139.815 131.077 143.274 121.034C147.673 108.266 152.397 95.6158 157.026 82.9273C161.491 70.6841 165.877 58.409 170.544 46.2421C175.886 32.3166 180.064 17.9141 187.339 4.75822C189.032 1.69264 190.58 -0.740111 194.415 0.207547C197.366 0.935782 199.066 4.39251 198.788 8.47571C197.83 22.6238 196.609 36.7592 196.001 50.9232C195.071 72.6207 194.594 94.3406 193.869 116.048C193.648 122.684 193.238 129.318 192.847 137.415C194.547 135.487 195.594 134.81 195.878 133.897C199.403 122.586 202.711 111.204 206.293 99.9089C208.702 92.3149 211.411 84.8163 214.063 77.3018C217.103 68.6934 220.114 60.0722 223.368 51.5465C224.56 48.4205 226.102 45.3199 228.038 42.6137C230.577 39.0616 234.985 39.4209 236.373 43.5709C237.952 48.2901 239.003 53.4291 239.025 58.3931C239.088 72.9324 238.422 87.4748 238.243 102.02C238.088 114.512 238.211 127.009 238.211 140.118C239.189 139.532 240.239 139.288 240.475 138.702C242.834 132.921 244.994 127.057 247.346 121.273C248.891 117.476 250.799 113.825 252.3 110.012C258.036 95.4154 263.523 80.7204 269.423 66.1938C271.318 61.5255 274.064 57.1815 276.694 52.8567C278.135 50.4875 280.51 48.9674 283.43 49.6289C286.678 50.3635 287.122 53.2128 287.188 55.9477C287.485 68.0764 287.857 80.2116 287.869 92.3435C287.882 102.427 287.283 112.508 287.245 122.592C287.22 129.331 287.712 136.073 287.964 142.814C287.992 143.542 288.037 144.283 287.945 145.002C287.592 147.788 285.943 149.454 283.225 149.521C280.598 149.585 279.324 147.664 279.128 145.276C278.51 137.787 277.605 130.282 277.621 122.786C277.65 109.732 278.309 96.6779 278.655 83.6238C278.75 80.1193 278.668 76.6117 277.476 72.7448C275.691 76.1442 273.553 79.4038 272.182 82.9623C266.629 97.3775 261.479 111.955 255.838 126.335C252.489 134.867 248.541 143.161 244.76 151.518C244.18 152.803 243.08 153.852 242.184 154.984C240.1 157.621 237.823 159.239 234.118 157.907C230.719 156.686 229.962 154.11 229.864 151.127C229.309 133.92 228.619 116.712 228.439 99.4986C228.338 90.0475 229.205 80.59 229.495 71.1325C229.543 69.5965 228.855 68.0351 228.117 64.766C226.124 69.7491 224.532 73.1391 223.394 76.6753C218.582 91.6375 213.795 106.612 209.213 121.648C206.186 131.576 203.651 141.66 200.636 151.591C198.955 157.128 196.717 162.492 194.78 167.956C193.68 171.063 191.665 172.952 188.31 172.481C184.63 171.966 183.996 168.875 183.901 165.905C183.621 156.972 183.331 148.033 183.447 139.1C183.599 127.512 184.214 115.93 184.494 104.345C184.772 92.8364 184.646 81.3119 185.147 69.8159C185.579 59.9132 186.654 50.0423 187.417 40.1555C187.616 37.5733 187.72 34.9847 186.717 31.8142C185.787 32.9145 184.463 33.8653 183.99 35.1405C178.538 49.842 173.209 64.5911 167.861 79.3307C164.802 87.7578 161.702 96.1723 158.741 104.634C153.567 119.425 148.449 134.238 143.378 149.063C140.487 157.516 136.722 165.838 135.186 174.545C133.477 184.26 129.084 192.849 126.382 202.097C125.433 205.35 124.31 209.351 120.242 208.975C116.121 208.597 115.872 204.231 115.276 200.978C114.8 198.383 114.907 195.648 114.995 192.983C115.705 172.014 116.458 151.044 117.228 130.078C117.865 112.734 118.407 95.3836 119.262 78.0491C119.735 68.458 120.778 58.8924 121.516 49.3141C121.646 47.635 121.535 45.9337 120.34 43.8634C119.11 47.2089 117.862 50.5448 116.654 53.8965C113.292 63.2141 109.966 72.5476 106.588 81.862C101.152 96.8496 95.3595 111.716 90.3142 126.838C84.3418 144.741 78.9843 162.855 73.3966 180.889C71.6812 186.419 70.1613 192.013 68.4049 197.53C67.4936 200.389 66.1093 203.264 62.4798 202.8C59.1499 202.374 57.8665 199.903 57.5165 196.605C56.8291 190.124 55.6466 183.694 55.0664 177.207C53.4204 158.889 51.7617 140.566 50.5099 122.22C49.2107 103.175 48.3845 84.0976 47.3313 65.0331C47.2682 63.8692 47.0223 62.7149 46.7101 60.4411C43.9636 67.1479 41.5008 72.7511 39.3597 78.4752C35.2131 89.5609 31.0728 100.653 27.251 111.853C20.7772 130.829 14.521 149.88 8.26171 168.932C7.33779 171.743 5.64446 173.184 2.9263 172.297C0.309051 171.441 -0.548652 169.377 0.33743 166.48C4.28223 153.56 7.88962 140.531 12.0236 127.674C15.4954 116.878 19.3645 106.199 23.3535 95.584C28.2632 82.5171 33.4977 69.5742 38.5651 56.5678C40.5643 51.4383 42.4311 46.258 44.4776 41.1477C45.7168 38.0535 46.7795 33.9544 50.9009 34.46C55.0916 34.9752 55.0538 38.8739 55.202 42.4579C55.9399 60.1931 56.6431 77.9346 57.8192 95.6444C58.7337 109.401 60.405 123.104 61.5843 136.845C62.2244 144.315 62.483 151.817 63.0254 159.3C63.3722 164.073 63.9209 168.834 65.4566 173.724C66.0116 172.319 66.6328 170.939 67.1121 169.508C73.8759 149.333 80.4537 129.095 87.4194 108.991C94.0414 89.8726 101.048 70.8908 107.916 51.8581C111.905 40.8042 115.897 29.7503 120.003 18.7409C120.841 16.4895 121.86 14.1362 123.408 12.3808C124.477 11.1692 126.659 10.2883 128.239 10.4283C129.39 10.5332 131.036 12.4094 131.304 13.7355C132.017 17.2527 132.534 20.9225 132.364 24.4937C131.128 50.8278 129.734 77.1523 128.321 103.477C127.687 115.278 126.656 127.06 126.246 138.868C125.896 148.961 126.174 159.074 126.174 169.18C126.413 169.263 126.653 169.349 126.893 169.431L126.902 169.412Z"/>
      </svg>
        <div
          v-for="(text, index) in galleryTexts"
          :key="`prose-${index}`"
          class="gallery-prose chinese-font"
          :ref="el => { if (el) galleryTextRefs[index] = el as HTMLElement }"
          :style="{ top: `${20 + index * 20}%` }"
        >
          <p v-html="splitTextIntoWords(text)"></p>
        </div>
        
        <div
          v-for="(image, index) in galleryImages"
          :key="image.id"
          class="gallery-image-wrapper"
          :ref="el => { if (el) galleryImageRefs[index] = el as HTMLElement }"
          :style="image.style"
        >
          <img :src="image.src" :alt="`YMTV 活动照片 ${image.id + 1}`" draggable="false" class="gallery-image" />
          <div class="glass-sheen"></div>
        </div>
      </div>
    </section>

    <section ref="ctaSectionRef" class="cta-section">
      <video class="cta-video-bg" autoplay loop muted playsinline>
        <source :src="ctaVideoUrl" type="video/webm">
      </video>
      <div class="cta-content-wrapper">
        <div class="glass-panel">
          <h2 class="chinese-font">YMTV期待你的加入</h2>
          <p class="chinese-font">如果你对电视节目制作充满热情...立即下载报名表...</p>
          <Button as-child size="lg" class="mt-6">
            <a href="/src/assets/R.pdf" download="YMTV招新报名表.pdf" class="chinese-font">下载报名表</a>
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 基本样式 */
.main-container {
  overflow-x: hidden; 
  background-color: #ffffff; 
}
.hero-section { 
  height: 100vh; 
  width: 100vw; 
  position: relative; 
  color: white; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  text-align: center; 
  perspective: 1000px; 
}
.hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; z-index: -1; }
.hero-content { width: 100%; height: 100%; position: relative; }
.hero-title { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); transform-style: preserve-3d; }
.hero-title h1 { 
  font-family: 'SmileySans-Oblique', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: clamp(2.5rem, 9vw, 7rem);
  color: #fff;
  text-align: center;
  white-space: nowrap;
  text-shadow:
    0 2px 12px rgba(141, 141, 141, 0.7);
  
  letter-spacing: 0.04em;
  line-height: 1.1;
}
.hero-title p { font-size: clamp(1.2rem, 3vw, 2rem); margin-top: 1rem; }
.hero-decor-text { position: absolute; font-size: clamp(8rem, 15vw, 15rem); font-weight: 800; opacity: 0.2; white-space: nowrap; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.hero-decor-text span { display: inline-block; }
.decor-svg { position: absolute; width: clamp(80px, 12vw, 150px); height: auto; opacity: 0.4; bottom: 10%; right: 10%; }

.scroll-prompt {
  position: absolute; bottom: 5vh; left: 50%; transform: translateX(-50%);
  z-index: 10; display: flex; flex-direction: column; align-items: center;
  gap: 0.5rem; color: #FFDA3D; text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  opacity: 0; pointer-events: none;
}
.scroll-prompt p { font-size: 1rem; font-weight: 500; letter-spacing: 0.1em; }
.prompt-arrow { width: 50px; height: auto; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4)); }
.introduction-text {

  margin-bottom: 3rem;

  z-index: 999;
}
.introduction-text p {
  font-family: 'SmileySans-Oblique', sans-serif;
  font-weight: 500;
  color: #FFDA3D;
  text-align: right;
  line-height: 1.5;
  text-shadow: 0 2px 10px rgba(0,0,0,0.7);
  letter-spacing: 0.02em;
  margin: 0;
  white-space: pre-line;
}
.introduction-text p > * {
  font-size: clamp(2rem, 5vw, 6rem);
  margin-bottom: 0.3em;
}
/* 画廊部分样式 */
.gallery-section { 
  position: relative; width: 100%; padding: 10vh 0; background-color: #111827; 
}
.gallery-images-container { 
  position: relative; width: 100%; height: 800vh; 
  perspective: 800px; transform-style: preserve-3d; 
}

/* 新增：动态星空背景样式 */
.star-background {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0; overflow: hidden; /* 最低层，作为背景 */
  pointer-events: none; /* 确保不阻挡鼠标事件 */
}
.star-background :deep(.star) {
  position: absolute; background-color: white; border-radius: 50%;
  box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.5);
}

/* 新增：装饰用 SVG 样式 */
.decor-image-svg {
  position: absolute;
  fill: none;
  stroke: #e3e3e3;
  stroke-width: 3px;
  stroke-linecap: round;
  filter: grayscale(100%);
  opacity: 0.55;
  z-index: 1; /* 在星空背景之上，在图片和文字之下 */
  pointer-events: none;
  transform: translateZ(-100px); /* 3D 空间中后退 */
}
/* 各个 SVG 的具体定位 */
.decor-image-svg-1 {
  width: clamp(100px, 15vw, 400px);
  height: auto;
  top: 14%;
  left: 30%;
  transform: rotate(90deg) translateZ(-80px);
}
.decor-image-svg-2 {
  width: clamp(100px, 15vw, 400px);
  height: auto;
  top: 38%;
  left: 70%;
  transform: rotate(90deg) translateZ(-80px);
}
.decor-image-svg-3 {
  width: clamp(100px, 15vw, 400px);
  height: auto;
  top: 58%;
  left: 35%;
  transform: rotate(-90deg)
}
.decor-image-svg-4 {
  width: clamp(100px, 35vw, 400px);
  height: auto;
  top: 81%;
  left: 40%;
  
}

/* 图片包装器样式 */
.gallery-image-wrapper {
  position: absolute; z-index: 10;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); border-radius: 24px;
  overflow: hidden; transition: box-shadow 0.3s ease;
  cursor: grab; border: 1px solid rgba(255, 255, 255, 0.15);
  background-color: rgba(255, 255, 255, 0.05);
}
.gallery-image {
  display: block; width: 100%; height: 100%;
  object-fit: cover; user-select: none; -webkit-user-drag: none;
}

/* 新增：玻璃光泽效果样式 */
.glass-sheen {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; --sheen-x: -100%; --sheen-y: -100%;
  background: radial-gradient(
    circle at var(--sheen-x) var(--sheen-y),
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0) 50%
  );
  opacity: 0.8;
}

@media (min-width: 769px) { .gallery-image-wrapper:active { cursor: grabbing; } }

/* 重要的修改：文字块样式，用于逐词飞入动画 */
.gallery-prose {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  text-align: center;
  z-index: 100; /* 确保文字总是在最上层 */
  pointer-events: none; /* 确保不影响图片拖拽 */
  overflow: hidden; /* 隐藏动画前溢出的文字 */
}
.gallery-prose p {
  color: white;
  font-size: clamp(1.2rem, 3vw, 2.2rem);
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
  font-weight: 600;
  display: inline-block; /* 关键：使内部的 span 能够正确排列 */
  transform-style: preserve-3d; /* 启用 3D 转换 */
}
/* 单个词语的样式，是动画的主体 */
.gallery-prose p .word {
  display: inline-block; /* 关键：使每个词都能单独进行转换 */
  opacity: 0; /* 默认隐藏 */
  transform: translateY(100%) rotateX(-90deg); /* 初始动画状态 */
  will-change: transform, opacity, width; /* 优化动画性能 */
}
/* 保留空格的样式 */
.gallery-prose p .whitespace-pre {
  width: auto !important;
  margin: 0;
  padding: 0;
  opacity: 1; /* 空格不进行动画，立即显示 */
  transform: none; /* 空格不进行转换 */
}

/* CTA 部分样式 */
.cta-section { 
  height: 100vh; width: 100vw; position: relative; display: flex;
  justify-content: center; align-items: center; z-index: 2;
}
.cta-video-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; }
.cta-content-wrapper { width: 90%; max-width: 800px; padding: 2rem; }
.glass-panel { 
  padding: clamp(1.5rem, 5vw, 4rem); 
  background-color: rgba(255, 255, 255, 0.4); 
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); 
  border-radius: 3rem; text-align: center; 
  mask-image: radial-gradient(circle at 50% 50%, black 50%, transparent 100%); 
  -webkit-mask-image: radial-gradient(circle at 50% 50%, black 50%, transparent 100%); 
}
.glass-panel h2 { font-size: clamp(2rem, 5vw, 3rem); font-weight: bold; margin-bottom: 1rem; color: #1f2937; }
.glass-panel p { font-size: clamp(1rem, 2vw, 1.2rem); line-height: 1.8; color: #374151; }

/* 新增字体声明 */
@font-face {
  font-family: 'SmileySans-Oblique';
  src: url('/src/assets/SmileySans-Oblique.ttf.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+4E00-9FFF; /* 仅作用于常用汉字 */
}

/* 新增字体类，专用于中文区域 */
.chinese-font {
  font-family: 'SmileySans-Oblique', sans-serif !important;
  font-weight: normal;
  font-style: oblique;
  letter-spacing: 0.02em;
}
</style>