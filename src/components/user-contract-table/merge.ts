import type {
  UserContractAccount, UserContractMetrics, UserContractOrderGroup,
  UserContractPositionGroup, UserContractRow,
} from './types'

const number = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/** Merge one page only. key(row) is the identifier used by TradeKernel on that host. */
export function mergeUserContractRows<Row extends UserContractRow>(
  rows: Row[],
  sources: {
    accounts?: UserContractAccount[]
    positions?: UserContractPositionGroup[]
    orders?: UserContractOrderGroup[]
    metrics?: UserContractMetrics[]
    marketPrice?: (symbol: string) => number | null | undefined
  },
  key: (row: Row) => number | string = row => row.user_id,
): Row[] {
  const byId = <T extends { user_id: number | string }>(items?: T[]) =>
    new Map((items ?? []).map(item => [String(item.user_id), item]))
  const accounts = byId(sources.accounts)
  const positions = byId(sources.positions)
  const orders = byId(sources.orders)
  const metrics = byId(sources.metrics)
  const price = (symbol: string, fallback?: unknown) =>
    number(sources.marketPrice?.(symbol)) ?? number(fallback) ?? 0

  return rows.map(row => {
    const id = String(key(row))
    const account = accounts.get(id)
    const positionList = (positions.get(id)?.positions ?? []).filter(pos => Math.abs(number(pos.quantity) ?? 0) > 0)
    const orderGroup = orders.get(id)
    const metric = metrics.get(id)
    const positionAmount = positionList.reduce((sum, pos) =>
      sum + Math.abs(number(pos.quantity) ?? 0) * price(pos.symbol ?? '', pos.entry_price), 0)
    const unrealizedPnl = positionList.reduce((sum, pos) => {
      const kernel = number(pos.unrealized_pnl)
      if (kernel !== null) return sum + kernel
      const quantity = Math.abs(number(pos.quantity) ?? 0)
      const entry = number(pos.entry_price) ?? 0
      const mark = price(pos.symbol ?? '')
      if (!quantity || !entry || !mark) return sum
      const long = ['1', 'buy', 'long'].includes(String(pos.side ?? '').toLowerCase())
      return sum + (long ? mark - entry : entry - mark) * quantity
    }, 0)
    const orderAmount = (orderGroup?.orders ?? []).reduce((sum, order) => {
      const remaining = Math.max(0, Math.abs(number(order.original_qty) ?? 0) - Math.abs(number(order.filled_qty) ?? 0))
      const orderPrice = order.order_source === 'condition' ? number(order.trigger_price) : number(order.order_price)
      const notional = remaining * (orderPrice ?? price(order.symbol ?? ''))
      return sum + (notional || Math.abs(number(order.frozen_amount) ?? 0))
    }, 0)

    return {
      ...row,
      wallet_balance: account?.wallet_balance ?? row.wallet_balance ?? 0,
      available_balance: account?.available_balance ?? row.available_balance ?? 0,
      position_amount: positionAmount,
      position_count: positionList.length,
      order_amount: orderAmount,
      order_count: orderGroup?.total_count ?? orderGroup?.orders?.length ?? 0,
      unrealized_pnl: unrealizedPnl,
      pnl_30d: metric?.pnl_30d ?? row.pnl_30d ?? 0,
      fee_30d: metric?.fee_30d ?? row.fee_30d ?? null,
      last_contract_at: metric?.last_contract_at ?? row.last_contract_at ?? null,
    }
  })
}
