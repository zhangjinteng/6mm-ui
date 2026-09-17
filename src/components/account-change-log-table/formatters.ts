import type { AccountChangeLogMode } from './types'

const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
  useGrouping: true,
})

const balanceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
})

export function formatAccountChangeAmount(value: unknown): string {
  const amount = Number(value ?? 0)
  if (!Number.isFinite(amount)) return '0.00'
  const formatted = amountFormatter.format(amount)
  return amount > 0 ? `+${formatted}` : formatted
}

export function formatAccountChangeBalance(value: unknown): string {
  const amount = Number(value ?? 0)
  return Number.isFinite(amount) ? balanceFormatter.format(amount) : '0.00'
}

export function resolveAccountChangeType(
  value: unknown,
  amount: unknown,
  mode: AccountChangeLogMode,
): string {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (mode === 'pnl' && normalized === 'funding_fee_settle') {
    return Number(amount) > 0 ? 'funding_fee_income' : 'funding_fee_expense'
  }
  if (mode === 'all' && normalized === 'agent_transfer' && Number(amount) < 0) {
    return 'agent_transfer_all_out'
  }
  return normalized
}
