<script setup lang="ts">
import { computed } from 'vue'

import type { ResultProps } from './types'

defineOptions({ name: 'MmResult' })

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info',
  subtitle: undefined,
  title: undefined,
})
const symbol = computed(() => ({ error: '×', info: 'i', success: '✓', warning: '!' })[props.status])
</script>

<template>
  <section class="mm-result" :class="`mm-result--${status}`" data-mm-component="result" role="status">
    <div class="mm-result__icon" aria-hidden="true"><slot name="icon">{{ symbol }}</slot></div>
    <h2 v-if="title || $slots.title" class="mm-result__title"><slot name="title">{{ title }}</slot></h2>
    <p v-if="subtitle || $slots.subtitle" class="mm-result__subtitle"><slot name="subtitle">{{ subtitle }}</slot></p>
    <div v-if="$slots.default" class="mm-result__content"><slot /></div>
    <div v-if="$slots.extra" class="mm-result__extra"><slot name="extra" /></div>
  </section>
</template>

<style src="./result.css"></style>
