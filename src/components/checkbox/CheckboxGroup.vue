<script setup lang="ts">
import { computed, provide } from 'vue'

import { useFormField } from '../../composables/use-form-field'
import { useId } from '../../composables/use-id'
import { checkboxGroupKey, type CheckboxGroupProps, type CheckboxValue } from './types'

defineOptions({ name: 'MmCheckboxGroup' })

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  disabled: false,
  direction: 'horizontal',
  max: Number.POSITIVE_INFINITY,
  min: 0,
  modelValue: () => [],
  readonly: false,
  size: undefined,
  status: undefined,
})
const emit = defineEmits<{
  change: [value: CheckboxValue[]]
  'update:modelValue': [value: CheckboxValue[]]
}>()
const generatedName = useId('mm-checkbox-group')
const field = useFormField({ disabled: () => props.disabled, id: () => props.id, size: () => props.size, status: () => props.status })
const values = computed(() => props.modelValue)
const name = computed(() => props.name || generatedName)

function change(value: CheckboxValue, checked: boolean): void {
  const next = checked
    ? [...values.value, value].filter((item, index, source) => source.findIndex((entry) => Object.is(entry, item)) === index)
    : values.value.filter((item) => !Object.is(item, value))
  if (next.length < props.min || next.length > props.max) return
  emit('update:modelValue', next)
  emit('change', next)
  void field.onChange()
}

function isLimitDisabled(_value: CheckboxValue, checked: boolean): boolean {
  return checked ? values.value.length <= props.min : values.value.length >= props.max
}

provide(checkboxGroupKey, {
  change,
  disabled: field.disabled,
  isLimitDisabled,
  modelValue: values,
  name,
  readonly: computed(() => props.readonly),
  size: field.size,
  status: field.status,
})
</script>

<template>
  <div
    :id="field.id.value"
    class="mm-checkbox-group"
    :class="[`mm-checkbox-group--${direction}`, field.status.value && `is-${field.status.value}`, { 'is-readonly': readonly }]"
    data-mm-component="checkbox-group"
    role="group"
    :aria-describedby="field.describedBy.value"
    :aria-labelledby="field.labelledBy.value"
    :aria-invalid="field.status.value === 'error' ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
  >
    <slot />
  </div>
</template>

<style src="./checkbox.css"></style>
