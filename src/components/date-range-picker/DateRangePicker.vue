<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { addDays, addMonths, compareDateValues, todayDateValue } from '../../shared/date'
import { MmButton } from '../button'
import { MmDatePicker } from '../date-picker'
import type { DatePickerValue, DateRangeValue } from '../date-picker-panel'
import type { DateRangePickerProps, DateRangeShortcut } from './types'

defineOptions({ inheritAttrs: false, name: 'MmDateRangePicker' })

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  modelValue: null,
  shortcuts: () => ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'],
  triggerVariant: 'filter',
})
const emit = defineEmits<{
  change: [value: DateRangeValue | null]
  clear: []
  invalid: [input: string]
  'update:modelValue': [value: DateRangeValue | null]
}>()
const { messages } = useLocale()

interface ResolvedShortcut {
  disabled: boolean
  key: DateRangeShortcut
  label: string
  range: DateRangeValue
}

const open = ref(false)
const preserveDraftOnClose = ref(false)
const draft = ref<DateRangeValue | null>(cloneRange(props.modelValue))

watch(() => props.modelValue, (value) => {
  if (!open.value) draft.value = cloneRange(value)
})

watch(open, (value) => {
  if (value) {
    preserveDraftOnClose.value = false
    draft.value = cloneRange(props.modelValue)
    return
  }
  if (preserveDraftOnClose.value) {
    preserveDraftOnClose.value = false
    return
  }
  draft.value = cloneRange(props.modelValue)
})

function cloneRange(value: DateRangeValue | null | undefined): DateRangeValue | null {
  return value ? [value[0], value[1]] : null
}

function resolveShortcut(key: DateRangeShortcut): DateRangeValue {
  const today = todayDateValue()
  const monthStart = `${today.slice(0, 7)}-01`
  if (key === 'yesterday') {
    const yesterday = addDays(today, -1)
    return [yesterday, yesterday]
  }
  if (key === 'last7Days') return [addDays(today, -6), today]
  if (key === 'last30Days') return [addDays(today, -29), today]
  if (key === 'thisMonth') return [monthStart, addDays(addMonths(monthStart, 1), -1)]
  if (key === 'lastMonth') return [addMonths(monthStart, -1), addDays(monthStart, -1)]
  return [today, today]
}

function isDateDisabled(date: string): boolean {
  return Boolean(
    (props.min && compareDateValues(date, props.min) < 0) ||
    (props.max && compareDateValues(date, props.max) > 0) ||
    props.disabledDate?.(date),
  )
}

function isRangeAvailable(range: DateRangeValue): boolean {
  if (!range[0] || !range[1] || compareDateValues(range[0], range[1]) > 0) return false
  let date = range[0]
  while (compareDateValues(date, range[1]) <= 0) {
    if (isDateDisabled(date)) return false
    const nextDate = addDays(date, 1)
    if (nextDate === date) return false
    date = nextDate
  }
  return true
}

const resolvedShortcuts = computed<ResolvedShortcut[]>(() => props.shortcuts.map((key) => {
  const range = resolveShortcut(key)
  return {
    disabled: !isRangeAvailable(range),
    key,
    label: messages.value.dateRangePicker[key],
    range,
  }
}))
const selectionSummary = computed(() => {
  if (!draft.value?.[0]) return messages.value.dateRangePicker.incompleteRange
  return draft.value[1]
    ? messages.value.dateRangePicker.range(draft.value[0], draft.value[1])
    : messages.value.dateRangePicker.range(draft.value[0], messages.value.dateRangePicker.chooseEndDate)
})
const canConfirm = computed(() => Boolean(draft.value && isRangeAvailable(draft.value)))
const resolvedClearText = computed(() => props.clearText ?? messages.value.dateRangePicker.clear)
const resolvedConfirmText = computed(() => props.confirmText ?? messages.value.dateRangePicker.confirm)
const resolvedPlaceholder = computed(() => props.placeholder ?? messages.value.dateRangePicker.chooseRange)

function isActiveShortcut(shortcut: ResolvedShortcut): boolean {
  return Boolean(
    draft.value &&
    draft.value[0] === shortcut.range[0] &&
    draft.value[1] === shortcut.range[1],
  )
}

function selectShortcut(shortcut: ResolvedShortcut): void {
  if (!shortcut.disabled) draft.value = cloneRange(shortcut.range)
}

function updateDraft(value: DatePickerValue): void {
  draft.value = Array.isArray(value) ? [value[0], value[1]] : null
}

function confirm(): void {
  if (!draft.value || !canConfirm.value) return
  const value = cloneRange(draft.value)!
  preserveDraftOnClose.value = true
  emit('update:modelValue', value)
  emit('change', value)
  open.value = false
}

function clear(): void {
  preserveDraftOnClose.value = true
  draft.value = null
  emit('update:modelValue', null)
  emit('change', null)
  emit('clear')
  open.value = false
}
</script>

<template>
  <div class="mm-date-range-picker" data-mm-component="date-range-picker">
    <MmDatePicker
      v-bind="$attrs"
      :model-value="draft"
      v-model:open="open"
      :clearable="false"
      :close-on-select="false"
      :disabled="disabled"
      :disabled-date="disabledDate"
      :editable="editable"
      :format="format"
      :id="id"
      :max="max"
      :min="min"
      :name="name"
      panel-class="mm-date-range-picker__panel"
      :panel-compact="true"
      panel-floating-class="mm-date-range-picker__floating"
      :panel-width="312"
      :placeholder="resolvedPlaceholder"
      :readonly="readonly"
      :size="size"
      :status="status"
      :trigger-variant="triggerVariant"
      type="daterange"
      @invalid="emit('invalid', $event)"
      @update:model-value="updateDraft"
    >
      <template #panel-before>
        <div class="mm-date-range-picker__shortcuts" role="group" :aria-label="messages.dateRangePicker.shortcuts">
          <MmButton
            v-for="shortcut in resolvedShortcuts"
            :key="shortcut.key"
            :aria-pressed="isActiveShortcut(shortcut)"
            class="mm-date-range-picker__shortcut"
            :class="{ 'is-active': isActiveShortcut(shortcut) }"
            :data-shortcut="shortcut.key"
            :disabled="shortcut.disabled"
            size="sm"
            @click="selectShortcut(shortcut)"
          >{{ shortcut.label }}</MmButton>
        </div>
        <div class="mm-date-range-picker__selection" aria-live="polite">{{ selectionSummary }}</div>
      </template>

      <template #panel-after>
        <footer class="mm-date-range-picker__footer">
          <MmButton size="sm" @click="clear">{{ resolvedClearText }}</MmButton>
          <MmButton size="sm" variant="primary" :disabled="!canConfirm" @click="confirm">{{ resolvedConfirmText }}</MmButton>
        </footer>
      </template>
    </MmDatePicker>
  </div>
</template>

<style src="./date-range-picker.css"></style>
