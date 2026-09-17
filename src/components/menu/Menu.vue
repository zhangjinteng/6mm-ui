<script setup lang="ts">
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'

import { useRovingFocus } from '../../composables/use-roving-focus'
import { menuKey, type MenuProps, type MenuValue } from './types'

defineOptions({ name: 'MmMenu' })

const props = withDefaults(defineProps<MenuProps>(), {
  mode: 'vertical',
  modelValue: undefined,
  openKeys: () => [],
})
const emit = defineEmits<{
  change: [value: MenuValue]
  'open-change': [value: MenuValue[]]
  select: [value: MenuValue]
  'update:modelValue': [value: MenuValue]
  'update:openKeys': [value: MenuValue[]]
}>()

const rootRef = ref<HTMLElement>()
const currentOpenKeys = ref<MenuValue[]>([...props.openKeys])
const mode = computed(() => props.mode)
const roving = useRovingFocus(rootRef, {
  orientation: props.mode === 'horizontal' ? 'horizontal' : 'vertical',
  selector: '[data-mm-menu-level="root"]',
})

watch(() => props.openKeys, (value) => {
  currentOpenKeys.value = [...value]
}, { deep: true })
watch(() => props.modelValue, () => void nextTick(roving.refresh))
onMounted(() => void nextTick(roving.refresh))

function isSelected(value: MenuValue): boolean {
  return Object.is(props.modelValue, value)
}

function isOpen(value: MenuValue): boolean {
  return currentOpenKeys.value.some((key) => Object.is(key, value))
}

function updateOpenKeys(next: MenuValue[]): void {
  currentOpenKeys.value = next
  emit('update:openKeys', next)
  emit('open-change', next)
}

function toggleSubMenu(value: MenuValue, force?: boolean): void {
  const open = isOpen(value)
  if (force === open) return
  updateOpenKeys(open
    ? currentOpenKeys.value.filter((key) => !Object.is(key, value))
    : [...currentOpenKeys.value, value])
}

function closeSubMenu(value: MenuValue): void {
  if (isOpen(value)) toggleSubMenu(value, false)
}

function select(value: MenuValue): void {
  if (isSelected(value)) return
  emit('update:modelValue', value)
  emit('change', value)
  emit('select', value)
}

function focusFirst(): void {
  roving.focusAt(0)
}

provide(menuKey, { closeSubMenu, isOpen, isSelected, mode, select, toggleSubMenu })
defineExpose({ focusFirst })
</script>

<template>
  <div
    ref="rootRef"
    class="mm-menu"
    :class="`mm-menu--${mode}`"
    data-mm-component="menu"
    role="menu"
    :aria-orientation="mode"
    @keydown="roving.onKeydown"
  >
    <slot />
  </div>
</template>

<style src="./menu.css"></style>
