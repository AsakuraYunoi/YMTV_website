<script lang="ts" setup>
import type { DrawerRootEmits, DrawerRootProps } from 'vaul-vue'
import { useForwardPropsEmits } from 'reka-ui'
import { DrawerRoot } from 'vaul-vue'

const props = withDefaults(defineProps<DrawerRootProps>(), {
  shouldScaleBackground: true,
})

const emits = defineEmits<DrawerRootEmits>()

// 使用 any 类型断言来解决 TypeScript 的类型推断问题
const forwarded = useForwardPropsEmits(props, emits) as any

</script>

<template>
  <DrawerRoot
    data-slot="drawer"
    v-bind="forwarded"
  >
    <slot />
  </DrawerRoot>
</template>