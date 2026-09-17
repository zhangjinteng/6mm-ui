import type { Component } from 'vue'

export type SegmentedSize = 'lg' | 'md' | 'sm'
export type SegmentedValue = number | string

export interface SegmentedOption {
  disabled?: boolean
  icon?: Component
  label: string
  value: SegmentedValue
}

export interface SegmentedProps {
  block?: boolean
  disabled?: boolean
  modelValue?: SegmentedValue
  name?: string
  options?: Array<SegmentedOption | SegmentedValue>
  size?: SegmentedSize
}
