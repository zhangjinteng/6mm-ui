<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

import type { ContainerProps } from './types'

defineOptions({ name: 'MmContainer' })

const props = withDefaults(defineProps<ContainerProps>(), {
  as: 'div',
  centered: true,
  fluid: false,
  gutter: 16,
  padded: true,
  size: 'xl',
})

const gutterValue = computed(() =>
  typeof props.gutter === 'number' ? `${props.gutter}px` : props.gutter,
)
const styles = computed<CSSProperties>(() =>
  ({ '--mm-container-gutter': gutterValue.value }) as CSSProperties,
)
</script>

<template>
  <component
    :is="as"
    class="mm-container"
    :class="[
      `mm-container--${size}`,
      { 'is-centered': centered, 'is-fluid': fluid, 'is-padded': padded },
    ]"
    data-mm-component="container"
    :style="styles"
  >
    <slot />
  </component>
</template>

<style src="./container.css"></style>
