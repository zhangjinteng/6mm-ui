import type { IconName } from './icons'

export type IconSize = number | string

export type { IconName } from './icons'

export interface IconProps {
  color?: string
  label?: string
  name?: IconName
  size?: IconSize
  spin?: boolean
  strokeWidth?: number
}
