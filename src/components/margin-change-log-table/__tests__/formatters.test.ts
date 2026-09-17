import { describe, expect, it } from 'vitest'

import { formatMarginChangeDateTime } from '../formatters'

describe('margin-change-log time formatter', () => {
  it('keeps the API-localized wall-clock time and removes fractions and offsets', () => {
    expect(formatMarginChangeDateTime('2026-08-19 17:16:20.900410+08:00'))
      .toBe('2026-08-19 17:16:20')
    expect(formatMarginChangeDateTime('2026-08-19T17:16:20.900410+08:00'))
      .toBe('2026-08-19 17:16:20')
  })

  it('uses a dash for empty values', () => {
    expect(formatMarginChangeDateTime(null)).toBe('-')
  })
})
