import { describe, expect, it } from 'vitest'
import { formatFundingAmount, fundingBalanceChangeClass } from '../formatters'

describe('funding change formatters', () => {
  it('keeps meaningful precision and adds direction signs', () => {
    expect(formatFundingAmount('1.51400000', 'USDT', true)).toBe('+1.514 USDT')
    expect(formatFundingAmount('-1', 'USDT', true)).toBe('-1.00 USDT')
  })

  it('maps positive and negative amounts to semantic classes', () => {
    expect(fundingBalanceChangeClass('1')).toBe('is-positive')
    expect(fundingBalanceChangeClass('-1')).toBe('is-negative')
    expect(fundingBalanceChangeClass('0')).toBe('')
  })
})
