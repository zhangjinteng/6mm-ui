<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useClickOutside } from '../../composables/use-click-outside'
import { useEventListener } from '../../composables/use-event-listener'
import { useFloating } from '../../composables/use-floating'
import { useId } from '../../composables/use-id'
import type { PopoverProps } from './types'

defineOptions({ name: 'MmPopover' })

const props = withDefaults(defineProps<PopoverProps>(), {
  closeDelay: 90,
  closeOnClickOutside: true,
  closeOnEscape: true,
  disabled: false,
  floatingClass: undefined,
  modelValue: false,
  offset: 8,
  openDelay: 80,
  persistent: false,
  placement: 'bottom',
  role: 'dialog',
  showArrow: true,
  teleport: true,
  teleportTo: 'body',
  trigger: 'click',
  width: undefined,
})
const emit = defineEmits<{
  close: []
  open: []
  'update:modelValue': [value: boolean]
  'visible-change': [value: boolean]
}>()

const contentId = useId('mm-popover')
const referenceRef = ref<HTMLElement>()
const floatingRef = ref<HTMLElement>()
const nestedOverlayZIndex = ref<number>()
const isOpen = ref(props.modelValue)
const triggerAttrs = computed(() => props.role === 'tooltip'
  ? { 'aria-describedby': isOpen.value ? contentId : undefined }
  : {
      'aria-controls': isOpen.value ? contentId : undefined,
      'aria-expanded': isOpen.value ? 'true' as const : 'false' as const,
    })
let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined
const floating = useFloating(referenceRef, floatingRef, {
  offset: props.offset,
  placement: props.placement,
})
const contentStyle = computed(() => ({
  ...floating.floatingStyles.value,
  width: props.width === undefined ? undefined : typeof props.width === 'number' ? `${props.width}px` : props.width,
  zIndex: nestedOverlayZIndex.value,
}))

function updatePosition(): void {
  const overlay = referenceRef.value?.closest<HTMLElement>('.mm-dialog__overlay')
  const overlayZIndex = overlay ? Number.parseInt(overlay.style.zIndex || getComputedStyle(overlay).zIndex, 10) : Number.NaN
  nestedOverlayZIndex.value = Number.isFinite(overlayZIndex) ? overlayZIndex + 1 : undefined
  floating.update()
}

watch(() => props.modelValue, (value) => {
  isOpen.value = value
  if (value) void nextTick(updatePosition)
})

function clearTimers(): void {
  if (openTimer) clearTimeout(openTimer)
  if (closeTimer) clearTimeout(closeTimer)
  openTimer = undefined
  closeTimer = undefined
}

function setVisible(value: boolean): void {
  if ((value && props.disabled) || isOpen.value === value) return
  isOpen.value = value
  emit('update:modelValue', value)
  emit('visible-change', value)
  if (value) emit('open')
  else emit('close')
  if (value) void nextTick(updatePosition)
}

function open(): void {
  clearTimers()
  setVisible(true)
}

function focusTrigger(): void {
  const selector = 'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
  referenceRef.value?.querySelector<HTMLElement>(selector)?.focus()
}

function close(restoreFocus = false): void {
  clearTimers()
  setVisible(false)
  if (restoreFocus) void nextTick(focusTrigger)
}

function toggle(): void {
  if (isOpen.value) close()
  else open()
}

function scheduleOpen(): void {
  clearTimers()
  if (props.openDelay <= 0) {
    open()
    return
  }
  openTimer = setTimeout(open, props.openDelay)
}

function scheduleClose(): void {
  clearTimers()
  if (props.closeDelay <= 0) {
    close()
    return
  }
  closeTimer = setTimeout(() => close(), props.closeDelay)
}

function onTriggerClick(): void {
  if (props.trigger === 'click') toggle()
}

function onTriggerFocusIn(): void {
  if (props.trigger === 'focus' || props.trigger === 'hover-focus') scheduleOpen()
}

function onTriggerFocusOut(event: FocusEvent): void {
  if (props.trigger !== 'focus' && props.trigger !== 'hover-focus') return
  const next = event.relatedTarget
  if (next instanceof Node && floatingRef.value?.contains(next)) return
  close()
}

useClickOutside(floatingRef, () => close(), {
  enabled: () => isOpen.value && props.closeOnClickOutside,
  ignore: [referenceRef],
})
useEventListener<KeyboardEvent>(
  () => typeof document === 'undefined' ? undefined : document,
  'keydown',
  (event) => {
    if (isOpen.value && props.closeOnEscape && event.key === 'Escape') {
      event.preventDefault()
      close(true)
    }
  },
)

onMounted(() => {
  if (isOpen.value) void nextTick(updatePosition)
})
onBeforeUnmount(clearTimers)
defineExpose({ close, open, toggle, updatePosition })
</script>

<template>
  <span
    ref="referenceRef"
    class="mm-popover__trigger"
    :class="{ 'is-disabled': disabled }"
    data-mm-component="popover-trigger"
    @click="onTriggerClick"
    @focusin="onTriggerFocusIn"
    @focusout="onTriggerFocusOut"
    @mouseenter="(trigger === 'hover' || trigger === 'hover-focus') && scheduleOpen()"
    @mouseleave="(trigger === 'hover' || trigger === 'hover-focus') && scheduleClose()"
  >
    <slot :open="isOpen" :toggle="toggle" :trigger-attrs="triggerAttrs" />
  </span>

  <Teleport :to="teleportTo" :disabled="!teleport">
    <div
      v-if="persistent || isOpen"
      v-show="isOpen"
      :id="contentId"
      ref="floatingRef"
      class="mm-popover__floating"
      :class="[`mm-popover--${floating.placement.value}`, floatingClass]"
      data-mm-component="popover"
      :data-placement="floating.placement.value"
      :role="role"
      :style="contentStyle"
      @mouseenter="(trigger === 'hover' || trigger === 'hover-focus') && (clearTimers(), open())"
      @mouseleave="(trigger === 'hover' || trigger === 'hover-focus') && scheduleClose()"
    >
      <span v-if="showArrow" class="mm-popover__arrow" aria-hidden="true" />
      <div class="mm-popover__content"><slot name="content" :close="close" /></div>
    </div>
  </Teleport>
</template>

<style src="./popover.css"></style>
