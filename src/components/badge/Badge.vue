<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '../../composables/use-locale'
import type { BadgeProps } from './types'

defineOptions({ name: 'MmBadge' })

const props = withDefaults(defineProps<BadgeProps>(), {
  ariaLabel: undefined,
  dot: false,
  hidden: false,
  max: 99,
  showZero: true,
  type: 'danger',
  value: '',
})
const { messages } = useLocale()
const visible = computed(() => !props.hidden && (props.dot || props.showZero || props.value !== 0))
const displayValue = computed(() => typeof props.value === 'number' && props.value > props.max ? `${props.max}+` : String(props.value))
const accessibleLabel = computed(() => props.ariaLabel || (props.dot
  ? messages.value.badge.status
  : messages.value.badge.notifications(props.value)))
</script>

<template>
  <span class="mm-badge" :class="`mm-badge--${type}`" data-mm-component="badge">
    <slot />
    <sup v-if="visible" class="mm-badge__content" :class="{ 'is-dot': dot }" role="status" :aria-label="accessibleLabel">{{ dot ? '' : displayValue }}</sup>
  </span>
</template>

<style src="./badge.css"></style>
