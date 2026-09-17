import { ref, toValue } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

export type RovingFocusOrientation = 'both' | 'horizontal' | 'vertical'

export interface RovingFocusOptions {
  loop?: boolean
  orientation?: RovingFocusOrientation
  selector?: string
}

export interface RovingFocus {
  activeIndex: Ref<number>
  focusAt: (index: number) => void
  onKeydown: (event: KeyboardEvent) => void
  refresh: () => HTMLElement[]
}

function isEnabled(element: HTMLElement): boolean {
  return !(element instanceof HTMLButtonElement && element.disabled) &&
    element.getAttribute('aria-disabled') !== 'true'
}

export function useRovingFocus(
  container: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: RovingFocusOptions = {},
): RovingFocus {
  const activeIndex = ref(0)
  const selector = options.selector ?? '[data-mm-roving-item]'

  const items = (): HTMLElement[] => {
    const root = toValue(container)
    return root
      ? Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(isEnabled)
      : []
  }

  const refresh = (): HTMLElement[] => {
    const available = items()
    if (available.length === 0) {
      activeIndex.value = -1
      return available
    }

    const focusedIndex = available.findIndex(
      (item) => item.ownerDocument.activeElement === item || item.tabIndex === 0,
    )
    activeIndex.value = focusedIndex >= 0 ? focusedIndex : Math.min(activeIndex.value, available.length - 1)
    if (activeIndex.value < 0) activeIndex.value = 0
    available.forEach((item, index) => (item.tabIndex = index === activeIndex.value ? 0 : -1))
    return available
  }

  const focusAt = (requestedIndex: number): void => {
    const available = items()
    if (available.length === 0) return

    const lastIndex = available.length - 1
    const index = options.loop === false
      ? Math.max(0, Math.min(requestedIndex, lastIndex))
      : (requestedIndex + available.length) % available.length
    activeIndex.value = index
    available.forEach((item, itemIndex) => (item.tabIndex = itemIndex === index ? 0 : -1))
    available[index].focus()
  }

  const onKeydown = (event: KeyboardEvent): void => {
    const orientation = options.orientation ?? 'both'
    const horizontal = orientation === 'both' || orientation === 'horizontal'
    const vertical = orientation === 'both' || orientation === 'vertical'
    const available = refresh()
    if (available.length === 0) return

    const focusedIndex = available.findIndex((item) => item.ownerDocument.activeElement === item)
    const currentIndex = focusedIndex >= 0 ? focusedIndex : activeIndex.value
    let targetIndex: number | undefined

    if ((event.key === 'ArrowRight' && horizontal) || (event.key === 'ArrowDown' && vertical)) {
      targetIndex = currentIndex + 1
    } else if (
      (event.key === 'ArrowLeft' && horizontal) ||
      (event.key === 'ArrowUp' && vertical)
    ) {
      targetIndex = currentIndex - 1
    } else if (event.key === 'Home') {
      targetIndex = 0
    } else if (event.key === 'End') {
      targetIndex = available.length - 1
    }

    if (targetIndex === undefined) return
    event.preventDefault()
    focusAt(targetIndex)
  }

  return { activeIndex, focusAt, onKeydown, refresh }
}
