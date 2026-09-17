export type BorderStyleType = 'dashed' | 'dotted' | 'none' | 'solid'
export type BorderRadius = 'lg' | 'md' | 'none' | 'round' | 'sm' | 'xl' | string

export interface BorderProps {
  as?: string
  background?: string
  color?: string
  interactive?: boolean
  padding?: number | string
  radius?: BorderRadius
  styleType?: BorderStyleType
  width?: number | string
}
