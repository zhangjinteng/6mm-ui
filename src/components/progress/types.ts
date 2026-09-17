export type ProgressStatus = 'error' | 'normal' | 'success' | 'warning'
export type ProgressType = 'circle' | 'line'

export interface ProgressProps {
  ariaLabel?: string
  color?: string
  format?: (percentage: number) => string
  percentage?: number
  showText?: boolean
  size?: number
  status?: ProgressStatus
  strokeWidth?: number
  type?: ProgressType
}
