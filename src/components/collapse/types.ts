import type { ComputedRef, InjectionKey } from 'vue'

export type CollapseName = number | string
export type CollapseValue = CollapseName | CollapseName[]

export interface CollapseProps {
  accordion?: boolean
  modelValue?: CollapseValue
}

export interface CollapseItemProps {
  disabled?: boolean
  name: CollapseName
  title?: string
}

export interface CollapseContext {
  activeNames: ComputedRef<CollapseName[]>
  isActive: (name: CollapseName) => boolean
  moveHeader: (current: HTMLButtonElement, event: KeyboardEvent) => void
  toggle: (name: CollapseName) => void
}

export const collapseKey: InjectionKey<CollapseContext> = Symbol('mm-collapse')
