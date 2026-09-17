<script setup lang="ts">
import { computed } from 'vue'

import { iconDefinitions } from './icons'
import type { IconNode } from './icons'
import type { IconProps } from './types'

defineOptions({
  inheritAttrs: false,
  name: 'MmIcon',
})

const props = withDefaults(defineProps<IconProps>(), {
  color: undefined,
  label: undefined,
  name: undefined,
  size: 16,
  spin: false,
  strokeWidth: 1.8,
})

const cssSize = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const nodes = computed<readonly IconNode[]>(() => (props.name ? iconDefinitions[props.name] : []))
</script>

<template>
  <svg
    v-bind="$attrs"
    class="mm-icon"
    :class="{ 'is-spinning': spin }"
    data-mm-component="icon"
    fill="none"
    focusable="false"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label"
    :role="label ? 'img' : undefined"
    :stroke="color || 'currentColor'"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
    :style="{ color, height: cssSize, width: cssSize }"
    viewBox="0 0 24 24"
  >
    <slot>
      <template v-for="(node, index) in nodes" :key="`${node[0]}-${index}`">
        <circle v-if="node[0] === 'circle'" v-bind="node[1]" />
        <ellipse v-else-if="node[0] === 'ellipse'" v-bind="node[1]" />
        <line v-else-if="node[0] === 'line'" v-bind="node[1]" />
        <path v-else-if="node[0] === 'path'" v-bind="node[1]" />
        <polygon v-else-if="node[0] === 'polygon'" v-bind="node[1]" />
        <polyline v-else-if="node[0] === 'polyline'" v-bind="node[1]" />
        <rect v-else-if="node[0] === 'rect'" v-bind="node[1]" />
      </template>
    </slot>
  </svg>
</template>

<style src="./icon.css"></style>
