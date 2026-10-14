import { describe, expect, it } from 'vitest'
import { isCurrentReportPeriod, resolveReportDateStatus } from '../report-date-status'

describe('report display status', () => {
  it('only marks the current UTC day and month as processing', () => {
    const now = new Date('2026-10-14T06:00:00Z')
    for (const date of ['2026-10-14', '2026-10']) expect(isCurrentReportPeriod(date, now)).toBe(true)
    for (const date of ['2026-10-13', '2026-10-12', '2026-09', '2026-10-15', '2026-11', '', 'invalid']) {
      expect(isCurrentReportPeriod(date, now)).toBe(false)
    }
  })

  it('uses the UTC report date across local day and year boundaries', () => {
    const beforeMidnight = new Date('2027-01-01T07:59:59+08:00')
    expect(isCurrentReportPeriod('2026-12-31', beforeMidnight)).toBe(true)
    expect(isCurrentReportPeriod('2026-12', beforeMidnight)).toBe(true)
    expect(isCurrentReportPeriod('2027-01-01', beforeMidnight)).toBe(false)
    const afterMidnight = new Date('2027-01-01T08:00:00+08:00')
    expect(isCurrentReportPeriod('2026-12-31', afterMidnight)).toBe(false)
    expect(isCurrentReportPeriod('2026-12', afterMidnight)).toBe(false)
    expect(isCurrentReportPeriod('2027-01-01', afterMidnight)).toBe(true)
    expect(isCurrentReportPeriod('2027-01', afterMidnight)).toBe(true)
  })

  it('normalizes daily date strings and exposes only two display states', () => {
    const now = new Date('2026-10-14T06:00:00Z')
    expect(resolveReportDateStatus(' 2026-10-14 ', now)).toBe('processing')
    expect(resolveReportDateStatus('2026-10-14T00:00:00Z', now)).toBe('processing')
    expect(resolveReportDateStatus('2026-10-14 00:00:00', now)).toBe('processing')
    expect(resolveReportDateStatus('2026-10-14invalid', now)).toBe('completed')
    expect(resolveReportDateStatus(undefined, now)).toBe('completed')
    expect(resolveReportDateStatus(null, now)).toBe('completed')
  })
})
