export type AlertType = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  banner?: boolean
  center?: boolean
  closable?: boolean
  description?: string
  showIcon?: boolean
  title?: string
  type?: AlertType
}
