import { describe, expect, it, vi } from 'vitest'

import { debugWarn } from '../warn'

describe('debugWarn', () => {
  it('formats development warnings consistently', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    debugWarn('Button', 'invalid size')

    expect(warn).toHaveBeenCalledWith('[MmUI:Button] invalid size')
    warn.mockRestore()
  })
})
