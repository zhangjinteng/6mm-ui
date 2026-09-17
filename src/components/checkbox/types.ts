import type { ComputedRef, InjectionKey } from 'vue'

import type { FormControlSize, FormControlStatus } from '../../shared/form'

export type CheckboxValue = string | number | boolean

export interface CheckboxProps {
  disabled?: boolean
  falseValue?: CheckboxValue
  id?: string
  indeterminate?: boolean
  label?: string
  modelValue?: CheckboxValue
  name?: string
  readonly?: boolean
  size?: FormControlSize
  status?: FormControlStatus
  trueValue?: CheckboxValue
  value?: CheckboxValue
}

export interface CheckboxGroupProps {
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  id?: string
  max?: number
  min?: number
  modelValue?: CheckboxValue[]
  name?: string
  readonly?: boolean
  size?: FormControlSize
  status?: FormControlStatus
}

export interface CheckboxGroupContext {
  change: (value: CheckboxValue, checked: boolean) => void
  disabled: ComputedRef<boolean>
  isLimitDisabled: (value: CheckboxValue, checked: boolean) => boolean
  modelValue: ComputedRef<CheckboxValue[]>
  name: ComputedRef<string>
  readonly: ComputedRef<boolean>
  size: ComputedRef<FormControlSize>
  status: ComputedRef<FormControlStatus | undefined>
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('mm-checkbox-group')
