import type { FeeCommissionRow } from './types'

export function displayFeeCommissionValue(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value)
}

export function formatFeeCommissionNumber(value: unknown, digits: number): string {
  const amount = Number(value ?? 0)
  return Number.isFinite(amount) ? amount.toFixed(digits) : (0).toFixed(digits)
}

export function formatFeeCommissionQuantity(row: FeeCommissionRow): string {
  const baseAsset = String(row.base_asset || row.symbol || '').replace(/USDT$/i, '')
  const quantity = formatFeeCommissionNumber(row.quantity, 3)
  return baseAsset ? `${quantity} ${baseAsset}` : quantity
}
