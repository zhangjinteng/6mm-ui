<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useAttrs, watch } from 'vue'

import { useControlled } from '../../composables/use-controlled'
import { useId } from '../../composables/use-id'
import { useLocale } from '../../composables/use-locale'
import { MmAutocomplete } from '../autocomplete'
import { MmButton } from '../button'
import { MmDateRangePicker } from '../date-range-picker'
import type { DateRangeValue } from '../date-picker-panel'
import { MmIcon } from '../icon'
import { MmInput } from '../input'
import { MmSegmented } from '../segmented'
import type { SegmentedValue } from '../segmented'
import { MmSelect } from '../select'
import type { SelectValue } from '../select'
import type {
  QueryBarCoinField,
  QueryBarField,
  QueryBarFieldValue,
  QueryBarProps,
  QueryBarReturnContext,
  QueryBarSelectField,
  QueryBarValue,
} from './types'
import {
  cloneQueryBarFieldValue,
  cloneQueryBarValue,
  createQueryBarValue,
  materializeQueryBarValue,
  queryBarFieldDefault,
} from './value'

defineOptions({ inheritAttrs: false, name: 'MmQueryBar' })

const props = withDefaults(defineProps<QueryBarProps>(), {
  disabled: false,
  fields: () => [],
  loading: false,
  modelValue: undefined,
  returnContext: undefined,
  showReset: true,
  singleLine: false,
  size: 'sm',
})
const emit = defineEmits<{
  change: [value: QueryBarValue, field: QueryBarField, fieldValue: QueryBarFieldValue]
  query: [value: QueryBarValue]
  reset: [value: QueryBarValue]
  'return-context': [context: QueryBarReturnContext]
  'update:modelValue': [value: QueryBarValue]
}>()
const { messages } = useLocale()
const resolvedAriaLabel = computed(() => props.ariaLabel ?? messages.value.queryBar.ariaLabel)
const resolvedQueryText = computed(() => props.queryText ?? messages.value.common.query)
const resolvedResetText = computed(() => props.resetText ?? messages.value.common.reset)

const attrs = useAttrs()
const rootId = useId('mm-query-bar')
const blocked = computed(() => props.disabled || props.loading)
const singleLineMode = computed(() => props.singleLine
  || attrs['single-line'] !== undefined
  || attrs.singleLine !== undefined)
const rootRef = ref<HTMLFormElement>()
const actionsRef = ref<HTMLElement>()
const actionTrackRef = ref<HTMLElement>()
let resizeObserver: ResizeObserver | undefined
let overflowFrame: number | undefined
const { value: draft } = useControlled(
  () => props.modelValue,
  createQueryBarValue(props.fields),
  (value) => emit('update:modelValue', cloneQueryBarValue(value)),
)
const activeReturnContext = computed<QueryBarReturnContext | undefined>(() => {
  const label = props.returnContext?.label.trim()
  const route = props.returnContext?.route.trim()
  return label && route ? { label, route } : undefined
})
const returnActionLabel = computed(() => {
  const label = activeReturnContext.value?.label ?? ''
  return messages.value.queryBar.return(label)
})
const fieldsRef = ref<HTMLElement>()

function materializeValue(value: QueryBarValue): QueryBarValue {
  return materializeQueryBarValue(value, props.fields)
}

function fieldValue(field: QueryBarField): QueryBarFieldValue {
  return draft.value[field.key] === undefined ? queryBarFieldDefault(field) : draft.value[field.key]!
}

function updateField(field: QueryBarField, fieldValue: QueryBarFieldValue): void {
  const next = materializeValue(draft.value)
  next[field.key] = cloneQueryBarFieldValue(fieldValue)
  draft.value = next
  emit('change', cloneQueryBarValue(next), field, cloneQueryBarFieldValue(fieldValue))
}

function updateSelect(field: QueryBarSelectField, value: SelectValue | SelectValue[]): void {
  updateField(field, Array.isArray(value) ? (value[0] ?? '') : value)
}

function updateCoin(field: QueryBarCoinField, value: string): void {
  updateField(field, value.trimStart().toUpperCase())
}

function coinSuggestions(field: QueryBarCoinField): Array<string | Record<string, unknown>> {
  return (field.options ?? []).map((option) => {
    if (typeof option === 'string') return option.toUpperCase()
    return { label: option.label, value: String(option.value).toUpperCase() }
  })
}

function isInputField(field: QueryBarField): boolean {
  return field.type === 'keyword' || field.type === 'coin' || field.type === 'date-range'
}

function controlId(index: number): string {
  return `${rootId}-control-${index}`
}

function labelId(index: number): string {
  return `${rootId}-label-${index}`
}

function widthValue(field: QueryBarField): string {
  if (field.width !== undefined) return typeof field.width === 'number' ? `${field.width}px` : field.width
  if (field.type === 'keyword') return '220px'
  if (field.type === 'coin') return '132px'
  if (field.type === 'date-range') return '224px'
  if (field.type === 'segmented') return '220px'
  return '164px'
}

function fieldStyle(field: QueryBarField): Record<string, string> {
  return { '--mm-query-bar-field-width': widthValue(field) }
}

function reset(): void {
  const value = createQueryBarValue(props.fields)
  draft.value = value
  emit('reset', cloneQueryBarValue(value))
}

function query(): void {
  emit('query', materializeValue(draft.value))
}

function returnToContext(): void {
  if (!activeReturnContext.value) return
  emit('return-context', { ...activeReturnContext.value })
}

function fieldOverflowItems(): HTMLElement[] {
  const fields = fieldsRef.value
  if (!fields) return []
  return Array.from(fields.children).filter(
    (element): element is HTMLElement => element instanceof HTMLElement && element.matches('[data-query-field]'),
  )
}

function actionOverflowItems(): HTMLElement[] {
  const track = actionTrackRef.value
  if (!track) return []
  return Array.from(track.children).flatMap((element) => {
    if (!(element instanceof HTMLElement)) return []
    if (!element.matches('[data-query-overflow-group]')) return [element]
    return Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
  })
}

function clearHiddenOverflowItems(): void {
  for (const item of [...fieldOverflowItems(), ...actionOverflowItems()]) item.hidden = false
}

function pixelValue(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function syncOverflow(): void {
  overflowFrame = undefined
  const root = rootRef.value
  const fields = fieldsRef.value
  const actions = actionsRef.value
  const track = actionTrackRef.value
  const fieldItems = fieldOverflowItems()
  const actionItems = actionOverflowItems()
  for (const item of [...fieldItems, ...actionItems]) item.hidden = false
  if (!singleLineMode.value || !root || !fields || !actions || !track || root.clientWidth <= 0) return

  const rootStyle = window.getComputedStyle(root)
  const actionsStyle = window.getComputedStyle(actions)
  const availableWidth = root.clientWidth
    - pixelValue(rootStyle.paddingLeft)
    - pixelValue(rootStyle.paddingRight)
  const columnGap = pixelValue(rootStyle.columnGap || rootStyle.gap)
  const overflows = () => {
    const actionsWidth = track.scrollWidth
      + pixelValue(actionsStyle.paddingLeft)
      + pixelValue(actionsStyle.paddingRight)
    const gap = fields.scrollWidth > 0 && actionsWidth > 0 ? columnGap : 0
    return fields.scrollWidth + actionsWidth + gap > availableWidth + 1
  }

  const overflowItems = [...fieldItems].reverse().concat(actionItems)
  for (const item of overflowItems) {
    if (!overflows()) break
    item.hidden = true
  }
}

function scheduleOverflow(): void {
  if (typeof window === 'undefined') return
  if (overflowFrame !== undefined) window.cancelAnimationFrame(overflowFrame)
  overflowFrame = window.requestAnimationFrame(syncOverflow)
}

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    resizeObserver = new ResizeObserver(scheduleOverflow)
    resizeObserver.observe(rootRef.value)
  }
  void nextTick(syncOverflow)
})
onUpdated(syncOverflow)
watch(singleLineMode, () => void nextTick(syncOverflow))
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (overflowFrame !== undefined && typeof window !== 'undefined') window.cancelAnimationFrame(overflowFrame)
  clearHiddenOverflowItems()
})

defineExpose({ query, reset })
</script>

<template>
  <form
    ref="rootRef"
    v-bind="$attrs"
    class="mm-query-bar"
    :class="[`mm-query-bar--${size}`, { 'is-disabled': disabled, 'is-loading': loading, 'mm-query-bar--single-line': singleLineMode }]"
    data-mm-component="query-bar"
    role="search"
    :aria-label="resolvedAriaLabel"
    :aria-busy="loading ? 'true' : undefined"
    @submit.prevent="query"
  >
    <div ref="fieldsRef" class="mm-query-bar__fields">
      <MmButton
        v-if="activeReturnContext"
        class="mm-query-bar__return-context"
        data-action="return-context"
        :aria-label="returnActionLabel"
        :title="messages.queryBar.returnTitle(returnActionLabel)"
        :size="size"
        @click="returnToContext"
      >
        <template #icon><MmIcon name="arrow-left" :size="14" /></template>
        {{ returnActionLabel }}
      </MmButton>
      <div
        v-for="(field, index) in fields"
        :key="field.key"
        class="mm-query-bar__field"
        :class="`mm-query-bar__field--${field.type}`"
        :data-query-field="field.key"
        :style="fieldStyle(field)"
      >
        <label
          v-if="isInputField(field)"
          :id="labelId(index)"
          class="mm-query-bar__label"
          data-query-label
          :for="controlId(index)"
        >{{ field.label }}</label>
        <span
          v-else
          :id="labelId(index)"
          class="mm-query-bar__label"
          data-query-label
        >{{ field.label }}</span>

        <slot
          :name="`field-${field.key}`"
          :field="field"
          :value="fieldValue(field)"
          :update="(value: QueryBarFieldValue) => updateField(field, value)"
        >
          <MmInput
            v-if="field.type === 'keyword'"
            :id="controlId(index)"
            :model-value="String(fieldValue(field) ?? '')"
            :name="field.name"
            :placeholder="field.placeholder || field.label"
            :autocomplete="field.autocomplete"
            :clearable="field.clearable ?? true"
            :disabled="blocked || field.disabled"
            :maxlength="field.maxlength"
            :size="size"
            @update:model-value="updateField(field, $event)"
          >
            <template #prefix><MmIcon name="search" :size="13" /></template>
          </MmInput>

          <MmSelect
            v-else-if="field.type === 'select'"
            :id="controlId(index)"
            :model-value="fieldValue(field) as SelectValue"
            :name="field.name"
            :aria-labelledby="labelId(index)"
            :placeholder="field.placeholder || messages.queryBar.all(field.label)"
            :options="field.options"
            :clearable="field.clearable ?? true"
            :disabled="blocked || field.disabled"
            :filterable="field.filterable"
            :loading="loading || field.loading"
            :size="size"
            @update:model-value="updateSelect(field, $event)"
          />

          <MmAutocomplete
            v-else-if="field.type === 'coin'"
            :id="controlId(index)"
            :model-value="String(fieldValue(field) ?? '')"
            :name="field.name"
            :placeholder="field.placeholder || field.label"
            :suggestions="coinSuggestions(field)"
            :clearable="field.clearable ?? true"
            :debounce="0"
            :disabled="blocked || field.disabled"
            :min-length="0"
            :size="size"
            @update:model-value="updateCoin(field, $event)"
          />

          <MmDateRangePicker
            v-else-if="field.type === 'date-range'"
            :id="controlId(index)"
            :model-value="fieldValue(field) as DateRangeValue | null"
            :name="field.name"
            :placeholder="field.placeholder || field.label"
            :disabled="blocked || field.disabled"
            :disabled-date="field.disabledDate"
            :format="field.format"
            :max="field.max"
            :min="field.min"
            :shortcuts="field.shortcuts"
            :size="size"
            @update:model-value="updateField(field, $event)"
          />

          <MmSegmented
            v-else
            :id="controlId(index)"
            :model-value="fieldValue(field) as SegmentedValue"
            :name="field.name"
            :aria-labelledby="labelId(index)"
            :block="field.block ?? true"
            :disabled="blocked || field.disabled"
            :options="field.options"
            :size="size"
            @update:model-value="updateField(field, $event)"
          />
        </slot>
      </div>
    </div>

    <div ref="actionsRef" class="mm-query-bar__actions">
      <div ref="actionTrackRef" class="mm-query-bar__action-track">
        <slot
          name="buttons"
          :disabled="blocked"
          :loading="loading"
          :query="query"
          :query-text="resolvedQueryText"
          :reset="reset"
          :reset-text="resolvedResetText"
          :show-reset="showReset"
          :size="size"
          :value="materializeValue(draft)"
        >
          <MmButton
            v-if="showReset"
            data-query-action="reset"
            :disabled="blocked"
            :size="size"
            @click="reset"
          >
            <template #icon><MmIcon name="rotate-ccw" :size="13" /></template>
            {{ resolvedResetText }}
          </MmButton>
          <MmButton
            data-query-action="query"
            :disabled="disabled"
            :loading="loading"
            native-type="submit"
            :size="size"
            variant="primary"
          >
            <template #icon><MmIcon name="search" :size="13" /></template>
            {{ resolvedQueryText }}
          </MmButton>
        </slot>
        <slot name="actions" :disabled="blocked" :query="query" :reset="reset" :value="materializeValue(draft)" />
      </div>
    </div>
  </form>
</template>

<style src="./query-bar.css"></style>
