<script setup lang="ts">
import { computed } from 'vue'

import type { StatisticProps } from './types'

defineOptions({ name: 'MmStatistic' })

const props = withDefaults(defineProps<StatisticProps>(), {
  decimalSeparator: '.',
  formatter: undefined,
  groupSeparator: ',',
  precision: undefined,
  prefix: undefined,
  suffix: undefined,
  title: undefined,
  trend: 'neutral',
  value: 0,
})

const formatted = computed(() => {
  if (props.formatter) return props.formatter(props.value)
  const numeric = typeof props.value === 'number' ? props.value : Number(props.value)
  if (!Number.isFinite(numeric)) return String(props.value)
  const raw = props.precision === undefined ? String(numeric) : numeric.toFixed(Math.max(0, props.precision))
  const [integer, decimal] = raw.split('.')
  const grouped = integer!.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator)
  return decimal === undefined ? grouped : `${grouped}${props.decimalSeparator}${decimal}`
})
</script>

<template>
  <div class="mm-statistic" :class="`is-trend-${trend}`" data-mm-component="statistic">
    <div v-if="title || $slots.title" class="mm-statistic__title"><slot name="title">{{ title }}</slot></div>
    <div class="mm-statistic__value">
      <span v-if="trend !== 'neutral'" class="mm-statistic__trend" aria-hidden="true">{{ trend === 'up' ? '↗' : '↘' }}</span>
      <span v-if="prefix || $slots.prefix" class="mm-statistic__prefix"><slot name="prefix">{{ prefix }}</slot></span>
      <span class="mm-statistic__number" :title="formatted">{{ formatted }}</span>
      <span v-if="suffix || $slots.suffix" class="mm-statistic__suffix"><slot name="suffix">{{ suffix }}</slot></span>
    </div>
  </div>
</template>

<style src="./statistic.css"></style>
