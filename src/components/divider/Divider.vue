<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

import type { DividerProps } from './types'

defineOptions({ name: 'MmDivider' })

const props = withDefaults(defineProps<DividerProps>(), {
  align: 'center',
  color: 'var(--mm-color-line)',
  dashed: false,
  direction: 'horizontal',
  label: undefined,
  margin: 16,
})

const marginValue = computed(() =>
  typeof props.margin === 'number' ? `${props.margin}px` : props.margin,
)
const styles = computed<CSSProperties>(() =>
  ({
    '--mm-divider-color': props.color,
    '--mm-divider-margin': marginValue.value,
  }) as CSSProperties,
)
</script>

<template>
  <div
    class="mm-divider"
    :class="[
      `mm-divider--${direction}`,
      `is-align-${align}`,
      { 'is-dashed': dashed, 'is-labeled': label || $slots.default },
    ]"
    data-mm-component="divider"
    role="separator"
    :aria-orientation="direction"
    :style="styles"
  >
    <span v-if="direction === 'horizontal'" class="mm-divider__line" />
    <span v-if="label || $slots.default" class="mm-divider__label"><slot>{{ label }}</slot></span>
    <span v-if="direction === 'horizontal'" class="mm-divider__line" />
  </div>
</template>

<style src="./divider.css"></style>
