import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'

import { cloneFormValue, getPathValue, setPathValue } from '../form'

describe('form utilities', () => {
  it('clones reactive arrays and nested objects without retaining references', () => {
    const source = reactive({ channels: ['api'], profile: { role: 'operator' } })
    const cloned = cloneFormValue(source)

    expect(cloned).toEqual({ channels: ['api'], profile: { role: 'operator' } })
    expect(cloned).not.toBe(source)
    expect(cloned.channels).not.toBe(source.channels)
  })

  it('reads and writes dot and bracket paths', () => {
    const model: Record<string, unknown> = { accounts: [{ name: 'maker' }] }
    expect(getPathValue(model, 'accounts[0].name')).toBe('maker')
    setPathValue(model, 'accounts[0].name', 'taker')
    expect(getPathValue(model, 'accounts.0.name')).toBe('taker')
  })
})
