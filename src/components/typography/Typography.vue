<script setup lang="ts">
import { computed, onScopeDispose, ref } from 'vue'
import type { CSSProperties } from 'vue'

import { useControlled } from '../../composables/use-controlled'
import { useLocale } from '../../composables/use-locale'
import { debugWarn } from '../../shared/warn'
import { MmText } from '../text'
import type { TextSize } from '../text'
import type { TypographyProps } from './types'

defineOptions({ name: 'MmTypography' })

const props = withDefaults(defineProps<TypographyProps>(), {
  align: 'left',
  as: 'article',
  collapsedLines: 3,
  collapsible: false,
  copyText: undefined,
  copyable: false,
  defaultExpanded: false,
  density: 'default',
  expanded: undefined,
  level: 3,
  title: undefined,
})
const emit = defineEmits<{
  copy: [value: string]
  'update:expanded': [value: boolean]
}>()
const { messages } = useLocale()
const bodyRef = ref<HTMLElement>()
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const expandedState = useControlled(
  () => props.expanded,
  props.defaultExpanded,
  (value) => emit('update:expanded', value),
)
const titleTag = computed(() => `h${props.level}`)
const titleSize = computed<TextSize>(() => {
  if (props.level === 1) return 'xl'
  if (props.level === 2) return 'lg'
  return 'md'
})
const styles = computed<CSSProperties>(() =>
  ({ '--mm-typography-lines': props.collapsedLines }) as CSSProperties,
)

function toggle(): void {
  expandedState.value.value = !expandedState.value.value
}

async function copy(): Promise<void> {
  const value = props.copyText ?? bodyRef.value?.textContent?.trim() ?? ''
  if (!value) return

  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    debugWarn('Typography', 'Clipboard API is unavailable')
    return
  }

  await navigator.clipboard.writeText(value)
  emit('copy', value)
  copied.value = true
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1600)
}

onScopeDispose(() => {
  if (copiedTimer) clearTimeout(copiedTimer)
})
</script>

<template>
  <component
    :is="as"
    class="mm-typography"
    :class="[`mm-typography--${density}`, `is-align-${align}`]"
    data-mm-component="typography"
  >
    <header v-if="title || $slots.title || copyable || collapsible" class="mm-typography__header">
      <MmText v-if="title || $slots.title" :as="titleTag" class="mm-typography__title" :size="titleSize" weight="bold">
        <slot name="title">{{ title }}</slot>
      </MmText>
      <div v-if="copyable || collapsible || $slots.actions" class="mm-typography__actions">
        <slot name="actions" />
        <button v-if="copyable" type="button" data-action="copy" @click="copy">
          {{ copied ? messages.typography.copied : messages.typography.copy }}
        </button>
        <button v-if="collapsible" type="button" data-action="toggle" :aria-expanded="expandedState.value.value" @click="toggle">
          {{ expandedState.value.value ? messages.typography.collapse : messages.typography.expand }}
        </button>
      </div>
    </header>
    <div
      ref="bodyRef"
      class="mm-typography__body"
      :class="{ 'is-collapsed': collapsible && !expandedState.value.value }"
      :style="styles"
    >
      <slot />
    </div>
  </component>
</template>

<style src="./typography.css"></style>
