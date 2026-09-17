import { effectScope, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useRovingFocus } from '../use-roving-focus'

describe('useRovingFocus', () => {
  it('moves through enabled items and supports Home and End', () => {
    const container = document.createElement('div')
    const first = document.createElement('button')
    const disabled = document.createElement('button')
    const last = document.createElement('button')
    for (const item of [first, disabled, last]) item.dataset.mmRovingItem = ''
    disabled.disabled = true
    container.append(first, disabled, last)
    document.body.append(container)

    const scope = effectScope()
    const roving = scope.run(() => useRovingFocus(ref(container)))!

    roving.refresh()
    first.focus()
    roving.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(document.activeElement).toBe(last)

    roving.onKeydown(new KeyboardEvent('keydown', { key: 'Home' }))
    expect(document.activeElement).toBe(first)

    roving.onKeydown(new KeyboardEvent('keydown', { key: 'End' }))
    expect(document.activeElement).toBe(last)
    expect(first.tabIndex).toBe(-1)
    expect(last.tabIndex).toBe(0)
    scope.stop()
  })
})
