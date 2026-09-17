import type { Component } from 'vue'

export type StepStatus = 'error' | 'finish' | 'process' | 'wait'
export type StepsDirection = 'horizontal' | 'vertical'

export interface StepItem {
  description?: string
  disabled?: boolean
  icon?: Component
  status?: StepStatus
  title: string
}

export interface StepsProps {
  clickable?: boolean
  current?: number
  direction?: StepsDirection
  items?: StepItem[]
  status?: Extract<StepStatus, 'error' | 'process'>
}
