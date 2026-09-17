import type { CSSProperties } from 'vue'

export type DialogCloseReason = 'close' | 'escape' | 'mask'
export type DialogBeforeClose = (reason: DialogCloseReason) => boolean | void | Promise<boolean | void>

export interface DialogProps {
  ariaDescribedby?: string
  beforeClose?: DialogBeforeClose
  closeOnClickModal?: boolean
  closeOnEscape?: boolean
  kind?: 'dialog' | 'drawer'
  lockScroll?: boolean
  mask?: boolean
  modelValue?: boolean
  overlayClass?: string
  panelClass?: string
  panelStyle?: CSSProperties
  showClose?: boolean
  teleportTo?: string | HTMLElement
  title?: string
  width?: number | string
}

export interface DialogExpose {
  close: (reason?: DialogCloseReason) => Promise<void>
  open: () => void
}
