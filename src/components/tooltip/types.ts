import type { FloatingPlacement } from '../../composables/use-floating'

export interface TooltipProps {
  closeDelay?: number
  content?: string
  disabled?: boolean
  offset?: number
  openDelay?: number
  placement?: FloatingPlacement
  showArrow?: boolean
  teleport?: boolean
}
