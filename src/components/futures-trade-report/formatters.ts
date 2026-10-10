/** Round decimal strings without IEEE-754 conversion (including BIGINT-sized amounts). */
export function formatTradeReportDecimal(value: unknown, digits = 2): string {
  const match = String(value ?? '0').match(/^(-?)(\d+)(?:\.(\d+))?$/)
  if (!match) return '-'
  const fraction = (match[3] ?? '').padEnd(digits + 1, '0')
  const scale = 10n ** BigInt(digits)
  let units = BigInt(match[2]) * scale + BigInt(fraction.slice(0, digits) || '0')
  if (Number(fraction[digits]) >= 5) units += 1n
  const integer = (units / scale).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${units === 0n ? '' : match[1]}${integer}${digits ? `.${(units % scale).toString().padStart(digits, '0')}` : ''}`
}
