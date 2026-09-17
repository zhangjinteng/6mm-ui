import type { LiquidationRow } from './types'

export function displayLiquidationValue(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value)
}

export function formatLiquidationDecimal(
  value: unknown,
  maximumFractionDigits: number,
  minimumFractionDigits = 0,
): string {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return '-'
  return numberValue.toLocaleString('en-US', {
    maximumFractionDigits,
    minimumFractionDigits,
  })
}

export function liquidationUserUid(row: LiquidationRow): string {
  return displayLiquidationValue(
    row.user?.public_user_id ?? row.public_user_id ?? row.user_id,
  )
}
