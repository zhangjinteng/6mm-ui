import { describe, expect, it } from 'vitest'
import { mergeUserContractRows } from '../merge'
import type { UserContractRow } from '../types'

describe('mergeUserContractRows', () => {
  it('joins platform internal IDs without confusing them with public UID', () => {
    const rows = mergeUserContractRows([{ user_id: '888', internal_user_id: 11, fee_30d: '2.10', pnl_30d: '-1.25', last_contract_at: '2026-09-28' }], {
      accounts: [{ user_id: 11, wallet_balance: '100.00', available_balance: '80.00' }],
      positions: [{ user_id: 11, positions: [{ symbol: 'BTCUSDT', quantity: '0.1', entry_price: '100', unrealized_pnl: '1.5' }] }],
      orders: [{ user_id: 11, orders: [{ symbol: 'BTCUSDT', original_qty: '0.2', filled_qty: '0.1', order_price: '110' }], total_count: 1 }],
      marketPrice: () => 120,
    }, row => row.internal_user_id ?? row.user_id)
    expect(rows[0]).toMatchObject({
      user_id: '888', wallet_balance: '100.00', available_balance: '80.00',
      position_amount: 12, position_count: 1, order_amount: 11, order_count: 1,
      unrealized_pnl: 1.5, fee_30d: '2.10', pnl_30d: '-1.25', last_contract_at: '2026-09-28',
    })
  })

  it('does not invent unrealized losses when both mark price and kernel PnL are missing', () => {
    const rows = mergeUserContractRows<UserContractRow>([{ user_id: 7 }], {
      positions: [{ user_id: 7, positions: [{ symbol: 'BTCUSDT', quantity: '1', entry_price: '100', side: 1 }] }],
    })
    expect(rows[0].unrealized_pnl).toBe(0)
  })
})
