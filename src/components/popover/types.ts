import type { FloatingPlacement } from '../../composables/use-floating'

export type PopoverTrigger = 'click' | 'focus' | 'hover' | 'hover-focus' | 'manual'

export interface PopoverProps {
  closeDelay?: number
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  disabled?: boolean
  floatingClass?: string
  modelValue?: boolean
  offset?: number
  openDelay?: number
  persistent?: boolean
  placement?: FloatingPlacement
  role?: string
  showArrow?: boolean
  teleport?: boolean
  teleportTo?: string | HTMLElement
  trigger?: PopoverTrigger
  width?: number | string
}

export interface PopoverExpose {
  close: (restoreFocus?: boolean) => void
  open: () => void
  toggle: () => void
  updatePosition: () => void
}
