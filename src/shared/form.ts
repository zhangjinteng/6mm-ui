import { toRaw, type ComputedRef, type InjectionKey, type Ref } from 'vue'

export type FormControlSize = 'sm' | 'md' | 'lg'
export type FormControlStatus = 'error' | 'success' | 'warning'
export type FormLabelPosition = 'left' | 'right' | 'top'
export type FormValidateState = '' | 'validating' | 'success' | 'error'
export type FormValidateTrigger = 'blur' | 'change' | 'submit'
export type FormModel = Record<string, unknown>

export type FormValidatorResult = boolean | string | Error | void
export type FormValidator = (
  value: unknown,
  model: FormModel,
) => FormValidatorResult | Promise<FormValidatorResult>

export interface FormRule {
  len?: number
  max?: number
  message?: string
  min?: number
  pattern?: RegExp
  required?: boolean
  trigger?: FormValidateTrigger | FormValidateTrigger[]
  validator?: FormValidator
}

export type FormRules = Record<string, FormRule | FormRule[]>

export interface FormItemContext {
  clearValidate: () => void
  errorId: string
  inputId: string
  labelId: string
  prop?: string
  resetField: () => void
  scrollIntoView: (options?: ScrollIntoViewOptions) => void
  validate: (trigger?: FormValidateTrigger) => Promise<boolean>
  validateMessage: Ref<string>
  validateState: Ref<FormValidateState>
}

export interface FormContext {
  addField: (field: FormItemContext) => void
  disabled: ComputedRef<boolean>
  labelPosition: ComputedRef<FormLabelPosition>
  labelWidth: ComputedRef<number | string | undefined>
  model: ComputedRef<FormModel>
  removeField: (field: FormItemContext) => void
  rules: ComputedRef<FormRules>
  showMessage: ComputedRef<boolean>
  size: ComputedRef<FormControlSize>
}

export const formContextKey: InjectionKey<FormContext> = Symbol('mm-form')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('mm-form-item')

export function getPathValue(source: unknown, path?: string): unknown {
  if (!path) return source
  return path
    .replace(/\[(\w+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .reduce<unknown>((value, key) => {
      if (value === null || typeof value !== 'object') return undefined
      return (value as Record<string, unknown>)[key]
    }, source)
}

export function setPathValue(source: FormModel, path: string, value: unknown): void {
  const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.').filter(Boolean)
  if (!keys.length) return

  let target: Record<string, unknown> = source
  for (const key of keys.slice(0, -1)) {
    const child = target[key]
    if (child === null || typeof child !== 'object') target[key] = {}
    target = target[key] as Record<string, unknown>
  }
  target[keys.at(-1)!] = value
}

export function cloneFormValue<T>(value: T): T {
  if (value === undefined || value === null) return value
  const rawValue = typeof value === 'object' ? toRaw(value) : value
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(rawValue)
    } catch {
      // JSON serialization below safely handles Vue proxies and older browsers.
    }
  }
  return JSON.parse(JSON.stringify(value)) as T
}
