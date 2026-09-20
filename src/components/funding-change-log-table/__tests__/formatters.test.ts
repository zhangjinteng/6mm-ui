import { describe, expect, it } from 'vitest'
import { formatFundingAmount, fundingBalanceChangeClass, fundingChangeTypeKey } from '../formatters'

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

  it.each([
    ['TRANSFER', 'TRANSFER_HOLD_CREATED', 'transferHoldCreated'],
    ['TRANSFER', 'TRANSFER_HOLD_RELEASED', 'transferHoldReleased'],
    ['TRANSFER', 'TRANSFER_OUT', 'transferOut'],
    ['TRANSFER', 'TRANSFER_IN', 'transferIn'],
    ['AGENT_TRANSFER_IN', 'CREDIT', 'agentTransferIn'],
    ['AGENT_TRANSFER_OUT', 'DEBIT', 'agentTransferOut'],
  ])('maps %s and %s to %s', (businessType, entryType, expected) => {
    expect(fundingChangeTypeKey(businessType, entryType)).toBe(expected)
  })

  it('does not guess a label from only one side of the mapping', () => {
    expect(fundingChangeTypeKey('TRANSFER', 'CREDIT')).toBeNull()
  })
})
