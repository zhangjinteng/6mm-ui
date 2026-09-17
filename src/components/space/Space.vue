<script setup lang="ts">
import { Comment, Fragment, Text, computed, useSlots } from 'vue'
import type { CSSProperties, VNode } from 'vue'

import type { SpaceProps } from './types'

defineOptions({ name: 'MmSpace' })

const props = withDefaults(defineProps<SpaceProps>(), {
  align: 'center',
  as: 'div',
  direction: 'horizontal',
  separator: undefined,
  size: 8,
  wrap: false,
})
const slots = useSlots()

function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Comment) return []
    if (node.type === Text && String(node.children ?? '').trim() === '') return []
    if (node.type === Fragment && Array.isArray(node.children)) return flatten(node.children as VNode[])
    return [node]
  })
}

const items = computed(() => flatten(slots.default?.() ?? []))
const gapValue = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const styles = computed<CSSProperties>(() =>
  ({ '--mm-space-gap': gapValue.value }) as CSSProperties,
)
</script>

<template>
  <component
    :is="as"
    class="mm-space"
    :class="[
      `mm-space--${direction}`,
      `is-align-${align}`,
      { 'is-wrap': wrap },
    ]"
    data-mm-component="space"
    :style="styles"
  >
    <template v-for="(item, index) in items" :key="item.key ?? index">
      <span class="mm-space__item"><component :is="item" /></span>
      <span v-if="index < items.length - 1 && ($slots.separator || separator)" class="mm-space__separator" aria-hidden="true">
        <slot name="separator">{{ separator }}</slot>
      </span>
    </template>
  </component>
</template>

<style src="./space.css"></style>
