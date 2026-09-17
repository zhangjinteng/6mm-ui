<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

import type { BorderProps } from './types'

defineOptions({ name: 'MmBorder' })

const props = withDefaults(defineProps<BorderProps>(), {
  as: 'div',
  background: 'transparent',
  color: 'var(--mm-color-line)',
  interactive: false,
  padding: 0,
  radius: 'md',
  styleType: 'solid',
  width: 1,
})

function cssValue(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

const radiusValue = computed(() => {
  if (props.radius === 'none') return '0'
  if (['sm', 'md', 'lg', 'xl', 'round'].includes(props.radius)) {
    return `var(--mm-radius-${props.radius})`
  }
  return props.radius
})
const styles = computed<CSSProperties>(() =>
  ({
    '--mm-border-background': props.background,
    '--mm-border-color': props.color,
    '--mm-border-padding': cssValue(props.padding),
    '--mm-border-radius': radiusValue.value,
    '--mm-border-style': props.styleType,
    '--mm-border-width': cssValue(props.width),
  }) as CSSProperties,
)
</script>

<template>
  <component
    :is="as"
    class="mm-border"
    :class="{ 'is-interactive': interactive }"
    data-mm-component="border"
    :style="styles"
  >
    <slot />
  </component>
</template>

<style src="./border.css"></style>
