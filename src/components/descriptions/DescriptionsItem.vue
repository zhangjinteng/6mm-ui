<script setup lang="ts">
import { computed, inject } from 'vue'

import { descriptionsKey, type DescriptionsItemProps } from './types'

defineOptions({ name: 'MmDescriptionsItem' })

const props = withDefaults(defineProps<DescriptionsItemProps>(), { label: undefined, span: 1 })
const context = inject(descriptionsKey, { bordered: false, column: 3, direction: 'horizontal' })
const safeSpan = computed(() => Math.min(context.column, Math.max(1, Math.floor(props.span))))
</script>

<template>
  <div
    class="mm-descriptions-item"
    :class="[`mm-descriptions-item--${context.direction}`, { 'is-bordered': context.bordered }]"
    :style="{ '--mm-descriptions-span': safeSpan }"
  >
    <div class="mm-descriptions-item__label"><slot name="label">{{ label }}</slot></div>
    <div class="mm-descriptions-item__content"><slot /></div>
  </div>
</template>
