import type { FormControlSize, FormControlStatus } from '../../shared/form'

export interface InputProps {
  autocomplete?: string
  clearable?: boolean
  disabled?: boolean
  id?: string
  maxlength?: number
  minlength?: number
  modelValue?: string | number | null
  name?: string
  placeholder?: string
  readonly?: boolean
  showCount?: boolean
  showPassword?: boolean
  size?: FormControlSize
  status?: FormControlStatus
  type?: string
}

export interface InputExpose {
  blur: () => void
  focus: () => void
  input: HTMLInputElement | undefined
  select: () => void
}
