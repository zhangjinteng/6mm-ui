<script setup lang="ts">
import type { ButtonProps } from './types'

defineOptions({
  inheritAttrs: false,
  name: 'MmButton',
})

const props = withDefaults(defineProps<ButtonProps>(), {
  block: false,
  disabled: false,
  iconOnly: false,
  loading: false,
  nativeType: 'button',
  plain: false,
  round: false,
  size: 'md',
  variant: 'default',
})
const emit = defineEmits<{ click: [event: MouseEvent] }>()

function onClick(event: MouseEvent): void {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    v-bind="$attrs"
    class="mm-button"
    :class="[
      `mm-button--${variant}`,
      `mm-button--${size}`,
      {
        'is-block': block,
        'is-icon-only': iconOnly,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
      },
    ]"
    data-mm-component="button"
    :type="nativeType"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    @click="onClick"
  >
    <span v-if="loading" class="mm-button__loading" aria-hidden="true">
      <slot name="loading"><span class="mm-button__spinner" /></slot>
    </span>
    <span v-else-if="$slots.icon" class="mm-button__icon" aria-hidden="true"><slot name="icon" /></span>
    <span v-if="$slots.default" class="mm-button__label"><slot /></span>
  </button>
</template>

<style src="./button.css"></style>
