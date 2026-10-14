import { describe, expect, it } from 'vitest'
import { isCurrentTradeSummaryPeriod } from '../date-status'

describe('trade summary display status', () => {
  it('only marks the current UTC day and month as processing', () => {
    const now = new Date('2026-10-14T06:00:00Z')
    for (const date of ['2026-10-14', '2026-10']) expect(isCurrentTradeSummaryPeriod(date, now)).toBe(true)
    for (const date of ['2026-10-13', '2026-10-12', '2026-09', '2026-10-15', '2026-11', '', 'invalid']) {
      expect(isCurrentTradeSummaryPeriod(date, now)).toBe(false)
    }
  })

  it('uses the UTC report date across local day and year boundaries', () => {
    const beforeMidnight = new Date('2027-01-01T07:59:59+08:00')
    expect(isCurrentTradeSummaryPeriod('2026-12-31', beforeMidnight)).toBe(true)
    expect(isCurrentTradeSummaryPeriod('2026-12', beforeMidnight)).toBe(true)
    expect(isCurrentTradeSummaryPeriod('2027-01-01', beforeMidnight)).toBe(false)
    const afterMidnight = new Date('2027-01-01T08:00:00+08:00')
    expect(isCurrentTradeSummaryPeriod('2026-12-31', afterMidnight)).toBe(false)
    expect(isCurrentTradeSummaryPeriod('2026-12', afterMidnight)).toBe(false)
    expect(isCurrentTradeSummaryPeriod('2027-01-01', afterMidnight)).toBe(true)
    expect(isCurrentTradeSummaryPeriod('2027-01', afterMidnight)).toBe(true)
  })
})
