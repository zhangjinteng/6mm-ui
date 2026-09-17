import { effectScope, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { useEventListener } from '../use-event-listener'

describe('useEventListener', () => {
  it('moves the listener when the target changes and cleans up with its scope', () => {
    const first = new EventTarget()
    const second = new EventTarget()
    const target = ref<EventTarget | null>(first)
    const listener = vi.fn()
    const scope = effectScope()

    scope.run(() => useEventListener(target, 'mm-event', listener))
    first.dispatchEvent(new Event('mm-event'))
    expect(listener).toHaveBeenCalledTimes(1)

    target.value = second
    first.dispatchEvent(new Event('mm-event'))
    second.dispatchEvent(new Event('mm-event'))
    expect(listener).toHaveBeenCalledTimes(2)

    scope.stop()
    second.dispatchEvent(new Event('mm-event'))
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('does nothing when no browser target is available', () => {
    const scope = effectScope()
    const stop = scope.run(() => useEventListener(() => undefined, 'noop', vi.fn()))!

    expect(() => stop()).not.toThrow()
    scope.stop()
  })
})
