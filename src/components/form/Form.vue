<script setup lang="ts">
import { computed, provide } from 'vue'

import { formContextKey, type FormItemContext } from '../../shared/form'
import type { FormProps, FormValidateCallback } from './types'

defineOptions({ name: 'MmForm' })

const props = withDefaults(defineProps<FormProps>(), {
  disabled: false,
  inline: false,
  labelPosition: 'right',
  labelWidth: undefined,
  rules: () => ({}),
  scrollToError: false,
  showMessage: true,
  size: 'md',
})
const emit = defineEmits<{ submit: [event: SubmitEvent] }>()
const fields = new Set<FormItemContext>()

const normalizedProps = (propsToValidate?: string | string[]): string[] | undefined => {
  if (propsToValidate === undefined) return undefined
  return Array.isArray(propsToValidate) ? propsToValidate : [propsToValidate]
}

function selectFields(propsToValidate?: string | string[]): FormItemContext[] {
  const names = normalizedProps(propsToValidate)
  return [...fields].filter((field) => !names || (field.prop && names.includes(field.prop)))
}

async function runValidation(selected: FormItemContext[], callback?: FormValidateCallback): Promise<boolean> {
  const results = await Promise.all(selected.map(async (field) => ({ field, valid: await field.validate('submit') })))
  const invalidFields = results.reduce<Record<string, string>>((result, entry) => {
    if (!entry.valid && entry.field.prop) result[entry.field.prop] = entry.field.validateMessage.value
    return result
  }, {})
  const valid = results.every((entry) => entry.valid)

  if (!valid && props.scrollToError) results.find((entry) => !entry.valid)?.field.scrollIntoView({ behavior: 'smooth', block: 'center' })
  callback?.(valid, invalidFields)
  return valid
}

function validate(callback?: FormValidateCallback): Promise<boolean> {
  return runValidation(selectFields(), callback)
}

function validateField(propsToValidate: string | string[], callback?: FormValidateCallback): Promise<boolean> {
  return runValidation(selectFields(propsToValidate), callback)
}

function resetFields(propsToReset?: string | string[]): void {
  selectFields(propsToReset).forEach((field) => field.resetField())
}

function clearValidate(propsToClear?: string | string[]): void {
  selectFields(propsToClear).forEach((field) => field.clearValidate())
}

function scrollToField(prop: string, options?: ScrollIntoViewOptions): void {
  selectFields(prop)[0]?.scrollIntoView(options)
}

provide(formContextKey, {
  addField: (field) => fields.add(field),
  disabled: computed(() => props.disabled),
  labelPosition: computed(() => props.labelPosition),
  labelWidth: computed(() => props.labelWidth),
  model: computed(() => props.model),
  removeField: (field) => fields.delete(field),
  rules: computed(() => props.rules),
  showMessage: computed(() => props.showMessage),
  size: computed(() => props.size),
})

defineExpose({ clearValidate, resetFields, scrollToField, validate, validateField })
</script>

<template>
  <form
    class="mm-form"
    :class="[`mm-form--label-${labelPosition}`, { 'is-inline': inline }]"
    data-mm-component="form"
    novalidate
    @submit="emit('submit', $event)"
  ><slot /></form>
</template>

<style src="./form.css"></style>
