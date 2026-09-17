<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CSSProperties } from 'vue'

import type { ScrollbarPosition, ScrollbarProps } from './types'

defineOptions({ name: 'MmScrollbar' })

const props = withDefaults(defineProps<ScrollbarProps>(), {
  always: false,
  height: undefined,
  maxHeight: undefined,
  tabindex: 0,
  viewClass: undefined,
})
const emit = defineEmits<{ scroll: [position: ScrollbarPosition] }>()
const wrapRef = ref<HTMLElement>()

function cssValue(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

const styles = computed<CSSProperties>(() => ({
  height: cssValue(props.height),
  maxHeight: cssValue(props.maxHeight),
}))

function onScroll(): void {
  if (!wrapRef.value) return
  emit('scroll', {
    scrollLeft: wrapRef.value.scrollLeft,
    scrollTop: wrapRef.value.scrollTop,
  })
}

function scrollTo(options: ScrollToOptions): void {
  wrapRef.value?.scrollTo(options)
}

function setScrollTop(value: number): void {
  if (wrapRef.value) wrapRef.value.scrollTop = value
}

function setScrollLeft(value: number): void {
  if (wrapRef.value) wrapRef.value.scrollLeft = value
}

defineExpose({ scrollTo, setScrollLeft, setScrollTop, wrapRef })
</script>

<template>
  <div class="mm-scrollbar" :class="{ 'is-always': always }" data-mm-component="scrollbar">
    <div
      ref="wrapRef"
      class="mm-scrollbar__wrap"
      :style="styles"
      :tabindex="tabindex"
      @scroll.passive="onScroll"
    >
      <div class="mm-scrollbar__view" :class="viewClass"><slot /></div>
    </div>
  </div>
</template>

<style src="./scrollbar.css"></style>
