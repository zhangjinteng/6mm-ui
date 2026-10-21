const orderPriceFormatter = new Intl.NumberFormat('en-US', {
  useGrouping: false,
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
})

/** Display-only rounding; never changes the order's original price. */
export function formatOrderPrice(value: unknown): string {
  const price = Number(value || 0)
  if (!Number.isFinite(price)) return '0'
  const formatted = orderPriceFormatter.format(price)
  return formatted === '-0' ? '0' : formatted
}
