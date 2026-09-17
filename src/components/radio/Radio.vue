<script setup lang="ts">
import { computed, inject, ref } from 'vue'

import { useFormField } from '../../composables/use-form-field'
import { useId } from '../../composables/use-id'
import { radioGroupKey, type RadioProps, type RadioValue } from './types'

defineOptions({ name: 'MmRadio' })

const props = withDefaults(defineProps<RadioProps>(), {
  button: false,
  disabled: false,
  modelValue: undefined,
  readonly: false,
  size: undefined,
  status: undefined,
})
const emit = defineEmits<{
  change: [value: RadioValue, event: Event]
  'update:modelValue': [value: RadioValue]
}>()
const group = inject(radioGroupKey, null)
const ownId = useId('mm-radio')
const inputRef = ref<HTMLInputElement>()
const field = useFormField({
  disabled: () => props.disabled,
  id: () => props.id || (group ? ownId : undefined),
  size: () => props.size || group?.size.value,
  status: () => props.status || group?.status.value,
})
const checked = computed(() => Object.is(group?.modelValue.value ?? props.modelValue, props.value))
const disabled = computed(() => field.disabled.value || Boolean(group?.disabled.value))
const isReadonly = computed(() => props.readonly || Boolean(group?.readonly.value))
const name = computed(() => group?.name.value || props.name)

function onChange(event: Event): void {
  if (isReadonly.value) {
    const radios = Array.from(group?.root.value?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? [])
    radios.forEach((radio) => { radio.checked = radio.value === String(group?.modelValue.value) })
    if (!group && inputRef.value) inputRef.value.checked = checked.value
    return
  }
  if (group) group.change(props.value)
  else {
    emit('update:modelValue', props.value)
    emit('change', props.value, event)
    void field.onChange()
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (!group || !inputRef.value || isReadonly.value) return
  const direction = ['ArrowRight', 'ArrowDown'].includes(event.key)
    ? 1
    : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0
  if (!direction) return
  event.preventDefault()
  group.move(inputRef.value, direction)
}
</script>

<template>
  <label
    class="mm-radio"
    :class="[`mm-radio--${field.size.value}`, field.status.value && `is-${field.status.value}`, { 'mm-radio--button': button, 'is-checked': checked, 'is-disabled': disabled, 'is-readonly': isReadonly }]"
    data-mm-component="radio"
  >
    <input
      :id="field.id.value"
      ref="inputRef"
      class="mm-radio__native"
      type="radio"
      :name="name"
      :value="String(value)"
      :checked="checked"
      :disabled="disabled"
      :aria-describedby="field.describedBy.value"
      :aria-readonly="isReadonly ? 'true' : undefined"
      @change="onChange"
      @keydown="onKeydown"
      @blur="field.onBlur"
    />
    <span v-if="!button" class="mm-radio__circle" aria-hidden="true"><span /></span>
    <span class="mm-radio__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style src="./radio.css"></style>
