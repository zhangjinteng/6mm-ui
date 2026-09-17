import { effectScope, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { useClickOutside } from '../use-click-outside'

describe('useClickOutside', () => {
  it('calls the handler only for events outside the target and ignored nodes', () => {
    const target = document.createElement('div')
    const inside = document.createElement('button')
    const ignored = document.createElement('button')
    const outside = document.createElement('button')
    target.append(inside)
    document.body.append(target, ignored, outside)

    const handler = vi.fn()
    const scope = effectScope()
    scope.run(() => {
      useClickOutside(ref(target), handler, { ignore: [ref(ignored)] })
    })

    inside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    ignored.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    scope.stop()

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
