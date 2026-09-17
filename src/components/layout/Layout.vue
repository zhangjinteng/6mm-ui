<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

import type { LayoutProps } from './types'

defineOptions({ name: 'MmLayout' })

const props = withDefaults(defineProps<LayoutProps>(), {
  align: 'stretch',
  as: 'div',
  direction: 'row',
  gap: 0,
  inline: false,
  justify: 'start',
  wrap: false,
})

const gapValue = computed(() => (typeof props.gap === 'number' ? `${props.gap}px` : props.gap))
const styles = computed<CSSProperties>(() =>
  ({ '--mm-layout-gap': gapValue.value }) as CSSProperties,
)
</script>

<template>
  <component
    :is="as"
    class="mm-layout"
    :class="[
      `mm-layout--${direction}`,
      `is-align-${align}`,
      `is-justify-${justify}`,
      { 'is-inline': inline, 'is-wrap': wrap },
    ]"
    data-mm-component="layout"
    :style="styles"
  >
    <slot />
  </component>
</template>

<style src="./layout.css"></style>
