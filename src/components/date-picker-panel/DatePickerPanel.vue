<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import { useLocale } from '../../composables/use-locale'
import {
  addDays,
  addMonths,
  buildCalendarMonth,
  compareDateValues,
  parseDateValue,
  todayDateValue,
} from '../../shared/date'
import { MmIcon } from '../icon'
import type { DatePickerPanelProps, DatePickerValue, DateRangeValue } from './types'

defineOptions({ name: 'MmDatePickerPanel' })

const props = withDefaults(defineProps<DatePickerPanelProps>(), {
  compact: false,
  disabledDate: undefined,
  displayedMonth: undefined,
  firstDayOfWeek: 0,
  max: undefined,
  min: undefined,
  modelValue: null,
  selectionMode: 'single',
})
const emit = defineEmits<{
  select: [value: DatePickerValue]
  'update:displayedMonth': [value: string]
  'update:modelValue': [value: DatePickerValue]
}>()
const { messages } = useLocale()

const initialDate = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue
const visibleMonth = ref(props.displayedMonth || initialDate?.slice(0, 7) || todayDateValue().slice(0, 7))
const activeDate = ref(initialDate || `${visibleMonth.value}-01`)
const rootRef = ref<HTMLElement>()
const today = todayDateValue()
const weekdays = computed(() => props.firstDayOfWeek === 1
  ? messages.value.datePicker.weekdaysMondayFirst
  : messages.value.datePicker.weekdaysSundayFirst)
const cells = computed(() => buildCalendarMonth(visibleMonth.value, props.firstDayOfWeek))
const weeks = computed(() => Array.from({ length: 6 }, (_, index) => cells.value.slice(index * 7, index * 7 + 7)))
const monthLabel = computed(() => {
  const [year, month] = visibleMonth.value.split('-')
  return messages.value.datePicker.monthTitle(year ?? '', Number(month), props.compact)
})

watch(() => props.displayedMonth, (value) => { if (value) visibleMonth.value = value })
watch(() => props.modelValue, (value) => {
  const date = Array.isArray(value) ? value[0] : value
  if (date) activeDate.value = date
})

function isDisabled(date: string): boolean {
  return Boolean(
    (props.min && compareDateValues(date, props.min) < 0) ||
    (props.max && compareDateValues(date, props.max) > 0) ||
    props.disabledDate?.(date),
  )
}

function isSelected(date: string): boolean {
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(date)
  return props.modelValue === date
}

function isInRange(date: string): boolean {
  if (!Array.isArray(props.modelValue) || !props.modelValue[0] || !props.modelValue[1]) return false
  return compareDateValues(date, props.modelValue[0]) >= 0 && compareDateValues(date, props.modelValue[1]) <= 0
}

function changeMonth(amount: number): void {
  visibleMonth.value = addMonths(`${visibleMonth.value}-01`, amount).slice(0, 7)
  emit('update:displayedMonth', visibleMonth.value)
}

function commit(date: string): void {
  if (isDisabled(date)) return
  activeDate.value = date
  let value: DatePickerValue = date
  if (props.selectionMode === 'range') {
    const current = Array.isArray(props.modelValue) ? props.modelValue : null
    if (!current?.[0] || current[1]) value = [date, '']
    else value = compareDateValues(date, current[0]) < 0 ? [date, current[0]] : [current[0], date]
  }
  emit('update:modelValue', value)
  emit('select', value)
}

function findEnabled(date: string, direction: 1 | -1): string {
  let candidate = date
  for (let index = 0; index < 366; index++) {
    if (!isDisabled(candidate)) return candidate
    candidate = addDays(candidate, direction)
  }
  return date
}

function focusDate(date: string, direction: 1 | -1 = 1): void {
  const enabled = findEnabled(date, direction)
  activeDate.value = enabled
  if (enabled.slice(0, 7) !== visibleMonth.value) {
    visibleMonth.value = enabled.slice(0, 7)
    emit('update:displayedMonth', visibleMonth.value)
  }
  void nextTick(() => rootRef.value?.querySelector<HTMLElement>(`[data-date="${enabled}"]`)?.focus())
}

function onDateKeydown(event: KeyboardEvent, date: string): void {
  let target: string | undefined
  if (event.key === 'ArrowRight') target = addDays(date, 1)
  else if (event.key === 'ArrowLeft') target = addDays(date, -1)
  else if (event.key === 'ArrowDown') target = addDays(date, 7)
  else if (event.key === 'ArrowUp') target = addDays(date, -7)
  else if (event.key === 'Home') target = addDays(date, -new Date(`${date}T00:00:00Z`).getUTCDay())
  else if (event.key === 'End') target = addDays(date, 6 - new Date(`${date}T00:00:00Z`).getUTCDay())
  else if (event.key === 'PageDown') target = addMonths(date, event.shiftKey ? 12 : 1)
  else if (event.key === 'PageUp') target = addMonths(date, event.shiftKey ? -12 : -1)
  else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    commit(date)
    return
  }
  if (!target || !parseDateValue(target)) return
  event.preventDefault()
  focusDate(target, compareDateValues(target, date) >= 0 ? 1 : -1)
}
</script>

<template>
  <section
    ref="rootRef"
    class="mm-date-panel"
    :class="{ 'mm-date-panel--compact': compact }"
    data-mm-component="date-picker-panel"
    :aria-label="messages.datePicker.panel"
  >
    <header class="mm-date-panel__header">
      <span class="mm-date-panel__nav-group">
        <button v-if="!compact" type="button" :aria-label="messages.datePicker.previousYear" @click="changeMonth(-12)">«</button>
        <button type="button" :aria-label="messages.datePicker.previousMonth" @click="changeMonth(-1)">
          <MmIcon v-if="compact" name="chevron-left" :size="14" />
          <template v-else>‹</template>
        </button>
      </span>
      <strong aria-live="polite">{{ monthLabel }}</strong>
      <span class="mm-date-panel__nav-group">
        <button type="button" :aria-label="messages.datePicker.nextMonth" @click="changeMonth(1)">
          <MmIcon v-if="compact" name="chevron-right" :size="14" />
          <template v-else>›</template>
        </button>
        <button v-if="!compact" type="button" :aria-label="messages.datePicker.nextYear" @click="changeMonth(12)">»</button>
      </span>
    </header>
    <div class="mm-date-panel__weekdays" aria-hidden="true">
      <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
    </div>
    <div class="mm-date-panel__grid" role="grid" :aria-label="monthLabel">
      <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="mm-date-panel__week" role="row">
        <button
          v-for="cell in week"
          :key="cell.value"
          class="mm-date-panel__day"
          :class="{
            'is-adjacent': !cell.currentMonth,
            'is-in-range': isInRange(cell.value),
            'is-selected': isSelected(cell.value),
            'is-today': cell.value === today,
            'is-weekend': cell.weekend,
          }"
          type="button"
          role="gridcell"
          :data-date="cell.value"
          :disabled="isDisabled(cell.value)"
          :tabindex="activeDate === cell.value ? 0 : -1"
          :aria-label="cell.value"
          :aria-selected="isSelected(cell.value) ? 'true' : 'false'"
          @click="commit(cell.value)"
          @focus="activeDate = cell.value"
          @keydown="onDateKeydown($event, cell.value)"
        ><slot name="date" :cell="cell">{{ cell.day }}</slot></button>
      </div>
    </div>
  </section>
</template>

<style src="./date-picker-panel.css"></style>
