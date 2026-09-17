export type ButtonNativeType = 'button' | 'reset' | 'submit'
export type ButtonSize = 'lg' | 'md' | 'sm'
export type ButtonVariant = 'danger' | 'default' | 'primary' | 'success' | 'text' | 'warning'

export interface ButtonProps {
  block?: boolean
  disabled?: boolean
  iconOnly?: boolean
  loading?: boolean
  nativeType?: ButtonNativeType
  plain?: boolean
  round?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}
