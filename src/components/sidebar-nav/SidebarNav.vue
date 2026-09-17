<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'

import { useControlled } from '../../composables/use-controlled'
import { useLocale } from '../../composables/use-locale'
import { MmDrawer } from '../drawer'
import type { MenuValue } from '../menu'
import SidebarNavPanel from './SidebarNavPanel.vue'
import type { SidebarNavChildItem, SidebarNavExpose, SidebarNavProps } from './types'

defineOptions({ name: 'MmSidebarNav' })

const props = withDefaults(defineProps<SidebarNavProps>(), {
  accordion: true,
  collapsed: undefined,
  collapsedWidth: 56,
  display: 'auto',
  drawerSize: 320,
  items: () => [],
  mobileBreakpoint: 900,
  mobileOpen: undefined,
  modelValue: undefined,
  openKeys: undefined,
  placement: 'left',
  width: 188,
})

const emit = defineEmits<{
  change: [value: MenuValue, item: SidebarNavChildItem]
  'open-change': [keys: MenuValue[]]
  select: [item: SidebarNavChildItem]
  'update:collapsed': [value: boolean]
  'update:mobileOpen': [value: boolean]
  'update:modelValue': [value: MenuValue]
  'update:openKeys': [value: MenuValue[]]
}>()
const { messages } = useLocale()
const resolvedAriaLabel = computed(() => props.ariaLabel ?? messages.value.sidebar.ariaLabel)
const resolvedMobileTitle = computed(() => props.mobileTitle ?? messages.value.sidebar.mobileTitle)

function parentKeyFor(value: MenuValue | undefined): MenuValue | undefined {
  if (value === undefined) return undefined
  return props.items.find((item) => item.children?.some((child) => Object.is(child.key, value)))?.key
}

const { value: activeKey } = useControlled<MenuValue | undefined>(
  () => props.modelValue,
  props.modelValue,
  (value) => {
    if (value !== undefined) emit('update:modelValue', value)
  },
)
const { value: activeOpenKeys } = useControlled<MenuValue[]>(
  () => props.openKeys,
  parentKeyFor(props.modelValue) === undefined ? [] : [parentKeyFor(props.modelValue)!],
  (value) => {
    const snapshot = [...value]
    emit('update:openKeys', snapshot)
    emit('open-change', snapshot)
  },
)
const { value: isCollapsed } = useControlled<boolean>(
  () => props.collapsed,
  false,
  (value) => emit('update:collapsed', value),
)
const { value: isMobileOpen } = useControlled<boolean>(
  () => props.mobileOpen,
  false,
  (value) => emit('update:mobileOpen', value),
)

const viewportMobile = ref(false)
let mediaQuery: MediaQueryList | undefined

function cssValue(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

const panelStyle = computed<CSSProperties>(() => ({
  '--mm-sidebar-nav-collapsed-width': cssValue(props.collapsedWidth),
  '--mm-sidebar-nav-width': cssValue(props.width),
} as CSSProperties))
const mobileMode = computed(() => props.display === 'mobile'
  || (props.display === 'auto' && viewportMobile.value))
const visibleOpenKeys = computed(() => props.accordion
  ? activeOpenKeys.value.slice(-1)
  : [...activeOpenKeys.value])

function updateViewport(event: MediaQueryListEvent | MediaQueryList): void {
  viewportMobile.value = event.matches
}

function unbindMediaQuery(): void {
  if (!mediaQuery) return
  if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', updateViewport)
  else mediaQuery.removeListener?.(updateViewport)
  mediaQuery = undefined
}

function bindMediaQuery(): void {
  unbindMediaQuery()
  if (typeof window === 'undefined' || !window.matchMedia) return
  mediaQuery = window.matchMedia(`(max-width: ${Math.max(0, props.mobileBreakpoint)}px)`)
  updateViewport(mediaQuery)
  if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', updateViewport)
  else mediaQuery.addListener?.(updateViewport)
}

function handleOpenChange(keys: MenuValue[]): void {
  if (!props.accordion) {
    activeOpenKeys.value = [...keys]
    return
  }
  const previous = visibleOpenKeys.value
  const opened = keys.filter((key) => !previous.some((entry) => Object.is(entry, key)))
  activeOpenKeys.value = opened.length ? [opened[opened.length - 1]!] : []
}

function handleSelect(item: SidebarNavChildItem): void {
  const changed = !Object.is(activeKey.value, item.key)
  if (changed) {
    activeKey.value = item.key
    emit('change', item.key, item)
  }
  emit('select', item)
  if (mobileMode.value) isMobileOpen.value = false
}

function openMobile(): void {
  isMobileOpen.value = true
}

function closeMobile(): void {
  isMobileOpen.value = false
}

function toggleCollapsed(): void {
  isCollapsed.value = !isCollapsed.value
}

watch(() => props.mobileBreakpoint, bindMediaQuery)
watch(() => props.display, (display) => {
  if (display === 'auto') bindMediaQuery()
})
onMounted(bindMediaQuery)
onBeforeUnmount(unbindMediaQuery)
defineExpose<SidebarNavExpose>({ closeMobile, openMobile, toggleCollapsed })
</script>

<template>
  <SidebarNavPanel
    v-if="!mobileMode"
    :active-key="activeKey"
    :aria-label="resolvedAriaLabel"
    :collapsed="isCollapsed"
    :items="items"
    :open-keys="visibleOpenKeys"
    :placement="placement"
    :style="panelStyle"
    @open-change="handleOpenChange"
    @select="handleSelect"
  >
    <template v-if="$slots.brand" #brand="slotProps"><slot name="brand" v-bind="slotProps" /></template>
    <template v-if="$slots.footer" #footer="slotProps"><slot name="footer" v-bind="slotProps" /></template>
  </SidebarNavPanel>

  <MmDrawer
    v-else
    class="mm-sidebar-nav__drawer"
    :model-value="isMobileOpen"
    :placement="placement"
    :show-close="true"
    :size="drawerSize"
    :title="$slots.brand ? undefined : resolvedMobileTitle"
    @update:model-value="isMobileOpen = $event"
  >
    <template v-if="$slots.brand" #header><slot name="brand" :collapsed="false" :mobile="true" /></template>
    <SidebarNavPanel
      as="div"
      :active-key="activeKey"
      :aria-label="resolvedAriaLabel"
      :items="items"
      mobile
      :open-keys="visibleOpenKeys"
      :placement="placement"
      :show-brand="false"
      :style="panelStyle"
      @open-change="handleOpenChange"
      @select="handleSelect"
    >
      <template v-if="$slots.footer" #footer="slotProps"><slot name="footer" v-bind="slotProps" /></template>
    </SidebarNavPanel>
  </MmDrawer>
</template>

<style src="./sidebar-nav.css"></style>
