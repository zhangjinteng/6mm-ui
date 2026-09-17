<script setup lang="ts">
import { computed } from 'vue'

import type { LinkProps } from './types'

defineOptions({
  inheritAttrs: false,
  name: 'MmLink',
})

const props = withDefaults(defineProps<LinkProps>(), {
  disabled: false,
  external: false,
  href: undefined,
  rel: undefined,
  target: undefined,
  tone: 'primary',
  underline: 'hover',
})
const emit = defineEmits<{ click: [event: MouseEvent] }>()

const resolvedTarget = computed(() => props.target ?? (props.external ? '_blank' : undefined))
const resolvedRel = computed(() =>
  props.rel ?? (resolvedTarget.value === '_blank' ? 'noopener noreferrer' : undefined),
)

function onClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <a
    v-bind="$attrs"
    class="mm-link"
    :class="[
      `mm-link--${tone}`,
      `mm-link--underline-${underline}`,
      { 'is-disabled': disabled },
    ]"
    data-mm-component="link"
    :href="disabled ? undefined : href"
    :rel="resolvedRel"
    :target="resolvedTarget"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="onClick"
  >
    <span v-if="$slots.prefix" class="mm-link__prefix"><slot name="prefix" /></span>
    <span class="mm-link__label"><slot /></span>
    <span v-if="$slots.suffix" class="mm-link__suffix"><slot name="suffix" /></span>
  </a>
</template>

<style src="./link.css"></style>
