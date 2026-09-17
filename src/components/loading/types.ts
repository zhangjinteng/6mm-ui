export type LoadingSize = 'sm' | 'md' | 'lg'

export interface LoadingProps {
  backdrop?: boolean
  fullscreen?: boolean
  size?: LoadingSize
  text?: string
  visible?: boolean
}
