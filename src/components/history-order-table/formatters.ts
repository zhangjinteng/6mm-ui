export function isHistoryOrderFlag(value: unknown): boolean {
  if (value === true || value === 1) return true
  const normalized = String(value ?? '').trim().toLowerCase()
  return normalized === '1' || normalized === 'true'
}

export function formatHistoryOrderQuantity(value: unknown): string {
  const numberValue = Number(value || 0)
  if (!Number.isFinite(numberValue)) return '0'
  const truncated = Math.trunc(numberValue * 10_000) / 10_000
  return truncated.toLocaleString('en-US', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
}

export function formatHistoryOrderPrice(value: unknown): string {
  const numberValue = Number(value || 0)
  return Number.isFinite(numberValue) ? numberValue.toFixed(2) : '0.00'
}
