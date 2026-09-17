<script setup lang="ts">
import { computed, provide, ref } from 'vue'

import { useFormField } from '../../composables/use-form-field'
import { useId } from '../../composables/use-id'
import { radioGroupKey, type RadioGroupProps, type RadioValue } from './types'

defineOptions({ name: 'MmRadioGroup' })

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: false,
  direction: 'horizontal',
  modelValue: undefined,
  readonly: false,
  size: undefined,
  status: undefined,
})
const emit = defineEmits<{
  change: [value: RadioValue]
  'update:modelValue': [value: RadioValue]
}>()
const generatedName = useId('mm-radio-group')
const root = ref<HTMLElement>()
const field = useFormField({ disabled: () => props.disabled, id: () => props.id, size: () => props.size, status: () => props.status })
const modelValue = computed(() => props.modelValue)
const name = computed(() => props.name || generatedName)

function change(value: RadioValue): void {
  if (Object.is(value, props.modelValue)) return
  emit('update:modelValue', value)
  emit('change', value)
  void field.onChange()
}

function move(current: HTMLInputElement, direction: 1 | -1): void {
  const radios = Array.from(root.value?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? [])
    .filter((radio) => !radio.disabled)
  if (radios.length < 2) return
  const index = radios.indexOf(current)
  const next = radios[(index + direction + radios.length) % radios.length]
  next?.focus()
  if (next) {
    next.checked = true
    next.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

provide(radioGroupKey, {
  change,
  disabled: field.disabled,
  modelValue,
  move,
  name,
  readonly: computed(() => props.readonly),
  root,
  size: field.size,
  status: field.status,
})
</script>

<template>
  <div
    :id="field.id.value"
    ref="root"
    class="mm-radio-group"
    :class="[`mm-radio-group--${direction}`, field.status.value && `is-${field.status.value}`, { 'is-readonly': readonly }]"
    data-mm-component="radio-group"
    role="radiogroup"
    :aria-describedby="field.describedBy.value"
    :aria-labelledby="field.labelledBy.value"
    :aria-invalid="field.status.value === 'error' ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
  ><slot /></div>
</template>

<style src="./radio.css"></style>
