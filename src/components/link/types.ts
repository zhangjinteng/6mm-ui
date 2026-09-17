export type LinkUnderline = 'always' | 'hover' | 'never'
export type LinkTone = 'danger' | 'default' | 'muted' | 'primary'

export interface LinkProps {
  disabled?: boolean
  external?: boolean
  href?: string
  rel?: string
  target?: string
  tone?: LinkTone
  underline?: LinkUnderline
}
