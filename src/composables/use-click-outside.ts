import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import { useEventListener } from './use-event-listener'

export type ElementSource = MaybeRefOrGetter<HTMLElement | null | undefined>

export interface ClickOutsideOptions {
  enabled?: MaybeRefOrGetter<boolean>
  ignore?: ElementSource[]
}

function containsEventTarget(element: HTMLElement, event: Event): boolean {
  const eventTarget = event.target
  if (!(eventTarget instanceof Node)) return false

  const path = typeof event.composedPath === 'function' ? event.composedPath() : []
  return path.includes(element) || element.contains(eventTarget)
}

export function useClickOutside(
  target: ElementSource,
  handler: (event: PointerEvent) => void,
  options: ClickOutsideOptions = {},
) {
  return useEventListener<PointerEvent>(
    () => {
      const element = toValue(target)
      if (element) return element.ownerDocument
      return typeof document === 'undefined' ? undefined : document
    },
    'pointerdown',
    (event) => {
      if (options.enabled !== undefined && !toValue(options.enabled)) return

      const element = toValue(target)
      if (!element || containsEventTarget(element, event)) return

      const ignored = options.ignore?.some((source) => {
        const ignoredElement = toValue(source)
        return ignoredElement ? containsEventTarget(ignoredElement, event) : false
      })
      if (!ignored) handler(event)
    },
  )
}
