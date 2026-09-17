<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'

import { useId } from '../../composables/use-id'
import { useLocale } from '../../composables/use-locale'
import {
  cloneFormValue,
  formContextKey,
  formItemContextKey,
  getPathValue,
  setPathValue,
  type FormItemContext,
  type FormRule,
  type FormValidateState,
  type FormValidateTrigger,
} from '../../shared/form'
import type { FormItemProps } from './types'

defineOptions({ name: 'MmFormItem' })

const props = withDefaults(defineProps<FormItemProps>(), {
  error: '',
  labelWidth: undefined,
  required: false,
  rules: undefined,
  showMessage: undefined,
})
const form = inject(formContextKey, null)
const { messages } = useLocale()
const rootRef = ref<HTMLElement>()
const validateState = ref<FormValidateState>('')
const validateMessage = ref('')
const inputId = useId('mm-form-control')
const labelId = useId('mm-form-label')
const errorId = useId('mm-form-error')
let initialValue: unknown
let validationRun = 0

const normalizedRules = computed<FormRule[]>(() => {
  const local = props.rules ? (Array.isArray(props.rules) ? props.rules : [props.rules]) : []
  const inherited = props.prop ? form?.rules.value[props.prop] : undefined
  const formRules = inherited ? (Array.isArray(inherited) ? inherited : [inherited]) : []
  const allRules = [...formRules, ...local]
  if (props.required && !allRules.some((rule) => rule.required)) allRules.unshift({ required: true })
  return allRules
})
const isRequired = computed(() => props.required || normalizedRules.value.some((rule) => rule.required))
const showMessage = computed(() => props.showMessage ?? form?.showMessage.value ?? true)
const labelPosition = computed(() => form?.labelPosition.value ?? 'right')
const labelWidth = computed(() => props.labelWidth ?? form?.labelWidth.value)
const labelStyle = computed(() => {
  if (labelPosition.value === 'top' || labelWidth.value === undefined) return undefined
  return { width: typeof labelWidth.value === 'number' ? `${labelWidth.value}px` : labelWidth.value }
})

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

function valueSize(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (typeof value === 'string' || Array.isArray(value)) return value.length
  return undefined
}

function ruleMessage(rule: FormRule, fallback: string): string {
  return rule.message || fallback
}

async function checkRule(rule: FormRule, value: unknown): Promise<string | undefined> {
  if (rule.required && isEmpty(value)) {
    return ruleMessage(rule, messages.value.form.required(props.label || props.prop || messages.value.form.field))
  }
  if (isEmpty(value)) return undefined

  const size = valueSize(value)
  if (rule.len !== undefined && size !== rule.len) return ruleMessage(rule, messages.value.form.wrongLength(rule.len))
  if (rule.min !== undefined && size !== undefined && size < rule.min) return ruleMessage(rule, messages.value.form.min(rule.min))
  if (rule.max !== undefined && size !== undefined && size > rule.max) return ruleMessage(rule, messages.value.form.max(rule.max))
  if (rule.pattern) {
    rule.pattern.lastIndex = 0
    if (!rule.pattern.test(String(value))) return ruleMessage(rule, messages.value.form.invalidFormat)
  }
  if (rule.validator) {
    try {
      const result = await rule.validator(value, form?.model.value ?? {})
      if (result === false) return ruleMessage(rule, messages.value.form.invalid)
      if (typeof result === 'string') return result
      if (result instanceof Error) return result.message
    } catch (error) {
      return error instanceof Error ? error.message : ruleMessage(rule, messages.value.form.invalid)
    }
  }
  return undefined
}

async function validate(trigger: FormValidateTrigger = 'submit'): Promise<boolean> {
  const run = ++validationRun
  const rules = normalizedRules.value.filter((rule) => {
    if (trigger === 'submit' || !rule.trigger) return true
    return (Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]).includes(trigger)
  })
  if (!rules.length) return true

  validateState.value = 'validating'
  const value = getPathValue(form?.model.value, props.prop)
  for (const rule of rules) {
    const message = await checkRule(rule, value)
    if (run !== validationRun) return false
    if (message) {
      validateState.value = 'error'
      validateMessage.value = message
      return false
    }
  }
  validateState.value = 'success'
  validateMessage.value = ''
  return true
}

function clearValidate(): void {
  validationRun++
  validateState.value = ''
  validateMessage.value = ''
}

function resetField(): void {
  if (form && props.prop) setPathValue(form.model.value, props.prop, cloneFormValue(initialValue))
  void nextTick(clearValidate)
}

function scrollIntoView(options?: ScrollIntoViewOptions): void {
  rootRef.value?.scrollIntoView?.(options)
  rootRef.value?.querySelector<HTMLElement>('input:not(:disabled), textarea:not(:disabled), select:not(:disabled), button:not(:disabled)')?.focus()
}

const context: FormItemContext = {
  clearValidate,
  errorId,
  inputId,
  labelId,
  prop: props.prop,
  resetField,
  scrollIntoView,
  validate,
  validateMessage,
  validateState,
}

provide(formItemContextKey, context)

watch(() => props.error, (error) => {
  validateMessage.value = error
  validateState.value = error ? 'error' : ''
}, { immediate: true })

onMounted(() => {
  initialValue = cloneFormValue(getPathValue(form?.model.value, props.prop))
  if (props.prop) form?.addField(context)
})
onBeforeUnmount(() => form?.removeField(context))

defineExpose({ clearValidate, resetField, validate, validateMessage, validateState })
</script>

<template>
  <div
    ref="rootRef"
    class="mm-form-item"
    :class="[
      `mm-form-item--label-${labelPosition}`,
      validateState && `is-${validateState}`,
      { 'is-required': isRequired },
    ]"
    :data-prop="prop"
    data-mm-component="form-item"
  >
    <label v-if="$slots.label || label" :id="labelId" class="mm-form-item__label" :for="inputId" :style="labelStyle">
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="mm-form-item__body">
      <div class="mm-form-item__control"><slot /></div>
      <p v-if="showMessage && validateMessage" :id="errorId" class="mm-form-item__error" role="alert">{{ validateMessage }}</p>
    </div>
  </div>
</template>

<style src="./form.css"></style>
