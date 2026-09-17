<script setup lang="ts">
import { computed, inject } from 'vue'

import { useFormField } from '../../composables/use-form-field'
import { useId } from '../../composables/use-id'
import { checkboxGroupKey, type CheckboxProps, type CheckboxValue } from './types'

defineOptions({ name: 'MmCheckbox' })

const props = withDefaults(defineProps<CheckboxProps>(), {
  disabled: false,
  falseValue: false,
  indeterminate: false,
  modelValue: false,
  readonly: false,
  size: undefined,
  status: undefined,
  trueValue: true,
  value: undefined,
})
const emit = defineEmits<{
  change: [value: CheckboxValue, event: Event]
  'update:modelValue': [value: CheckboxValue]
}>()
const group = inject(checkboxGroupKey, null)
const ownId = useId('mm-checkbox')
const field = useFormField({
  disabled: () => props.disabled,
  id: () => props.id || (group ? ownId : undefined),
  size: () => props.size || group?.size.value,
  status: () => props.status || group?.status.value,
})
const optionValue = computed<CheckboxValue>(() => props.value ?? props.trueValue)
const checked = computed(() => group
  ? group.modelValue.value.some((value) => Object.is(value, optionValue.value))
  : Object.is(props.modelValue, props.trueValue))
const disabled = computed(() => field.disabled.value || Boolean(group?.disabled.value) || Boolean(group?.isLimitDisabled(optionValue.value, checked.value)))
const isReadonly = computed(() => props.readonly || Boolean(group?.readonly.value))
const name = computed(() => group?.name.value || props.name)

function onChange(event: Event): void {
  const nextChecked = (event.target as HTMLInputElement).checked
  if (isReadonly.value) {
    ;(event.target as HTMLInputElement).checked = checked.value
    return
  }
  if (group) group.change(optionValue.value, nextChecked)
  else {
    const value = nextChecked ? props.trueValue : props.falseValue
    emit('update:modelValue', value)
    emit('change', value, event)
    void field.onChange()
  }
}
</script>

<template>
  <label
    class="mm-checkbox"
    :class="[`mm-checkbox--${field.size.value}`, field.status.value && `is-${field.status.value}`, { 'is-checked': checked, 'is-disabled': disabled, 'is-indeterminate': indeterminate, 'is-readonly': isReadonly }]"
    data-mm-component="checkbox"
  >
    <input
      :id="field.id.value"
      class="mm-checkbox__native"
      type="checkbox"
      :name="name"
      :value="String(optionValue)"
      :checked="checked"
      :indeterminate="indeterminate"
      :disabled="disabled"
      :aria-checked="indeterminate ? 'mixed' : checked"
      :aria-describedby="field.describedBy.value"
      :aria-readonly="isReadonly ? 'true' : undefined"
      @change="onChange"
      @blur="field.onBlur"
    />
    <span class="mm-checkbox__box" aria-hidden="true"><span>{{ indeterminate ? '−' : '✓' }}</span></span>
    <span v-if="$slots.default || label" class="mm-checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style src="./checkbox.css"></style>
