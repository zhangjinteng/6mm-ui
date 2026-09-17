import type { TradeFillRow } from './types'

export function displayTradeFillValue(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value)
}

export function formatTradeFillNumber(value: unknown): string {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? String(numberValue) : '-'
}

export function formatTradeFillFixed(value: unknown, digits = 8): string {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue.toFixed(digits) : '-'
}

export function tradeFillUserUid(row: TradeFillRow): string {
  return displayTradeFillValue(row.user?.public_user_id ?? row.public_user_id ?? row.user_id)
}

export function tradeFillExternalUserId(row: TradeFillRow): string {
  return displayTradeFillValue(row.agent_user_id ?? row.user?.agent_user_id)
}
