const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
  useGrouping: true,
})

const balanceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
})

export function formatMarginChangeAmount(value: unknown): string {
  const amount = Number(value ?? 0)
  if (!Number.isFinite(amount)) return '0.00'
  const formatted = amountFormatter.format(amount)
  return amount > 0 ? `+${formatted}` : formatted
}

export function formatMarginChangeBalance(value: unknown): string {
  const amount = Number(value ?? 0)
  return Number.isFinite(amount) ? balanceFormatter.format(amount) : '0.00'
}

export function formatMarginTransferAmount(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-'
  const amount = Number(value)
  return Number.isFinite(amount) ? amountFormatter.format(Math.abs(amount)) : '-'
}

export function formatMarginChangeDateTime(value: unknown): string {
  const text = String(value ?? '').trim()
  if (!text) return '-'

  const matched = text
    .replace('T', ' ')
    .match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?::(\d{2}))?/)

  return matched
    ? `${matched[1]} ${matched[2]}:${matched[3] ?? '00'}`
    : text
}
