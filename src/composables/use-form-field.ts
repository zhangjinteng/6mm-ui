import { computed, inject, toValue, type MaybeRefOrGetter } from 'vue'

import {
  formContextKey,
  formItemContextKey,
  type FormControlSize,
  type FormControlStatus,
} from '../shared/form'
import { useId } from './use-id'

export interface UseFormFieldOptions {
  disabled?: MaybeRefOrGetter<boolean | undefined>
  id?: MaybeRefOrGetter<string | undefined>
  size?: MaybeRefOrGetter<FormControlSize | undefined>
  status?: MaybeRefOrGetter<FormControlStatus | undefined>
}

export function useFormField(options: UseFormFieldOptions = {}) {
  const form = inject(formContextKey, null)
  const formItem = inject(formItemContextKey, null)
  const generatedId = useId('mm-field')

  const id = computed(() => toValue(options.id) || formItem?.inputId || generatedId)
  const disabled = computed(() => Boolean(toValue(options.disabled) || form?.disabled.value))
  const size = computed<FormControlSize>(() => toValue(options.size) || form?.size.value || 'md')
  const status = computed<FormControlStatus | undefined>(() => {
    const explicitStatus = toValue(options.status)
    if (explicitStatus) return explicitStatus
    return formItem?.validateState.value === 'error' ? 'error' : undefined
  })
  const describedBy = computed(() =>
    formItem?.validateMessage.value ? formItem.errorId : undefined,
  )
  const labelledBy = computed(() => formItem ? formItem.labelId : undefined)

  return {
    describedBy,
    disabled,
    form,
    formItem,
    id,
    labelledBy,
    onBlur: () => formItem?.validate('blur'),
    onChange: () => formItem?.validate('change'),
    size,
    status,
  }
}
