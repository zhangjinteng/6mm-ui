import { onScopeDispose, ref, toValue } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

import type { ElementSource } from './use-click-outside'

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export interface FocusTrapOptions {
  escapeDeactivates?: boolean
  initialFocus?: ElementSource
  onEscape?: (event: KeyboardEvent) => void
  returnFocus?: boolean
}

export interface FocusTrap {
  activate: () => void
  deactivate: (restoreFocus?: boolean) => void
  isActive: Ref<boolean>
}

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.getAttribute('aria-hidden') !== 'true' && element.tabIndex >= 0,
  )
}

export function useFocusTrap(
  container: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: FocusTrapOptions = {},
): FocusTrap {
  const isActive = ref(false)
  let activeDocument: Document | undefined
  let previousFocus: HTMLElement | null = null

  const onKeydown = (event: KeyboardEvent): void => {
    if (!isActive.value) return

    if (event.key === 'Escape') {
      options.onEscape?.(event)
      if (options.escapeDeactivates !== false) deactivate()
      return
    }

    if (event.key !== 'Tab') return
    const element = toValue(container)
    if (!element) return

    const focusable = focusableElements(element)
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && activeDocument?.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && activeDocument?.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const activate = (): void => {
    if (isActive.value) return

    const element = toValue(container)
    if (!element) return

    activeDocument = element.ownerDocument
    previousFocus =
      activeDocument.activeElement instanceof HTMLElement ? activeDocument.activeElement : null
    activeDocument.addEventListener('keydown', onKeydown, true)
    isActive.value = true

    const initial = options.initialFocus ? toValue(options.initialFocus) : undefined
    const target = initial ?? focusableElements(element)[0]
    target?.focus()
  }

  const deactivate = (restoreFocus = options.returnFocus !== false): void => {
    if (!isActive.value) return

    activeDocument?.removeEventListener('keydown', onKeydown, true)
    isActive.value = false
    if (restoreFocus && previousFocus?.isConnected) previousFocus.focus()
    activeDocument = undefined
    previousFocus = null
  }

  onScopeDispose(() => deactivate())

  return { activate, deactivate, isActive }
}
