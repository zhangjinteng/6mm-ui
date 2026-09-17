<script setup lang="ts">
import { computed, ref } from 'vue'

import type { SegmentedOption, SegmentedProps, SegmentedValue } from './types'

defineOptions({ name: 'MmSegmented' })

const props = withDefaults(defineProps<SegmentedProps>(), {
  block: false,
  disabled: false,
  modelValue: undefined,
  name: undefined,
  options: () => [],
  size: 'md',
})
const emit = defineEmits<{ change: [value: SegmentedValue]; 'update:modelValue': [value: SegmentedValue] }>()
const rootRef = ref<HTMLElement>()
const normalized = computed<SegmentedOption[]>(() => props.options.map((option) => typeof option === 'object'
  ? option
  : { label: String(option), value: option }))

function selected(option: SegmentedOption): boolean {
  return Object.is(option.value, props.modelValue)
}

function choose(option: SegmentedOption): void {
  if (props.disabled || option.disabled || selected(option)) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

function tabIndex(option: SegmentedOption, index: number): number {
  if (props.disabled || option.disabled) return -1
  if (selected(option)) return 0
  const hasSelection = normalized.value.some(selected)
  return !hasSelection && normalized.value.findIndex((item) => !item.disabled) === index ? 0 : -1
}

function onKeydown(current: HTMLButtonElement, event: KeyboardEvent): void {
  if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  const buttons = Array.from(rootRef.value?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [])
  const index = buttons.indexOf(current)
  if (index < 0) return
  event.preventDefault()
  const target = event.key === 'Home' ? buttons[0]
    : event.key === 'End' ? buttons.at(-1)
      : buttons[(index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length]
  target?.focus()
  target?.click()
}
</script>

<template>
  <div
    ref="rootRef"
    class="mm-segmented"
    :class="[`mm-segmented--${size}`, { 'is-block': block, 'is-disabled': disabled }]"
    data-mm-component="segmented"
    role="radiogroup"
  >
    <button
      v-for="(option, index) in normalized"
      :key="String(option.value)"
      class="mm-segmented__item"
      :class="{ 'is-selected': selected(option) }"
      type="button"
      role="radio"
      :disabled="disabled || option.disabled"
      :aria-checked="selected(option) ? 'true' : 'false'"
      :tabindex="tabIndex(option, index)"
      @click="choose(option)"
      @keydown="onKeydown($event.currentTarget as HTMLButtonElement, $event)"
    >
      <component :is="option.icon" v-if="option.icon" class="mm-segmented__icon" aria-hidden="true" />
      <slot name="option" :option="option" :selected="selected(option)">{{ option.label }}</slot>
    </button>
    <input v-if="name" type="hidden" :name="name" :value="modelValue">
  </div>
</template>

<style src="./segmented.css"></style>
