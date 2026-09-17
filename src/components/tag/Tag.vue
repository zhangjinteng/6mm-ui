<script setup lang="ts">
import { useLocale } from '../../composables/use-locale'
import type { TagProps } from './types'

defineOptions({ name: 'MmTag' })

const props = withDefaults(defineProps<TagProps>(), {
  closable: false,
  disabled: false,
  effect: 'soft',
  round: false,
  size: 'md',
  type: 'default',
})
const emit = defineEmits<{ close: [event: MouseEvent] }>()
const { messages } = useLocale()

function close(event: MouseEvent): void {
  if (!props.disabled) emit('close', event)
}
</script>

<template>
  <span
    class="mm-tag"
    :class="[`mm-tag--${type}`, `mm-tag--${size}`, `mm-tag--${effect}`, { 'is-disabled': disabled, 'is-round': round }]"
    data-mm-component="tag"
  >
    <span v-if="$slots.icon" class="mm-tag__icon" aria-hidden="true"><slot name="icon" /></span>
    <span class="mm-tag__label"><slot /></span>
    <button v-if="closable" class="mm-tag__close" type="button" :disabled="disabled" :aria-label="messages.tag.close" @click="close">×</button>
  </span>
</template>

<style src="./tag.css"></style>
