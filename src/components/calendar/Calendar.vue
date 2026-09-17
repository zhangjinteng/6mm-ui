<script setup lang="ts">
import { MmDatePickerPanel, type DatePickerValue } from '../date-picker-panel'
import type { CalendarProps } from './types'

defineOptions({ name: 'MmCalendar' })

withDefaults(defineProps<CalendarProps>(), {
  disabledDate: undefined,
  displayedMonth: undefined,
  firstDayOfWeek: 0,
  max: undefined,
  min: undefined,
  modelValue: null,
})
const emit = defineEmits<{
  select: [value: DatePickerValue]
  'update:displayedMonth': [value: string]
  'update:modelValue': [value: DatePickerValue]
}>()
</script>

<template>
  <section class="mm-calendar" data-mm-component="calendar">
    <MmDatePickerPanel
      :model-value="modelValue"
      :displayed-month="displayedMonth"
      :first-day-of-week="firstDayOfWeek"
      :min="min"
      :max="max"
      :disabled-date="disabledDate"
      @update:model-value="emit('update:modelValue', $event)"
      @update:displayed-month="emit('update:displayedMonth', $event)"
      @select="emit('select', $event)"
    >
      <template v-if="$slots.date" #date="slotProps"><slot name="date" v-bind="slotProps" /></template>
    </MmDatePickerPanel>
  </section>
</template>

<style src="./calendar.css"></style>
