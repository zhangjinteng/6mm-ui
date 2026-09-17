<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmMenu, MmMenuItem, type MenuValue } from '../menu'
import { MmPopover, type PopoverExpose } from '../popover'
import type { DropdownItem, DropdownProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmDropdown' })

const props = withDefaults(defineProps<DropdownProps>(), {
  closeOnSelect: true,
  disabled: false,
  floatingClass: undefined,
  items: () => [],
  modelValue: undefined,
  placement: 'bottom-start',
  teleport: true,
  trigger: 'click',
  visible: false,
  width: undefined,
})
const emit = defineEmits<{
  select: [item: DropdownItem]
  'update:modelValue': [value: MenuValue]
  'update:visible': [value: boolean]
  'visible-change': [value: boolean]
}>()
const { messages } = useLocale()
const resolvedLabel = computed(() => props.label ?? messages.value.dropdown.moreActions)

const popoverRef = ref<PopoverExpose>()
const menuRef = ref<{ focusFirst: () => void }>()
const open = ref(props.visible)
const attrs = useAttrs()
const popupClass = computed(() => ['mm-dropdown__popup', props.floatingClass].filter(Boolean).join(' '))

watch(() => props.visible, (value) => (open.value = value))

function setVisible(value: boolean): void {
  if (open.value === value) return
  open.value = value
  emit('update:visible', value)
  emit('visible-change', value)
}

async function openAndFocus(): Promise<void> {
  if (props.disabled) return
  if (!open.value) popoverRef.value?.open()
  await nextTick()
  await nextTick()
  menuRef.value?.focusFirst()
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (event.key !== 'ArrowDown') return
  event.preventDefault()
  void openAndFocus()
}

function select(value: MenuValue): void {
  const item = props.items.find((candidate) => Object.is(candidate.value, value)) ?? {
    label: String(value),
    value,
  }
  if (item.disabled) return
  emit('update:modelValue', value)
  emit('select', item)
  if (props.closeOnSelect) popoverRef.value?.close(true)
}

const triggerAttrs = computed(() => ({
  'aria-haspopup': 'menu' as const,
  onKeydown: onTriggerKeydown,
}))
</script>

<template>
  <span v-bind="attrs" class="mm-dropdown" data-mm-component="dropdown">
    <MmPopover
      ref="popoverRef"
      :model-value="open"
      :disabled="disabled"
      :floating-class="popupClass"
      :placement="placement"
      role="presentation"
      :show-arrow="false"
      :teleport="teleport"
      :trigger="trigger"
      :width="width"
      @update:model-value="setVisible"
    >
      <template #default="{ triggerAttrs: popoverTriggerAttrs }">
        <slot
          name="trigger"
          :open="open"
          :trigger-attrs="{ ...popoverTriggerAttrs, ...triggerAttrs }"
        >
          <button
            class="mm-dropdown__trigger"
            type="button"
            :disabled="disabled"
            v-bind="{ ...popoverTriggerAttrs, ...triggerAttrs }"
          >
            <span>{{ resolvedLabel }}</span><span class="mm-dropdown__chevron" aria-hidden="true">⌄</span>
          </button>
        </slot>
      </template>
      <template #content="{ close }">
        <slot name="header" :close="close" />
        <MmMenu ref="menuRef" :model-value="modelValue" class="mm-dropdown__menu" @select="select">
          <slot name="menu" :close="close">
            <MmMenuItem v-for="item in items" :key="String(item.value)" :disabled="item.disabled" :value="item.value">
              <template v-if="item.icon" #icon><component :is="item.icon" /></template>
              {{ item.label }}
            </MmMenuItem>
          </slot>
        </MmMenu>
      </template>
    </MmPopover>
  </span>
</template>

<style src="./dropdown.css"></style>
