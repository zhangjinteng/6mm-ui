<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

import type { ColorProps } from './types'

defineOptions({ name: 'MmColor' })

const props = withDefaults(defineProps<ColorProps>(), {
  contrast: 'auto',
  label: undefined,
  selectable: false,
  showValue: false,
  size: 'md',
})
const emit = defineEmits<{ select: [value: string] }>()

function autoContrast(color: string): string {
  const match = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!match) return 'var(--mm-color-text)'

  const hex = match[1].length === 3
    ? match[1].split('').map((character) => character.repeat(2)).join('')
    : match[1]
  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)
  return (red * 299 + green * 587 + blue * 114) / 1000 > 166 ? '#172033' : '#ffffff'
}

const contrastColor = computed(() => {
  if (props.contrast === 'light') return '#ffffff'
  if (props.contrast === 'dark') return '#172033'
  return autoContrast(props.value)
})
const styles = computed<CSSProperties>(() =>
  ({
    '--mm-color-contrast': contrastColor.value,
    '--mm-color-value': props.value,
  }) as CSSProperties,
)
</script>

<template>
  <component
    :is="selectable ? 'button' : 'span'"
    class="mm-color"
    :class="[`mm-color--${size}`, { 'is-selectable': selectable }]"
    data-mm-component="color"
    :type="selectable ? 'button' : undefined"
    :aria-label="label || value"
    :style="styles"
    @click="selectable && emit('select', value)"
  >
    <span class="mm-color__chip" aria-hidden="true" />
    <span v-if="label || showValue" class="mm-color__meta">
      <strong v-if="label">{{ label }}</strong>
      <code v-if="showValue">{{ value }}</code>
    </span>
  </component>
</template>

<style src="./color.css"></style>
