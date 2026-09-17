<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { AvatarProps } from './types'

defineOptions({ name: 'MmAvatar' })

const props = withDefaults(defineProps<AvatarProps>(), {
  alt: '',
  fallback: undefined,
  fit: 'cover',
  shape: 'circle',
  size: 'md',
  src: undefined,
})
const emit = defineEmits<{ error: [event: Event]; load: [event: Event] }>()
const failed = ref(false)
const numericSize = computed(() => typeof props.size === 'number' ? `${props.size}px` : undefined)
const rootStyle = computed(() => numericSize.value ? { '--mm-avatar-size': numericSize.value } : undefined)
watch(() => props.src, () => { failed.value = false })

function onError(event: Event): void {
  failed.value = true
  emit('error', event)
}
</script>

<template>
  <span
    class="mm-avatar"
    :class="[`mm-avatar--${shape}`, typeof size === 'string' && `mm-avatar--${size}`]"
    :style="rootStyle"
    data-mm-component="avatar"
  >
    <img v-if="src && !failed" class="mm-avatar__image" :src="src" :alt="alt" :style="{ objectFit: fit }" @error="onError" @load="emit('load', $event)">
    <span v-else-if="fallback" class="mm-avatar__fallback" :aria-label="alt || fallback">{{ fallback }}</span>
    <span v-else-if="$slots.icon" class="mm-avatar__icon" :aria-label="alt || undefined"><slot name="icon" /></span>
    <span v-else class="mm-avatar__fallback" :aria-label="alt || undefined"><slot /></span>
  </span>
</template>

<style src="./avatar.css"></style>
