<script setup lang="ts">
import { computed } from 'vue'

import { MmDialog } from '../dialog'
import type { DialogCloseReason } from '../dialog'
import type { DrawerProps } from './types'

defineOptions({ name: 'MmDrawer' })

const props = withDefaults(defineProps<DrawerProps>(), {
  beforeClose: undefined,
  closeOnClickModal: true,
  closeOnEscape: true,
  lockScroll: true,
  mask: true,
  modelValue: false,
  placement: 'right',
  showClose: true,
  size: 420,
  teleportTo: 'body',
  title: undefined,
})
const emit = defineEmits<{
  close: [reason: DialogCloseReason]
  closed: []
  open: []
  opened: []
  'update:modelValue': [value: boolean]
}>()
const cssSize = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size)
const panelStyle = computed(() => props.placement === 'left' || props.placement === 'right'
  ? { height: '100%', width: cssSize.value }
  : { height: cssSize.value, width: '100%' })
</script>

<template>
  <MmDialog
    :model-value="modelValue"
    :before-close="beforeClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-escape="closeOnEscape"
    kind="drawer"
    :lock-scroll="lockScroll"
    :mask="mask"
    :overlay-class="`mm-drawer mm-drawer--${placement}`"
    panel-class="mm-drawer__panel"
    :panel-style="panelStyle"
    :show-close="showClose"
    :teleport-to="teleportTo"
    :title="title"
    @close="emit('close', $event)"
    @closed="emit('closed')"
    @open="emit('open')"
    @opened="emit('opened')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="$slots.header" #header="slotProps"><slot name="header" v-bind="slotProps" /></template>
    <template v-if="$slots['header-actions']" #header-actions="slotProps"><slot name="header-actions" v-bind="slotProps" /></template>
    <template #default="slotProps"><slot v-bind="slotProps" /></template>
    <template v-if="$slots.footer" #footer="slotProps"><slot name="footer" v-bind="slotProps" /></template>
  </MmDialog>
</template>

<style src="./drawer.css"></style>
