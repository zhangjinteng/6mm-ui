export function isCurrentOrderFlag(value: unknown): boolean {
  if (value === true || value === 1) return true
  const normalized = String(value ?? '').trim().toLowerCase()
  return normalized === '1' || normalized === 'true'
}

export function formatCurrentOrderQuantity(value: unknown): string {
  const numberValue = Number(value || 0)
  if (!Number.isFinite(numberValue)) return '0'
  const truncated = Math.trunc(numberValue * 10_000) / 10_000
  return truncated.toLocaleString('en-US', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
}

export function formatCurrentOrderPrice(value: unknown): string {
  const numberValue = Number(value || 0)
  return Number.isFinite(numberValue) ? numberValue.toFixed(2) : '0.00'
}

export function calculateCurrentOrderRemainingQuantity(
  quantity: unknown,
  filledQuantity: unknown,
  remainingQuantity?: unknown,
): number {
  const provided = Number(remainingQuantity)
  if (remainingQuantity !== null && remainingQuantity !== undefined && remainingQuantity !== '' && Number.isFinite(provided)) {
    return Math.max(0, provided)
  }
  const total = Number(quantity || 0)
  const filled = Number(filledQuantity || 0)
  return Math.max(0, (Number.isFinite(total) ? total : 0) - (Number.isFinite(filled) ? filled : 0))
}
