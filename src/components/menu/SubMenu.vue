<script setup lang="ts">
import { computed, inject, nextTick, provide, ref } from 'vue'

import { useId } from '../../composables/use-id'
import { menuKey, subMenuKey, type SubMenuProps } from './types'

defineOptions({ name: 'MmSubMenu' })

const props = withDefaults(defineProps<SubMenuProps>(), { disabled: false, label: undefined })
const menuContext = inject(menuKey)
const parentSubMenu = inject(subMenuKey, null)
if (!menuContext) throw new Error('[MmSubMenu] must be used inside MmMenu')
const menu = menuContext

const triggerRef = ref<HTMLButtonElement>()
const panelRef = ref<HTMLElement>()
const panelId = useId('mm-sub-menu')
const open = computed(() => menu.isOpen(props.value))
const level = computed(() => parentSubMenu ? 'nested' : 'root')

function enabledItems(): HTMLElement[] {
  return Array.from(panelRef.value?.querySelectorAll<HTMLElement>('[data-mm-menu-level="nested"]') ?? [])
    .filter((item) => item.getAttribute('aria-disabled') !== 'true' && !(item instanceof HTMLButtonElement && item.disabled))
}

function focusAt(index: number): void {
  const items = enabledItems()
  if (!items.length) return
  const next = (index + items.length) % items.length
  items.forEach((item, itemIndex) => (item.tabIndex = itemIndex === next ? 0 : -1))
  items[next]?.focus()
}

function toggle(): void {
  if (!props.disabled) menu.toggleSubMenu(props.value)
}

async function openAndFocus(): Promise<void> {
  if (props.disabled) return
  menu.toggleSubMenu(props.value, true)
  await nextTick()
  focusAt(0)
}

function closeAndFocus(): void {
  menu.closeSubMenu(props.value)
  void nextTick(() => triggerRef.value?.focus())
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    event.stopPropagation()
    void openAndFocus()
  } else if (['Enter', ' '].includes(event.key)) {
    event.preventDefault()
    toggle()
  }
}

function onPanelKeydown(event: KeyboardEvent): void {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'ArrowLeft', 'Escape'].includes(event.key)) return
  event.preventDefault()
  event.stopPropagation()
  if (event.key === 'ArrowLeft' || event.key === 'Escape') {
    closeAndFocus()
    return
  }
  const items = enabledItems()
  const current = items.findIndex((item) => item.ownerDocument.activeElement === item)
  const target = event.key === 'Home' ? 0
    : event.key === 'End' ? items.length - 1
      : current + (event.key === 'ArrowDown' ? 1 : -1)
  focusAt(target)
}

provide(subMenuKey, { closeAndFocus, level: (parentSubMenu?.level ?? 0) + 1 })
</script>

<template>
  <div class="mm-sub-menu" :class="{ 'is-open': open, 'is-disabled': disabled }" role="none">
    <button
      ref="triggerRef"
      class="mm-sub-menu__trigger"
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      :aria-controls="panelId"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-disabled="disabled ? 'true' : undefined"
      :disabled="disabled"
      data-mm-roving-item
      :data-mm-menu-level="level"
      tabindex="-1"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span v-if="$slots.icon" class="mm-menu-item__icon" aria-hidden="true"><slot name="icon" /></span>
      <span class="mm-menu-item__label"><slot name="title">{{ label }}</slot></span>
      <span class="mm-sub-menu__chevron" aria-hidden="true"><slot name="chevron" :open="open">›</slot></span>
    </button>
    <div
      v-show="open"
      :id="panelId"
      ref="panelRef"
      class="mm-sub-menu__panel"
      role="menu"
      aria-orientation="vertical"
      @keydown="onPanelKeydown"
    >
      <slot />
    </div>
  </div>
</template>
