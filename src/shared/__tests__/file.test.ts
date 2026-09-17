import { describe, expect, it } from 'vitest'

import { acceptsFile, formatFileSize } from '../file'

describe('file utilities', () => {
  it('matches extensions, exact MIME types, and wildcard MIME types', () => {
    const csv = new File(['a,b'], 'report.CSV', { type: 'text/csv' })
    const png = new File(['image'], 'chart.png', { type: 'image/png' })

    expect(acceptsFile(csv, '.csv')).toBe(true)
    expect(acceptsFile(csv, 'application/json,text/csv')).toBe(true)
    expect(acceptsFile(png, 'image/*')).toBe(true)
    expect(acceptsFile(png, '.pdf,text/plain')).toBe(false)
  })

  it('formats file sizes for compact status rows', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2 MB')
  })
})
