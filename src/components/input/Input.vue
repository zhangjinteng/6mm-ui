<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

import { useFormField } from '../../composables/use-form-field'
import { useLocale } from '../../composables/use-locale'
import type { InputProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmInput' })

const props = withDefaults(defineProps<InputProps>(), {
  autocomplete: undefined,
  clearable: false,
  disabled: false,
  maxlength: undefined,
  minlength: undefined,
  modelValue: '',
  readonly: false,
  showCount: false,
  showPassword: false,
  size: undefined,
  status: undefined,
  type: 'text',
})
const emit = defineEmits<{
  blur: [event: FocusEvent]
  change: [event: Event]
  clear: []
  focus: [event: FocusEvent]
  input: [event: Event]
  'update:modelValue': [value: string]
}>()
const { messages } = useLocale()

const attrs = useAttrs()
const inputRef = ref<HTMLInputElement>()
const passwordVisible = ref(false)
const composing = ref(false)
const field = useFormField({
  disabled: () => props.disabled,
  id: () => props.id,
  size: () => props.size,
  status: () => props.status,
})
const stringValue = computed(() => props.modelValue == null ? '' : String(props.modelValue))
const nativeType = computed(() =>
  props.showPassword && props.type === 'password' && passwordVisible.value ? 'text' : props.type,
)
const canClear = computed(() => props.clearable && stringValue.value.length > 0 && !field.disabled.value && !props.readonly)
const hasEndContent = computed(() => canClear.value || props.showPassword || props.showCount)
const describedBy = computed(() => [field.describedBy.value, attrs['aria-describedby']]
  .filter((value): value is string => typeof value === 'string' && value.length > 0)
  .join(' ') || undefined)

function updateValue(event: Event): void {
  if (composing.value) return
  emit('update:modelValue', (event.target as HTMLInputElement).value)
  emit('input', event)
  void field.onChange()
}

function onCompositionEnd(event: CompositionEvent): void {
  composing.value = false
  updateValue(event)
}

function onBlur(event: FocusEvent): void {
  emit('blur', event)
  void field.onBlur()
}

function onChange(event: Event): void {
  emit('change', event)
}

function clear(): void {
  emit('update:modelValue', '')
  emit('clear')
  void field.onChange()
  inputRef.value?.focus()
}

defineExpose({
  blur: () => inputRef.value?.blur(),
  focus: () => inputRef.value?.focus(),
  get input() { return inputRef.value },
  select: () => inputRef.value?.select(),
})
</script>

<template>
  <span
    class="mm-input"
    :class="[
      `mm-input--${field.size.value}`,
      field.status.value && `is-${field.status.value}`,
      { 'is-disabled': field.disabled.value, 'is-readonly': readonly, 'is-focused-content': hasEndContent },
    ]"
    data-mm-component="input"
  >
    <span v-if="$slots.prepend" class="mm-input__prepend"><slot name="prepend" /></span>
    <span class="mm-input__control">
      <span v-if="$slots.prefix" class="mm-input__prefix"><slot name="prefix" /></span>
      <input
        v-bind="attrs"
        :id="field.id.value"
        ref="inputRef"
        class="mm-input__native"
        :value="stringValue"
        :type="nativeType"
        :name="name"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :minlength="minlength"
        :disabled="field.disabled.value"
        :readonly="readonly"
        :aria-describedby="describedBy"
        :aria-invalid="field.status.value === 'error' ? 'true' : undefined"
        @input="updateValue"
        @change="onChange"
        @focus="emit('focus', $event)"
        @blur="onBlur"
        @compositionstart="composing = true"
        @compositionend="onCompositionEnd"
      />
      <span v-if="$slots.suffix" class="mm-input__suffix"><slot name="suffix" /></span>
      <span v-if="hasEndContent" class="mm-input__actions">
        <button v-if="canClear" class="mm-input__action mm-input__clear" type="button" :aria-label="messages.input.clear" @click="clear">×</button>
        <button
          v-if="showPassword"
          class="mm-input__action mm-input__password"
          type="button"
          :aria-label="passwordVisible ? messages.input.hidePassword : messages.input.showPassword"
          :aria-pressed="passwordVisible"
          :disabled="field.disabled.value"
          @click="passwordVisible = !passwordVisible"
        >{{ passwordVisible ? '◉' : '◎' }}</button>
        <span v-if="showCount" class="mm-input__count" aria-live="polite">
          {{ stringValue.length }}<template v-if="maxlength"> / {{ maxlength }}</template>
        </span>
      </span>
    </span>
    <span v-if="$slots.append" class="mm-input__append"><slot name="append" /></span>
  </span>
</template>

<style src="./input.css"></style>
