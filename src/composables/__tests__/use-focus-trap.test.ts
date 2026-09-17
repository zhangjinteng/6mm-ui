import { effectScope, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { useFocusTrap } from '../use-focus-trap'

describe('useFocusTrap', () => {
  it('cycles focus, handles Escape, and restores the trigger focus', () => {
    const trigger = document.createElement('button')
    const container = document.createElement('div')
    const first = document.createElement('button')
    const last = document.createElement('button')
    container.append(first, last)
    document.body.append(trigger, container)
    trigger.focus()

    const onEscape = vi.fn()
    const scope = effectScope()
    const trap = scope.run(() => useFocusTrap(ref(container), { onEscape }))!

    trap.activate()
    expect(document.activeElement).toBe(first)

    last.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }))
    expect(document.activeElement).toBe(first)

    first.focus()
    document.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Tab', shiftKey: true }),
    )
    expect(document.activeElement).toBe(last)

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    expect(onEscape).toHaveBeenCalledOnce()
    expect(document.activeElement).toBe(trigger)
    expect(trap.isActive.value).toBe(false)
    expect(() => trap.deactivate()).not.toThrow()
    scope.stop()
  })
})
