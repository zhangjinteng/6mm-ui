export type MessageBoxType = 'alert' | 'confirm' | 'prompt'
export type MessageBoxAction = 'cancel' | 'close' | 'confirm'
export type MessageBoxInputValidator = (value: string) => boolean | string | Promise<boolean | string>

export interface MessageBoxProps {
  cancelButtonText?: string
  closeOnClickModal?: boolean
  closeOnEscape?: boolean
  confirmButtonText?: string
  inputPlaceholder?: string
  inputValidator?: MessageBoxInputValidator
  inputValue?: string
  message?: string
  modelValue?: boolean
  title?: string
  type?: MessageBoxType
}
