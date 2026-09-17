<script setup lang="ts">
import { computed, provide } from 'vue'

import { descriptionsKey, type DescriptionsProps } from './types'

defineOptions({ name: 'MmDescriptions' })

const props = withDefaults(defineProps<DescriptionsProps>(), {
  bordered: false,
  column: 3,
  direction: 'horizontal',
  size: 'md',
  title: undefined,
})
const columns = computed(() => Math.max(1, Math.floor(props.column)))
provide(descriptionsKey, {
  get bordered() { return props.bordered },
  get column() { return columns.value },
  get direction() { return props.direction },
})
</script>

<template>
  <section
    class="mm-descriptions"
    :class="[`mm-descriptions--${direction}`, `mm-descriptions--${size}`, { 'is-bordered': bordered }]"
    :style="{ '--mm-descriptions-columns': columns }"
    data-mm-component="descriptions"
  >
    <header v-if="title || $slots.title || $slots.extra" class="mm-descriptions__header">
      <h3 v-if="title || $slots.title" class="mm-descriptions__title"><slot name="title">{{ title }}</slot></h3>
      <div v-if="$slots.extra" class="mm-descriptions__extra"><slot name="extra" /></div>
    </header>
    <div class="mm-descriptions__grid"><slot /></div>
  </section>
</template>

<style src="./descriptions.css"></style>
