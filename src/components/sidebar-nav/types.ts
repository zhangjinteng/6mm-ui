import type { IconName } from '../icon'
import type { MenuValue } from '../menu'

export interface SidebarNavChildItem {
  disabled?: boolean
  icon?: IconName
  key: MenuValue
  label: string
}

export interface SidebarNavItem extends SidebarNavChildItem {
  children?: SidebarNavChildItem[]
}

export type SidebarNavPlacement = 'left' | 'right'
export type SidebarNavDisplay = 'auto' | 'desktop' | 'mobile'

export interface SidebarNavProps {
  accordion?: boolean
  ariaLabel?: string
  collapsed?: boolean
  collapsedWidth?: number | string
  display?: SidebarNavDisplay
  drawerSize?: number | string
  items?: SidebarNavItem[]
  mobileBreakpoint?: number
  mobileOpen?: boolean
  mobileTitle?: string
  modelValue?: MenuValue
  openKeys?: MenuValue[]
  placement?: SidebarNavPlacement
  width?: number | string
}

export interface SidebarNavExpose {
  closeMobile: () => void
  openMobile: () => void
  toggleCollapsed: () => void
}

export interface SidebarNavSlotProps {
  collapsed: boolean
  mobile: boolean
}
