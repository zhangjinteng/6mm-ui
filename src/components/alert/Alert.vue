<script setup lang="ts">
import { computed, ref } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmIcon } from '../icon'
import type { IconName } from '../icon'
import type { AlertProps } from './types'

defineOptions({ name: 'MmAlert' })

const props = withDefaults(defineProps<AlertProps>(), {
  banner: false,
  center: false,
  closable: false,
  description: undefined,
  showIcon: true,
  title: undefined,
  type: 'info',
})
const emit = defineEmits<{ close: [] }>()
const { messages } = useLocale()
const visible = ref(true)
const iconName = computed<IconName>(() => props.type === 'success' ? 'check' : props.type === 'info' ? 'info' : 'alert')
const urgent = computed(() => props.type === 'warning' || props.type === 'error')

function close(): void {
  if (!visible.value) return
  visible.value = false
  emit('close')
}
</script>

<template>
  <div
    v-if="visible"
    class="mm-alert"
    :class="[`mm-alert--${type}`, { 'is-banner': banner, 'is-center': center }]"
    data-mm-component="alert"
    :role="urgent ? 'alert' : 'status'"
    :aria-live="urgent ? 'assertive' : 'polite'"
  >
    <MmIcon v-if="showIcon" class="mm-alert__icon" :name="iconName" :size="17" />
    <div class="mm-alert__content">
      <strong v-if="title || $slots.title" class="mm-alert__title"><slot name="title">{{ title }}</slot></strong>
      <div v-if="description || $slots.default" class="mm-alert__description"><slot>{{ description }}</slot></div>
    </div>
    <button v-if="closable" class="mm-alert__close" type="button" :aria-label="messages.alert.close" @click="close">
      <MmIcon name="close" :size="14" />
    </button>
  </div>
</template>

<style src="./alert.css"></style>
