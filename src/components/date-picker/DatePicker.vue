<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useFormField } from '../../composables/use-form-field'
import { useId } from '../../composables/use-id'
import { useLocale } from '../../composables/use-locale'
import { formatDate, parseFormattedDate, todayDateValue } from '../../shared/date'
import { MmDatePickerPanel, type DatePickerValue } from '../date-picker-panel'
import { MmIcon } from '../icon'
import { MmInput } from '../input'
import { MmPopover } from '../popover'
import type { DatePickerProps } from './types'

defineOptions({ name: 'MmDatePicker' })

const props = withDefaults(defineProps<DatePickerProps>(), {
  clearable: true,
  closeOnSelect: true,
  disabled: false,
  disabledDate: undefined,
  editable: true,
  format: 'YYYY-MM-DD',
  max: undefined,
  min: undefined,
  modelValue: null,
  open: undefined,
  panelClass: undefined,
  panelCompact: false,
  panelFloatingClass: undefined,
  panelWidth: undefined,
  readonly: false,
  size: undefined,
  status: undefined,
  triggerVariant: 'input',
  type: 'date',
})
const emit = defineEmits<{
  change: [value: DatePickerValue]
  clear: []
  invalid: [input: string]
  'update:open': [value: boolean]
  'update:modelValue': [value: DatePickerValue]
}>()
const { messages } = useLocale()
const resolvedPlaceholder = computed(() => props.placeholder ?? messages.value.datePicker.chooseDate)
const resolvedPanelFloatingClass = computed(() => ['mm-date-picker__floating', props.panelFloatingClass]
  .filter(Boolean)
  .join(' '))

const uncontrolledOpen = ref(false)
const panelOpen = computed({
  get: () => props.open ?? uncontrolledOpen.value,
  set: (value: boolean) => {
    if (panelOpen.value === value) return
    if (props.open === undefined) uncontrolledOpen.value = value
    emit('update:open', value)
  },
})
const panelId = useId('mm-date-picker-panel')
const invalid = ref(false)
const internalValue = ref<DatePickerValue>(props.modelValue)
const displayedMonth = ref(resolveMonth(props.modelValue))
const draft = ref(formatValue(props.modelValue))
const field = useFormField({
  disabled: () => props.disabled,
  id: () => props.id,
  size: () => props.size,
  status: () => invalid.value ? 'error' : props.status,
})

watch(() => props.modelValue, (value) => {
  internalValue.value = value
  displayedMonth.value = resolveMonth(value)
  draft.value = formatValue(value)
  invalid.value = false
})

function resolveMonth(value: DatePickerValue): string {
  const date = Array.isArray(value) ? value[0] : value
  return date?.slice(0, 7) || todayDateValue().slice(0, 7)
}

function formatValue(value: DatePickerValue): string {
  if (!value) return ''
  if (Array.isArray(value)) {
    const start = value[0] ? formatDate(value[0], props.format) : ''
    const end = value[1] ? formatDate(value[1], props.format) : ''
    return end ? `${start} → ${end}` : start
  }
  return formatDate(value, props.format)
}

function commit(value: DatePickerValue): void {
  internalValue.value = value
  draft.value = formatValue(value)
  invalid.value = false
  emit('update:modelValue', value)
  emit('change', value)
  void field.onChange()
}

function parseDraft(): DatePickerValue | undefined {
  const input = draft.value.trim()
  if (!input) return null
  if (props.type === 'daterange') {
    const parts = input.split(/\s*→\s*/)
    if (parts.length !== 2) return undefined
    const start = parseFormattedDate(parts[0]!, props.format)
    const end = parseFormattedDate(parts[1]!, props.format)
    return start && end ? [start, end] : undefined
  }
  return parseFormattedDate(input, props.format) ?? undefined
}

function commitDraft(): void {
  if (!props.editable || props.readonly || field.disabled.value) return
  const value = parseDraft()
  if (value === undefined) {
    invalid.value = true
    emit('invalid', draft.value)
    return
  }
  commit(value)
}

function onPanelUpdate(value: DatePickerValue): void {
  commit(value)
}

function onPanelSelect(value: DatePickerValue): void {
  if (props.closeOnSelect && (props.type === 'date' || (Array.isArray(value) && Boolean(value[1])))) panelOpen.value = false
}

function showPanel(): void {
  if (!field.disabled.value && !props.readonly) panelOpen.value = true
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    showPanel()
  } else if (event.key === 'Escape') {
    panelOpen.value = false
  } else if (event.key === 'Enter') {
    commitDraft()
  }
}

function clear(): void {
  commit(null)
  panelOpen.value = false
  emit('clear')
}
</script>

<template>
  <div
    class="mm-date-picker"
    :class="[`mm-date-picker--${triggerVariant}`, { 'is-open': panelOpen }]"
    data-mm-component="date-picker"
  >
    <MmPopover
      v-model="panelOpen"
      trigger="manual"
      placement="bottom-start"
      :offset="5"
      :show-arrow="false"
      :floating-class="resolvedPanelFloatingClass"
      :width="panelWidth"
      role="presentation"
    >
      <MmInput
        :id="field.id.value"
        :model-value="draft"
        :name="name"
        :placeholder="type === 'daterange' ? (placeholder ?? messages.datePicker.chooseDateRange) : resolvedPlaceholder"
        :clearable="clearable"
        :disabled="field.disabled.value"
        :readonly="readonly || !editable"
        :size="field.size.value"
        :status="field.status.value"
        autocomplete="off"
        role="combobox"
        aria-haspopup="grid"
        :aria-controls="panelId"
        :aria-expanded="panelOpen ? 'true' : 'false'"
        @update:model-value="draft = $event; invalid = false"
        @click="showPanel"
        @keydown="onKeydown"
        @blur="commitDraft"
        @clear="clear"
      >
        <template v-if="triggerVariant === 'filter'" #prefix>
          <MmIcon class="mm-date-picker__calendar-icon" name="calendar" :size="13" />
        </template>
        <template #suffix>
          <MmIcon
            v-if="triggerVariant === 'filter'"
            class="mm-date-picker__toggle-icon"
            :name="panelOpen ? 'chevron-up' : 'chevron-down'"
            :size="12"
          />
          <span v-else class="mm-date-picker__icon" aria-hidden="true">▦</span>
        </template>
      </MmInput>

      <template #content>
        <div class="mm-date-picker__panel" :class="panelClass">
          <slot name="panel-before" :value="internalValue" :close="() => panelOpen = false" />
          <MmDatePickerPanel
            :id="panelId"
            :compact="panelCompact"
            :model-value="internalValue"
            :displayed-month="displayedMonth"
            :selection-mode="type === 'daterange' ? 'range' : 'single'"
            :min="min"
            :max="max"
            :disabled-date="disabledDate"
            @update:displayed-month="displayedMonth = $event"
            @update:model-value="onPanelUpdate"
            @select="onPanelSelect"
          />
          <slot name="panel-after" :value="internalValue" :close="() => panelOpen = false" />
        </div>
      </template>
    </MmPopover>
  </div>
</template>

<style src="./date-picker.css"></style>
