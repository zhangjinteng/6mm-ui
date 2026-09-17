// @vitest-environment node

import { effectScope, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { useClickOutside } from '../use-click-outside'
import { useControlled } from '../use-controlled'
import { useEventListener } from '../use-event-listener'
import { useFloating } from '../use-floating'
import { useFocusTrap } from '../use-focus-trap'
import { useLockScroll } from '../use-lock-scroll'
import { useRovingFocus } from '../use-roving-focus'

describe('shared composable SSR safety', () => {
  it('does not read browser globals when targets are unavailable', () => {
    const scope = effectScope()

    expect(() => {
      scope.run(() => {
        const element = ref(null)
        useClickOutside(element, vi.fn())
        useControlled(ref<string>(), 'initial')
        useEventListener(() => undefined, 'noop', vi.fn())
        useFloating(element, element)
        useFocusTrap(element)
        useLockScroll(() => undefined)
        useRovingFocus(element).refresh()
      })
    }).not.toThrow()

    expect(() => scope.stop()).not.toThrow()
  })
})
