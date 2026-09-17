import type { UserAssetPosition, UserAssetRow } from './types'

type MarketPrices = Readonly<Record<string, number | string | null | undefined>>

function finiteNumber(value: unknown): number {
  const result = Number(value ?? 0)
  return Number.isFinite(result) ? result : 0
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== ''
}

function marketPrice(symbol: string | null | undefined, prices: MarketPrices): number {
  if (!symbol) return 0
  return finiteNumber(prices[symbol] ?? prices[symbol.toUpperCase()])
}

function positionDirection(position: UserAssetPosition): 'long' | 'short' | null {
  const raw = position.side ?? position.position_side
  const normalized = String(raw ?? '').toLowerCase()
  if (['1', 'buy', 'long'].includes(normalized)) return 'long'
  if (['2', 'sell', 'short'].includes(normalized)) return 'short'

  const quantity = finiteNumber(position.quantity)
  if (quantity > 0) return 'long'
  if (quantity < 0) return 'short'
  return null
}

export function formatUserAssetAmount(value: unknown): string {
  return finiteNumber(value).toFixed(2)
}

export function calculateUserAssetPositionAmount(
  row: UserAssetRow,
  prices: MarketPrices = {},
): number {
  if (hasValue(row.position_amount)) return finiteNumber(row.position_amount)

  const quantities = row.total_quantity
  if (quantities && typeof quantities === 'object') {
    const entries = Object.entries(quantities)
    if (entries.length > 0) {
      return entries.reduce((total, [symbol, quantity]) => (
        total + Math.abs(finiteNumber(quantity)) * marketPrice(symbol, prices)
      ), 0)
    }
  }

  return (row.positions ?? []).reduce((total, position) => (
    total
    + Math.abs(finiteNumber(position.quantity)) * marketPrice(position.symbol, prices)
  ), 0)
}

export function calculateUserAssetUnrealizedPnl(
  row: UserAssetRow,
  prices: MarketPrices = {},
): number {
  if (hasValue(row.position_pnl)) return finiteNumber(row.position_pnl)
  if (hasValue(row.unrealized_pnl)) return finiteNumber(row.unrealized_pnl)

  return (row.positions ?? []).reduce((total, position) => {
    if (hasValue(position.unrealized_pnl)) {
      return total + finiteNumber(position.unrealized_pnl)
    }

    const currentPrice = marketPrice(position.symbol, prices)
    const entryPrice = finiteNumber(position.entry_price)
    const quantity = Math.abs(finiteNumber(position.quantity))
    const direction = positionDirection(position)
    if (!currentPrice || !entryPrice || !quantity || !direction) return total

    const priceDifference = direction === 'long'
      ? currentPrice - entryPrice
      : entryPrice - currentPrice
    return total + priceDifference * quantity
  }, 0)
}

export function formatUserAssetPnl(value: number): string {
  return `${value >= 0 ? '+' : ''}${formatUserAssetAmount(value)}`
}
