<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

import type { TextProps } from './types'

defineOptions({ name: 'MmText' })

const props = withDefaults(defineProps<TextProps>(), {
  as: 'span',
  lineClamp: undefined,
  size: 'md',
  tone: 'default',
  truncate: false,
  weight: 'regular',
})

const classes = computed(() => [
  'mm-text',
  `mm-text--${props.size}`,
  `mm-text--${props.tone}`,
  `is-${props.weight}`,
  { 'is-clamped': props.lineClamp !== undefined, 'is-truncated': props.truncate },
])
const styles = computed<CSSProperties>(() =>
  props.lineClamp === undefined
    ? {}
    : ({ '--mm-text-lines': props.lineClamp } as CSSProperties),
)
</script>

<template>
  <component :is="as" :class="classes" data-mm-component="text" :style="styles">
    <slot />
  </component>
</template>

<style src="./text.css"></style>
