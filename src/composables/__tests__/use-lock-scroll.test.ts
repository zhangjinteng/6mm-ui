import { effectScope } from 'vue'
import { describe, expect, it } from 'vitest'

import { useLockScroll } from '../use-lock-scroll'

describe('useLockScroll', () => {
  it('reference-counts nested locks and restores the original overflow', () => {
    document.body.style.overflow = 'auto'
    const firstScope = effectScope()
    const secondScope = effectScope()
    const first = firstScope.run(() => useLockScroll())!
    const second = secondScope.run(() => useLockScroll())!

    first.lock()
    first.lock()
    second.lock()
    expect(document.body.style.overflow).toBe('hidden')

    first.unlock()
    expect(document.body.style.overflow).toBe('hidden')

    second.unlock()
    expect(document.body.style.overflow).toBe('auto')
    expect(() => second.unlock()).not.toThrow()

    firstScope.stop()
    secondScope.stop()
  })
})
