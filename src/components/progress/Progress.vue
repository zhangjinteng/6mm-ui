<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '../../composables/use-locale'
import type { ProgressProps } from './types'

defineOptions({ name: 'MmProgress' })

const props = withDefaults(defineProps<ProgressProps>(), {
  color: undefined,
  format: undefined,
  percentage: 0,
  showText: true,
  size: 96,
  status: 'normal',
  strokeWidth: 6,
  type: 'line',
})
const { messages } = useLocale()
const resolvedAriaLabel = computed(() => props.ariaLabel ?? messages.value.progress.label)
const value = computed(() => Math.min(100, Math.max(0, props.percentage)))
const text = computed(() => props.format?.(value.value) ?? `${value.value}%`)
const radius = computed(() => 50 - props.strokeWidth / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const circleOffset = computed(() => circumference.value * (1 - value.value / 100))
const rootStyle = computed(() => ({
  '--mm-progress-color': props.color || undefined,
  '--mm-progress-size': `${props.size}px`,
  '--mm-progress-stroke': `${props.strokeWidth}px`,
}))
</script>

<template>
  <div
    class="mm-progress"
    :class="[`mm-progress--${type}`, `is-${status}`]"
    :style="rootStyle"
    data-mm-component="progress"
    role="progressbar"
    :aria-label="resolvedAriaLabel"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="value"
    :aria-valuetext="text"
  >
    <template v-if="type === 'line'">
      <div class="mm-progress__track">
        <span class="mm-progress__bar" :style="{ '--mm-progress-value': `${value}%` }" />
      </div>
      <span v-if="showText" class="mm-progress__text"><slot :percentage="value">{{ text }}</slot></span>
    </template>
    <template v-else>
      <svg class="mm-progress__circle" viewBox="0 0 100 100" aria-hidden="true">
        <circle class="mm-progress__circle-track" cx="50" cy="50" :r="radius" />
        <circle
          class="mm-progress__circle-value"
          cx="50"
          cy="50"
          :r="radius"
          :style="{ strokeDasharray: circumference, strokeDashoffset: circleOffset }"
        />
      </svg>
      <span v-if="showText" class="mm-progress__circle-text"><slot :percentage="value">{{ text }}</slot></span>
    </template>
  </div>
</template>

<style src="./progress.css"></style>
