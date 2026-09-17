<script setup lang="ts">
import { computed, nextTick, provide, ref, shallowRef, useAttrs } from 'vue'

import { tabsKey, type TabRecord, type TabsProps, type TabsValue } from './types'

defineOptions({ inheritAttrs: false, name: 'MmTabs' })

const props = withDefaults(defineProps<TabsProps>(), {
  direction: 'horizontal',
  lazy: false,
  modelValue: undefined,
  type: 'line',
})
const emit = defineEmits<{
  change: [value: TabsValue]
  'update:modelValue': [value: TabsValue]
}>()

const tablistRef = ref<HTMLElement>()
const attrs = useAttrs()
const panels = shallowRef<TabRecord[]>([])
const internalValue = ref<TabsValue>()
const activeValue = computed(() => props.modelValue === undefined ? internalValue.value : props.modelValue)
const isLazy = computed(() => props.lazy)

function register(record: TabRecord): void {
  if (panels.value.some((panel) => Object.is(panel.name, record.name))) return
  panels.value = [...panels.value, record]
  if (activeValue.value === undefined && !record.disabled.value) internalValue.value = record.name
}

function unregister(name: TabsValue): void {
  panels.value = panels.value.filter((panel) => !Object.is(panel.name, name))
  if (props.modelValue === undefined && Object.is(internalValue.value, name)) {
    internalValue.value = panels.value.find((panel) => !panel.disabled.value)?.name
  }
}

function isActive(name: TabsValue): boolean {
  return Object.is(activeValue.value, name)
}

function activate(panel: TabRecord): void {
  if (panel.disabled.value || isActive(panel.name)) return
  if (props.modelValue === undefined) internalValue.value = panel.name
  emit('update:modelValue', panel.name)
  emit('change', panel.name)
}

function enabledButtons(): HTMLButtonElement[] {
  return Array.from(tablistRef.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [])
}

async function onKeydown(current: HTMLButtonElement, event: KeyboardEvent): Promise<void> {
  const forward = props.direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
  const backward = props.direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  if (![forward, backward, 'Home', 'End'].includes(event.key)) return
  const buttons = enabledButtons()
  const currentIndex = buttons.indexOf(current)
  if (currentIndex < 0) return
  event.preventDefault()
  const target = event.key === 'Home' ? buttons[0]
    : event.key === 'End' ? buttons.at(-1)
      : buttons[(currentIndex + (event.key === forward ? 1 : -1) + buttons.length) % buttons.length]
  target?.focus()
  target?.click()
  await nextTick()
}

provide(tabsKey, { activeValue, isLazy, register, unregister })
</script>

<template>
  <div
    class="mm-tabs"
    :class="[`mm-tabs--${type}`, `mm-tabs--${direction}`]"
    data-mm-component="tabs"
  >
    <div
      ref="tablistRef"
      v-bind="attrs"
      class="mm-tabs__list"
      role="tablist"
      :aria-orientation="direction"
    >
      <button
        v-for="panel in panels"
        :id="panel.tabId"
        :key="String(panel.name)"
        class="mm-tabs__tab"
        :class="{ 'is-active': isActive(panel.name) }"
        type="button"
        role="tab"
        :disabled="panel.disabled.value"
        :aria-controls="panel.panelId"
        :aria-selected="isActive(panel.name) ? 'true' : 'false'"
        :tabindex="isActive(panel.name) ? 0 : -1"
        @click="activate(panel)"
        @keydown="onKeydown($event.currentTarget as HTMLButtonElement, $event)"
      >
        {{ panel.label.value }}
      </button>
    </div>
    <div class="mm-tabs__panels"><slot /></div>
  </div>
</template>

<style src="./tabs.css"></style>
