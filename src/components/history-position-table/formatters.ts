import type { HistoryPositionRow } from './types'

export function historyPositionNumber(value: unknown): number {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

export function formatHistoryPositionAmount(value: unknown): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(historyPositionNumber(value))
}

export function formatHistoryPositionPrice(value: unknown): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(historyPositionNumber(value))
}

export function formatHistoryPositionQuantity(value: unknown): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(historyPositionNumber(value))
}

export function formatSignedHistoryPositionAmount(value: unknown): string {
  const numberValue = historyPositionNumber(value)
  return `${numberValue > 0 ? '+' : ''}${formatHistoryPositionAmount(numberValue)}`
}

export function historyPositionOpenQuantity(row: HistoryPositionRow): number {
  return historyPositionNumber(row.open_quantity ?? row.max_quantity ?? row.quantity)
}

export function historyPositionMaxQuantity(row: HistoryPositionRow): unknown {
  return row.max_quantity ?? row.open_quantity ?? row.quantity ?? 0
}

export function historyPositionEntryCost(row: HistoryPositionRow): number {
  return historyPositionNumber(row.entry_price) * historyPositionOpenQuantity(row)
}
