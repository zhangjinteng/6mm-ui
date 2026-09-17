<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue'

import { useFocusTrap } from '../../composables/use-focus-trap'
import { useId } from '../../composables/use-id'
import { useLocale } from '../../composables/use-locale'
import { useLockScroll } from '../../composables/use-lock-scroll'
import { acquireOverlay } from '../../shared/overlay-manager'
import type { OverlayHandle } from '../../shared/overlay-manager'
import { MmIcon } from '../icon'
import type { DialogCloseReason, DialogExpose, DialogProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmDialog' })

const props = withDefaults(defineProps<DialogProps>(), {
  ariaDescribedby: undefined,
  beforeClose: undefined,
  closeOnClickModal: true,
  closeOnEscape: true,
  kind: 'dialog',
  lockScroll: true,
  mask: true,
  modelValue: false,
  overlayClass: undefined,
  panelClass: undefined,
  panelStyle: undefined,
  showClose: true,
  teleportTo: 'body',
  title: undefined,
  width: 520,
})
const emit = defineEmits<{
  close: [reason: DialogCloseReason]
  closed: []
  open: []
  opened: []
  'update:modelValue': [value: boolean]
}>()
const { messages } = useLocale()
const slots = useSlots()
const visible = ref(props.modelValue)
const panelRef = ref<HTMLElement>()
const titleId = useId('mm-dialog-title')
const zIndex = ref(1200)
const scrollLock = useLockScroll()
let overlayHandle: OverlayHandle | undefined
let closing = false

const hasHeader = computed(() => Boolean(props.title || slots.header || slots['header-actions'] || props.showClose))
const labelledby = computed(() => props.title || slots.header ? titleId : undefined)
const widthStyle = computed(() => typeof props.width === 'number' ? `${props.width}px` : props.width)
const focusTrap = useFocusTrap(panelRef, {
  escapeDeactivates: false,
  onEscape: (event) => {
    if (!props.closeOnEscape || !overlayHandle?.isTopmost()) return
    event.preventDefault()
    void requestClose('escape')
  },
  returnFocus: true,
})

function activate(): void {
  overlayHandle?.release()
  overlayHandle = acquireOverlay()
  zIndex.value = overlayHandle.zIndex
  if (props.lockScroll) scrollLock.lock()
  emit('open')
  void nextTick(() => {
    focusTrap.activate()
    emit('opened')
  })
}

function deactivate(restoreFocus = true): void {
  focusTrap.deactivate(restoreFocus)
  scrollLock.unlock()
  overlayHandle?.release()
  overlayHandle = undefined
}

watch(() => props.modelValue, (value) => {
  visible.value = value
})

watch(visible, (value, previous) => {
  if (value) activate()
  else if (previous) {
    deactivate()
    void nextTick(() => emit('closed'))
  }
}, { immediate: true })

function open(): void {
  if (visible.value) return
  visible.value = true
  emit('update:modelValue', true)
}

async function requestClose(reason: DialogCloseReason = 'close'): Promise<void> {
  if (!visible.value || closing || !overlayHandle?.isTopmost()) return
  closing = true
  try {
    const result = props.beforeClose ? await props.beforeClose(reason) : true
    if (result === false) return
    visible.value = false
    emit('update:modelValue', false)
    emit('close', reason)
  } finally {
    closing = false
  }
}

function onMaskClick(): void {
  if (props.mask && props.closeOnClickModal) void requestClose('mask')
}

onBeforeUnmount(() => deactivate())
defineExpose<DialogExpose>({ close: requestClose, open })
</script>

<template>
  <Teleport :to="teleportTo">
    <div
      v-if="visible"
      v-bind="$attrs"
      class="mm-dialog__overlay"
      :class="[overlayClass, { 'has-mask': mask }]"
      :data-mm-component="kind"
      :style="{ zIndex }"
      @click.self="onMaskClick"
    >
      <section
        ref="panelRef"
        class="mm-dialog__panel"
        :class="panelClass"
        :style="[{ width: kind === 'dialog' ? widthStyle : undefined }, panelStyle]"
        role="dialog"
        aria-modal="true"
        :aria-describedby="ariaDescribedby"
        :aria-labelledby="labelledby"
        :aria-label="labelledby ? undefined : messages.dialog.label"
        tabindex="-1"
      >
        <header v-if="hasHeader" class="mm-dialog__header">
          <div :id="titleId" class="mm-dialog__title"><slot name="header" :close="requestClose">{{ title }}</slot></div>
          <div v-if="$slots['header-actions']" class="mm-dialog__header-actions">
            <slot name="header-actions" :close="requestClose" />
          </div>
          <button v-if="showClose" class="mm-dialog__close" type="button" :aria-label="messages.dialog.close" @click="requestClose('close')">
            <MmIcon name="close" :size="15" />
          </button>
        </header>
        <div class="mm-dialog__body"><slot :close="requestClose" /></div>
        <footer v-if="$slots.footer" class="mm-dialog__footer"><slot name="footer" :close="requestClose" /></footer>
      </section>
    </div>
  </Teleport>
</template>

<style src="./dialog.css"></style>
