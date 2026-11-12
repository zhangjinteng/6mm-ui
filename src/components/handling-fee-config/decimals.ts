/** Shift exact decimal strings; SQL/RPC fractions never pass through binary floats. */
export function shiftFeeDecimal(value: unknown, places: number): string {
  const match = String(value ?? '').match(/^(\d+)(?:\.(\d+))?$/)
  if (!match) return ''
  const digits = match[1]! + (match[2] ?? '')
  const point = match[1]!.length + places
  const text = point <= 0 ? `0.${'0'.repeat(-point)}${digits}`
    : point >= digits.length ? digits + '0'.repeat(point - digits.length)
      : `${digits.slice(0, point)}.${digits.slice(point)}`
  const [whole, fraction = ''] = text.split('.')
  const integer = whole!.replace(/^0+(?=\d)/, '')
  const trimmed = fraction.replace(/0+$/, '')
  return trimmed ? `${integer}.${trimmed}` : integer
}
