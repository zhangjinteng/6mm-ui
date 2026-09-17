import { describe, expect, it } from 'vitest'

import { formatOnlineUserDateTime } from '../formatters'

describe('online-user time formatters', () => {
  it('displays date-time strings to seconds', () => {
    expect(formatOnlineUserDateTime('2026-08-10 12:34:56')).toBe('2026-08-10 12:34:56')
    expect(formatOnlineUserDateTime('2026-08-10T12:34:56.789Z')).toBe('2026-08-10 12:34:56')
  })

  it('fills missing seconds with zero', () => {
    expect(formatOnlineUserDateTime('2026-08-10 12:34')).toBe('2026-08-10 12:34:00')
  })
})
