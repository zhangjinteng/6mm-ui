export type TextSize = 'lg' | 'md' | 'sm' | 'xl' | 'xs'
export type TextTone = 'danger' | 'default' | 'muted' | 'primary' | 'subtle' | 'success' | 'warning'
export type TextWeight = 'bold' | 'medium' | 'regular' | 'semibold'

export interface TextProps {
  as?: string
  lineClamp?: number
  size?: TextSize
  tone?: TextTone
  truncate?: boolean
  weight?: TextWeight
}
