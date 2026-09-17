<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmIcon } from '../icon'
import type { LoadingProps } from './types'

defineOptions({ name: 'MmLoading' })

const props = withDefaults(defineProps<LoadingProps>(), {
  backdrop: true,
  fullscreen: false,
  size: 'md',
  visible: true,
})
const { messages } = useLocale()
const resolvedText = computed(() => props.text ?? messages.value.common.loading)
</script>

<template>
  <Teleport to="body" :disabled="!fullscreen">
    <div
      v-if="visible"
      class="mm-loading"
      :class="[`mm-loading--${size}`, { 'has-backdrop': backdrop, 'is-fullscreen': fullscreen }]"
      data-mm-component="loading"
      role="status"
      aria-live="polite"
      :aria-label="resolvedText || messages.common.loading"
    >
      <div class="mm-loading__indicator">
        <slot name="icon"><MmIcon name="loading" spin /></slot>
        <span v-if="resolvedText" class="mm-loading__text">{{ resolvedText }}</span>
      </div>
    </div>
  </Teleport>
</template>

<style src="./loading.css"></style>
