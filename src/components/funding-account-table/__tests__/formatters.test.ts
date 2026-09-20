import { describe, expect, it } from 'vitest'
import { formatFundingMoney } from '../formatters'

describe('formatFundingMoney', () => {
  it('groups and rounds funding balances to two decimals', () => {
    expect(formatFundingMoney('12840.255')).toBe('12,840.26')
    expect(formatFundingMoney('-1.004')).toBe('-1.00')
  })
})
