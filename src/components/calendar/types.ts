import type { DatePickerValue } from '../date-picker-panel'

export interface CalendarProps {
  disabledDate?: (date: string) => boolean
  displayedMonth?: string
  firstDayOfWeek?: 0 | 1
  max?: string
  min?: string
  modelValue?: DatePickerValue
}
