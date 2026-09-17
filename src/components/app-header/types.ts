import type { IconName } from '../icon'

export type AppHeaderDisplay = 'auto' | 'desktop' | 'mobile'
export type AppHeaderTheme = 'dark' | 'light'
export type AppHeaderTone = 'default' | 'primary' | 'warning'
export type AppHeaderIdentityTone = 'default' | 'merchant' | 'white-label'

export interface AppHeaderBrand {
  alt?: string
  logo?: string
  title: string
}

export interface AppHeaderMetric {
  key: string
  label: string
  tone?: 'default' | 'primary'
  value: string
}

export interface AppHeaderAction {
  ariaLabel?: string
  disabled?: boolean
  icon?: IconName
  key: string
  label: string
  tone?: AppHeaderTone
}

export interface AppHeaderIdentity {
  icon?: IconName
  label: string
  tone?: AppHeaderIdentityTone
}

export interface AppHeaderProfileItem {
  disabled?: boolean
  icon?: IconName
  key: string
  label: string
  tone?: 'danger' | 'default'
}

export interface AppHeaderProfile {
  alt?: string
  email?: string
  fallback?: string
  items?: AppHeaderProfileItem[]
  src?: string
}

export interface AppHeaderProps {
  ariaLabel?: string
  brand?: AppHeaderBrand
  contextActions?: AppHeaderAction[]
  display?: AppHeaderDisplay
  identity?: AppHeaderIdentity
  metrics?: AppHeaderMetric[]
  mobileBreakpoint?: number
  mobileOpen?: boolean
  pageTitle?: string
  profile?: AppHeaderProfile
  showMobileToggle?: boolean
  showSidebarToggle?: boolean
  showThemeToggle?: boolean
  sidebarCollapsed?: boolean
  summaryLabel?: string
  theme?: AppHeaderTheme
}
