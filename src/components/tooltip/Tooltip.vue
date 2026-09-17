<script setup lang="ts">
import { ref, watch } from 'vue'

import { MmPopover } from '../popover'
import type { TooltipProps } from './types'

defineOptions({ name: 'MmTooltip' })

const props = withDefaults(defineProps<TooltipProps>(), {
  closeDelay: 80,
  content: undefined,
  disabled: false,
  offset: 7,
  openDelay: 120,
  placement: 'top',
  showArrow: true,
  teleport: true,
})
const emit = defineEmits<{ 'visible-change': [value: boolean] }>()
const visible = ref(false)

watch(() => props.disabled, (disabled) => {
  if (disabled) visible.value = false
})
</script>

<template>
  <MmPopover
    v-model="visible"
    :close-delay="closeDelay"
    :disabled="disabled"
    :offset="offset"
    :open-delay="openDelay"
    :placement="placement"
    role="tooltip"
    :show-arrow="showArrow"
    :teleport="teleport"
    trigger="hover-focus"
    @visible-change="emit('visible-change', $event)"
  >
    <template #default="{ open, toggle, triggerAttrs }">
      <slot :open="open" :toggle="toggle" :trigger-attrs="triggerAttrs" />
    </template>
    <template #content><span class="mm-tooltip__content"><slot name="content">{{ content }}</slot></span></template>
  </MmPopover>
</template>

<style src="./tooltip.css"></style>
