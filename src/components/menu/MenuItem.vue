<script setup lang="ts">
import { computed, inject } from 'vue'

import { menuKey, subMenuKey, type MenuItemProps } from './types'

defineOptions({ name: 'MmMenuItem' })

const props = withDefaults(defineProps<MenuItemProps>(), { disabled: false })
const menu = inject(menuKey)
const parentSubMenu = inject(subMenuKey, null)
if (!menu) throw new Error('[MmMenuItem] must be used inside MmMenu')

const selected = computed(() => menu.isSelected(props.value))
const level = computed(() => parentSubMenu ? 'nested' : 'root')

function choose(): void {
  if (!props.disabled) menu?.select(props.value)
}

function onKeydown(event: KeyboardEvent): void {
  if (!['Enter', ' '].includes(event.key)) return
  event.preventDefault()
  choose()
}
</script>

<template>
  <button
    class="mm-menu-item"
    :class="{ 'is-selected': selected }"
    type="button"
    role="menuitem"
    :disabled="disabled"
    :aria-current="selected ? 'page' : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    data-mm-roving-item
    :data-mm-menu-level="level"
    :tabindex="!disabled && selected && level === 'root' ? 0 : -1"
    @click="choose"
    @keydown="onKeydown"
  >
    <span v-if="$slots.icon" class="mm-menu-item__icon" aria-hidden="true"><slot name="icon" /></span>
    <span class="mm-menu-item__label"><slot /></span>
    <span v-if="$slots.suffix" class="mm-menu-item__suffix"><slot name="suffix" /></span>
  </button>
</template>
