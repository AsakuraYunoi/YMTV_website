import { ref } from 'vue';
import type { ScrollSmoother } from 'gsap/ScrollSmoother';

// 明确指定类型为 ScrollSmoother | null
export const smoother = ref<ScrollSmoother | null>(null);

