<template>
  <div class="team-container">
    <div
      class="shell"
      id="shell"
      :style="{
        backgroundColor: configData.config?.Background?.Color,
        '--current-bg-image': `url(${currentBackgroundImage})`,
        '--current-bg-blur': `${currentBackgroundBlur}px`
      }"
    >
      <div class="header">
        <h2 class="title">{{ configData.config?.Title }}</h2>
        <h3 class="subtitle">{{ configData.config?.Content }}</h3>
      </div>
      <div class="timeline">
        <div
          class="item"
          v-for="member in teamMembers"
          :key="member.id"
          :data-year="member.year"
          :id="`item-${member.id}`"
          :style="{
            '--item-margin-top': configData.config?.spacing,
            '--item-margin-bottom': configData.config?.spacing
          }"
        >
          <div class="content">
            <img
              :src="member.image"
              :alt="member.year"
              class="img"
              loading="lazy"
            />
            <h2 class="content-title">{{ member.year }}</h2>
            <p class="content-desc">
              {{ member.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'TeamIntroduction',
  data() {
    return {
      // 配置数据，不再初始化默认值
      configData: {
        config: {
          Background: {} // 确保 Background 对象存在，以防访问 .Blur 报错
        },
        team: []
      },
      teamMembers: [], // 团队成员数据
      currentBackgroundImage: '', // 当前背景图 URL
      currentBackgroundBlur: 0, // 当前背景模糊值
      scrollTriggers: [], // 存储 ScrollTrigger 实例以便销毁
    };
  },
  async mounted() {
    try {
      // 异步加载配置文件
      const response = await fetch('config/about.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const config = await response.json();
      this.configData = config;
      this.teamMembers = config.team;

      // 等待所有图片加载完成再初始化动画，避免卡顿
      await this.waitForImagesToLoad();

      // DOM 更新后初始化 GSAP 动画
      this.$nextTick(() => {
          this.initGsapAnimations();
      });

    } catch (error) {
      console.error('配置加载失败:', error);
      alert('无法加载配置。请检查控制台获取更多信息。');
    }
  },
  beforeUnmount() {
    // 组件销毁前，清除所有 ScrollTrigger 实例
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.scrollTriggers = [];
  },
  methods: {
    /**
     * 等待所有团队成员的图片（包括前景图和背景图）加载完成。
     * @returns {Promise<void>} Promise 在所有图片加载完成后解析。
     */
    waitForImagesToLoad() {
      if (!this.teamMembers.length) {
        return Promise.resolve();
      }

      const imagePromises = this.teamMembers.flatMap(member => {
        const promises = [];
        // 加载前景图
        if (member.image) {
          promises.push(new Promise(resolve => {
            const img = new Image();
            img.src = member.image;
            img.onload = img.onerror = resolve;
          }));
        }
        // 加载背景图
        if (member.background) {
          promises.push(new Promise(resolve => {
            const img = new Image();
            img.src = member.background;
            img.onload = img.onerror = resolve;
          }));
        }
        return promises;
      });

      return Promise.all(imagePromises);
    },

    /**
     * 激活指定时间线项目的动画效果。
     * @param {HTMLElement} item - 目标 DOM 元素。
     * @param {Object} member - 对应的成员数据。
     * @param {boolean} isImmediate - 是否立即完成动画（无过渡）。
     */
    activateItem(item, member, isImmediate = false) {
      const content = item.querySelector('.content');
      const contentTitle = item.querySelector('.content-title');
      const duration = isImmediate ? 0 : 0.6;

      // 更新背景图和模糊值
      this.currentBackgroundImage = member.background || member.image;
      this.currentBackgroundBlur = parseFloat(this.configData.config.Background?.Blur || 0);

      // 前景项目动画 (使用 transform 和 opacity 优化性能)
      gsap.to(item, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: duration,
        ease: "power2.out",
      });
      gsap.to(content, {
          scale: 1.05,
          duration: duration,
          ease: "power2.out"
      });
      gsap.to(item, { '--item-before-opacity': 1, duration: isImmediate ? 0 : 0.4 });
      gsap.to(contentTitle, { margin: "-50px 0 20px 0", duration: duration });
    },

    /**
     * 取消激活指定时间线项目的动画效果。
     * @param {HTMLElement} item - 目标 DOM 元素。
     * @param {boolean} isImmediate - 是否立即完成动画。
     */
    deactivateItem(item, isImmediate = false) {
      const content = item.querySelector('.content');
      const contentTitle = item.querySelector('.content-title');
      const duration = isImmediate ? 0 : 0.6;

      gsap.to(item, {
        opacity: 0.25,
        y: -60,
        filter: "blur(4px)",
        duration: duration,
        ease: "power2.out",
      });
      gsap.to(content, {
          scale: 1,
          duration: duration,
          ease: "power2.out"
      });
      gsap.to(item, { '--item-before-opacity': 0, duration: isImmediate ? 0 : 0.4 });
      gsap.to(contentTitle, { margin: "-10px 0 0 0", duration: duration });
    },

    /**
     * 初始化 GSAP 动画和 ScrollTrigger。
     */
    initGsapAnimations() {
      const items = gsap.utils.toArray('.item');

      if (!items.length) return;

      // 初始动画状态：所有项目非激活
      items.forEach((item) => {
        this.deactivateItem(item, true);
      });

      // 激活第一个项目并设置初始背景
      if (this.teamMembers.length > 0) {
        this.activateItem(items[0], this.teamMembers[0], true);
      } else {
        // 如果没有团队成员，仍设置背景模糊
        this.currentBackgroundBlur = parseFloat(this.configData.config.Background?.Blur || 0);
      }

      // 为每个项目创建 ScrollTrigger
      items.forEach((item, index) => {
        const trigger = ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onToggle: self => {
            if (self.isActive) {
              this.activateItem(item, this.teamMembers[index]);
            } else {
              this.deactivateItem(item);
            }
          },
          // markers: true, // 调试用
        });
        this.scrollTriggers.push(trigger); // 存储实例以便清理
      });
    },
  },
};
</script>

<style scoped>
/* 基础样式重置 */
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 团队容器 */
.team-container {
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* 页面标题（示例，可根据实际需求调整） */
.team-container h1 {
  text-align: center;
  padding: 40px 0;
  color: #000;
  font-size: 2.5rem;
}

/* 背景 Shell */
.shell {
  width: 100%;
  position: relative;
  padding: 80px 0;
  overflow: hidden;
  transition: background-color 1.0s ease-in-out;
}

/* 背景图片层（伪元素） */
.shell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: var(--current-bg-image); /* 使用 Vue 提供的 CSS 变量 */
  background-size: cover;
  background-position: center center;
  background-attachment: fixed; /* 视差滚动效果 */
  filter: blur(var(--current-bg-blur)); /* 使用 Vue 提供的 CSS 变量应用模糊 */
  transition: background-image 1.0s ease-in-out, filter 1.0s ease-in-out;
  will-change: background-image, filter; /* 提示浏览器优化动画 */
  z-index: 0; /* 确保在最底层 */
}

/* 黑色半透明遮罩层（伪元素） */
.shell::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(66, 66, 66, 0.85); /* 85% 透明度深灰色 */
  z-index: 1; /* 在模糊背景之上，内容之下 */
  will-change: background; /* 提示浏览器优化 */
}

/* 头部和时间线内容需要更高的层级 */
.header, .timeline {
  position: relative;
  z-index: 2;
}

/* 头部样式 */
.header {
  width: 100%;
  text-align: center;
  margin-bottom: 80px;
}

.title {
  color: #fff;
  font-size: 46px;
  font-weight: normal;
  margin: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  letter-spacing: 5px;
  margin: 10px 0 0 0;
  font-weight: normal;
}

/* 时间线容器 */
.timeline {
  display: flex;
  margin: 0 auto;
  flex-wrap: wrap;
  flex-direction: column;
  max-width: 80vw;
}

/* 时间线中线 */
.timeline:before {
  position: absolute;
  left: 50%;
  width: 2px;
  height: 100%;
  margin-left: -1px;
  content: "";
  background: rgba(255, 255, 255, 0.07);
  z-index: -1; /* 确保在中线在内容下方 */
}

/* 时间线项目 */
.item {
  padding: 40px 0;
  margin-top: var(--item-margin-top, 3rem);
  margin-bottom: var(--item-margin-bottom, 4rem);
  opacity: 0.3;
  filter: blur(4px);
  transform: translateY(-80px);
  width: calc(50% - 40px);

  display: flex;
  position: relative;
  --item-before-opacity: 0;
  will-change: opacity, transform, filter; /* 提示浏览器优化动画 */
}

.content {
    transition: transform 0.6s ease;
    will-change: transform; /* 提示浏览器优化 */
}

/* 时间线项目年份标签 */
.item:before {
  content: attr(data-year);
  letter-spacing: 3px;
  width: 100%;
  position: absolute;
  color: rgba(255, 255, 255, 0.7);
  border-left: 2px solid rgba(255, 255, 255, 0.5);
  top: 40%;
  margin-top: -5px;
  padding-left: 15px;
  opacity: var(--item-before-opacity);
  right: calc(-50% - 96px);
  font: 900 20px '';
  letter-spacing: 5px;
  transition: opacity 0.4s;
  will-change: opacity; /* 提示浏览器优化 */
}

/* 偶数项目靠右 */
.item:nth-child(even) {
  align-self: flex-end;
}

/* 偶数项目年份标签靠左并调整样式 */
.item:nth-child(even):before {
  right: auto;
  text-align: right;
  left: calc(-100% - 56px);
  padding-left: 0;
  border-left: none;
  border-right: 2px solid rgba(255, 255, 255, 0.5);
  padding-right: 15px;
}

/* 内容标题 */
.content-title {
  font-weight: normal;
  font-size: 66px;
  margin: -10px 0 0 0;
  padding: 0 10px;
  box-sizing: border-box;
  color: #fff;
  will-change: margin;
}

/* 内容描述 */
.content-desc {
  margin: 0;
  font-size: 15px;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.7);
  line-height: 25px;
}

/* 图片样式 */
.img {
  max-width: 100%;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.4);
}

/* 媒体查询：小屏幕适配 */
@media only screen and (max-width: 767px) {
  .item {
    align-self: baseline !important;
    width: 100%;
    padding-left: 60px;
  }

  .item:before {
    left: -30px !important;
    padding: 0 !important;
    top: 90px;
    text-align: center !important;
    width: 60px;
    border: none !important;
  }

  .item:last-child {
    padding-bottom: 40px;
  }
}

/* 媒体查询：小屏幕适配，时间线中线位置 */
@media only screen and (max-width: 767px) {
  .timeline:before {
    left: -10px;
  }
}
</style>