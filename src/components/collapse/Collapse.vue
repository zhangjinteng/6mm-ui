<script setup lang="ts">
import { computed, provide, ref } from 'vue'

import { collapseKey, type CollapseName, type CollapseProps, type CollapseValue } from './types'

defineOptions({ name: 'MmCollapse' })

const props = withDefaults(defineProps<CollapseProps>(), { accordion: false, modelValue: () => [] })
const emit = defineEmits<{ change: [value: CollapseValue]; 'update:modelValue': [value: CollapseValue] }>()
const rootRef = ref<HTMLElement>()
const activeNames = computed<CollapseName[]>(() => Array.isArray(props.modelValue)
  ? props.modelValue
  : props.modelValue === '' || props.modelValue === undefined || props.modelValue === null ? [] : [props.modelValue])

function isActive(name: CollapseName): boolean {
  return activeNames.value.some((active) => Object.is(active, name))
}

function toggle(name: CollapseName): void {
  let next: CollapseValue
  if (props.accordion) next = isActive(name) ? '' : name
  else next = isActive(name) ? activeNames.value.filter((active) => !Object.is(active, name)) : [...activeNames.value, name]
  emit('update:modelValue', next)
  emit('change', next)
}

function moveHeader(current: HTMLButtonElement, event: KeyboardEvent): void {
  const buttons = Array.from(rootRef.value?.querySelectorAll<HTMLButtonElement>('.mm-collapse-item__trigger:not(:disabled)') ?? [])
  const index = buttons.indexOf(current)
  if (index < 0 || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const target = event.key === 'Home' ? buttons[0]
    : event.key === 'End' ? buttons.at(-1)
      : buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]
  target?.focus()
}

provide(collapseKey, { activeNames, isActive, moveHeader, toggle })
</script>

<template>
  <div ref="rootRef" class="mm-collapse" :class="{ 'is-accordion': accordion }" data-mm-component="collapse"><slot /></div>
</template>

<style src="./collapse.css"></style>
