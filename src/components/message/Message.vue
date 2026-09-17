<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmIcon } from '../icon'
import type { IconName } from '../icon'
import type { MessageProps } from './types'

defineOptions({ name: 'MmMessage' })

const props = withDefaults(defineProps<MessageProps>(), {
  closable: true,
  duration: 3000,
  showIcon: true,
  type: 'info',
})
const emit = defineEmits<{ close: [] }>()
const { messages } = useLocale()
let timer: ReturnType<typeof setTimeout> | undefined
let closed = false
const urgent = computed(() => props.type === 'error' || props.type === 'warning')
const iconName = computed<IconName>(() => props.type === 'success' ? 'check' : props.type === 'info' ? 'info' : 'alert')

function stopTimer(): void {
  if (timer) clearTimeout(timer)
  timer = undefined
}

function close(): void {
  if (closed) return
  closed = true
  stopTimer()
  emit('close')
}

function startTimer(): void {
  stopTimer()
  if (!closed && props.duration > 0) timer = setTimeout(close, props.duration)
}

onMounted(startTimer)
onBeforeUnmount(stopTimer)
</script>

<template>
  <div
    class="mm-message"
    :class="`mm-message--${type}`"
    data-mm-component="message"
    :role="urgent ? 'alert' : 'status'"
    :aria-live="urgent ? 'assertive' : 'polite'"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
  >
    <MmIcon v-if="showIcon" class="mm-message__icon" :name="iconName" :size="16" />
    <div class="mm-message__content"><slot>{{ message }}</slot></div>
    <button v-if="closable" class="mm-message__close" type="button" :aria-label="messages.message.close" @click="close">
      <MmIcon name="close" :size="13" />
    </button>
  </div>
</template>

<style src="./message.css"></style>
