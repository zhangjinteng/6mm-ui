import type { FormControlSize, FormControlStatus } from '../../shared/form'
import type { DatePickerValue } from '../date-picker-panel'

export type DatePickerType = 'date' | 'daterange'
export type DatePickerTriggerVariant = 'filter' | 'input'

export interface DatePickerProps {
  clearable?: boolean
  closeOnSelect?: boolean
  disabled?: boolean
  disabledDate?: (date: string) => boolean
  editable?: boolean
  format?: string
  id?: string
  max?: string
  min?: string
  modelValue?: DatePickerValue
  name?: string
  open?: boolean
  panelClass?: string
  panelCompact?: boolean
  panelFloatingClass?: string
  panelWidth?: number | string
  placeholder?: string
  readonly?: boolean
  size?: FormControlSize
  status?: FormControlStatus
  triggerVariant?: DatePickerTriggerVariant
  type?: DatePickerType
}
