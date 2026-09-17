import type { Component } from 'vue'

import type { FloatingPlacement } from '../../composables/use-floating'
import type { MenuValue } from '../menu'
import type { PopoverTrigger } from '../popover'

export interface DropdownItem {
  disabled?: boolean
  icon?: Component
  label: string
  value: MenuValue
}

export interface DropdownProps {
  closeOnSelect?: boolean
  disabled?: boolean
  floatingClass?: string
  items?: DropdownItem[]
  label?: string
  modelValue?: MenuValue
  placement?: FloatingPlacement
  teleport?: boolean
  trigger?: PopoverTrigger
  visible?: boolean
  width?: number | string
}
