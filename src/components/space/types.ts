import type { LayoutAlign } from '../layout'

export type SpaceDirection = 'horizontal' | 'vertical'

export interface SpaceProps {
  align?: LayoutAlign
  as?: string
  direction?: SpaceDirection
  separator?: string
  size?: number | string
  wrap?: boolean
}
