import { describe, expect, it } from 'vitest'

import {
  addDays,
  addMonths,
  buildCalendarMonth,
  daysInMonth,
  formatDate,
  parseDateValue,
  parseFormattedDate,
} from '../date'

describe('date utilities', () => {
  it('validates leap years and rejects impossible calendar dates', () => {
    expect(daysInMonth(2024, 2)).toBe(29)
    expect(daysInMonth(2025, 2)).toBe(28)
    expect(parseDateValue('2024-02-29')).toEqual({ day: 29, month: 2, year: 2024 })
    expect(parseDateValue('2025-02-29')).toBeNull()
    expect(parseDateValue('2026-13-01')).toBeNull()
  })

  it('adds days and months without timezone-dependent parsing', () => {
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29')
    expect(addDays('2024-02-29', 1)).toBe('2024-03-01')
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29')
  })

  it('formats, parses, and builds a stable six-week calendar grid', () => {
    expect(formatDate('2026-07-09', 'DD/MM/YYYY')).toBe('09/07/2026')
    expect(parseFormattedDate('09/07/2026', 'DD/MM/YYYY')).toBe('2026-07-09')
    const cells = buildCalendarMonth('2026-07', 1)
    expect(cells).toHaveLength(42)
    expect(cells[0]?.value).toBe('2026-06-29')
    expect(cells.filter((cell) => cell.currentMonth)).toHaveLength(31)
  })
})
