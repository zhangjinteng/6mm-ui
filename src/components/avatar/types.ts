export type AvatarFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
export type AvatarShape = 'circle' | 'square'
export type AvatarSize = 'lg' | 'md' | 'sm' | number

export interface AvatarProps {
  alt?: string
  fallback?: string
  fit?: AvatarFit
  shape?: AvatarShape
  size?: AvatarSize
  src?: string
}
