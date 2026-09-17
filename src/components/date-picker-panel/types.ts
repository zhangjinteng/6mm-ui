export type DateRangeValue = [string, string]
export type DatePickerValue = string | DateRangeValue | null
export type DateSelectionMode = 'range' | 'single'

export interface DatePickerPanelProps {
  compact?: boolean
  disabledDate?: (date: string) => boolean
  displayedMonth?: string
  firstDayOfWeek?: 0 | 1
  max?: string
  min?: string
  modelValue?: DatePickerValue
  selectionMode?: DateSelectionMode
}
