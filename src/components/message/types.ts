export type MessageType = 'error' | 'info' | 'success' | 'warning'

export interface MessageProps {
  closable?: boolean
  duration?: number
  message: string
  showIcon?: boolean
  type?: MessageType
}
