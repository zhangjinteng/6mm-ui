import type { PositionRow } from './types'

export function toPositionNumber(value: unknown): number {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

export function resolvePositionMarkPrice(
  row: PositionRow,
  marketPrices: Readonly<Record<string, number | string | null | undefined>> = {},
): number {
  const symbol = String(row.symbol ?? '').trim()
  const injected = marketPrices[symbol]
    ?? marketPrices[symbol.toUpperCase()]
    ?? marketPrices[symbol.toLowerCase()]
  const marketPrice = toPositionNumber(injected)
  if (marketPrice > 0) return marketPrice
  return toPositionNumber(row.mark_price)
}

export function calculatePositionValue(
  row: PositionRow,
  marketPrices: Readonly<Record<string, number | string | null | undefined>> = {},
): number {
  const quantity = Math.abs(toPositionNumber(row.quantity))
  const markPrice = resolvePositionMarkPrice(row, marketPrices)
  if (markPrice > 0 && quantity > 0) return markPrice * quantity

  const backendValue = Math.abs(toPositionNumber(row.position_value))
  if (backendValue > 0) return backendValue
  return Math.abs(toPositionNumber(row.entry_price) * quantity)
}

export function calculatePositionPnl(
  row: PositionRow,
  marketPrices: Readonly<Record<string, number | string | null | undefined>> = {},
): number {
  if (row.unrealized_pnl !== null && row.unrealized_pnl !== undefined && row.unrealized_pnl !== '') {
    return toPositionNumber(row.unrealized_pnl)
  }
  if (row.pnl !== null && row.pnl !== undefined && row.pnl !== '') {
    return toPositionNumber(row.pnl)
  }

  const markPrice = resolvePositionMarkPrice(row, marketPrices)
  if (markPrice <= 0) return 0
  const direction = String(row.position_side ?? '').toLowerCase() === 'long' ? 1 : -1
  return toPositionNumber(row.quantity) * direction * (markPrice - toPositionNumber(row.entry_price))
}

export function calculatePositionMargin(
  row: PositionRow,
  marketPrices: Readonly<Record<string, number | string | null | undefined>> = {},
): number {
  const leverage = toPositionNumber(row.leverage)
  if (leverage > 0) return calculatePositionValue(row, marketPrices) / leverage
  return toPositionNumber(row.margin_price)
}

export function calculatePositionRoe(
  row: PositionRow,
  marketPrices: Readonly<Record<string, number | string | null | undefined>> = {},
): number {
  const margin = calculatePositionMargin(row, marketPrices)
  return margin === 0 ? 0 : (calculatePositionPnl(row, marketPrices) / margin) * 100
}

const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const priceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})

const quantityFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

export function formatPositionAmount(value: unknown): string {
  return amountFormatter.format(toPositionNumber(value))
}

export function formatPositionPrice(value: unknown): string {
  return priceFormatter.format(toPositionNumber(value))
}

export function formatPositionOptionalPrice(value: unknown): string {
  const numberValue = toPositionNumber(value)
  return numberValue > 0 ? formatPositionPrice(numberValue) : '-'
}

export function formatPositionQuantity(value: unknown): string {
  return quantityFormatter.format(toPositionNumber(value))
}

export function formatSignedPositionAmount(value: unknown): string {
  const numberValue = toPositionNumber(value)
  return `${numberValue > 0 ? '+' : ''}${formatPositionAmount(numberValue)}`
}

export function formatSignedPositionPercent(value: unknown): string {
  return `${formatSignedPositionAmount(value)}%`
}
