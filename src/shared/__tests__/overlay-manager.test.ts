import { describe, expect, it } from 'vitest'

import { acquireOverlay } from '../overlay-manager'

describe('overlay manager', () => {
  it('allocates ordered layers and releases handles idempotently', () => {
    const first = acquireOverlay()
    const second = acquireOverlay()

    expect(second.zIndex).toBeGreaterThan(first.zIndex)
    expect(first.isTopmost()).toBe(false)
    expect(second.isTopmost()).toBe(true)

    first.release()
    const third = acquireOverlay()
    expect(third.zIndex).toBeGreaterThan(second.zIndex)
    expect(third.isTopmost()).toBe(true)
    third.release()
    second.release()
    second.release()
    first.release()
  })
})
