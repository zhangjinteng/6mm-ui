export function formatFundingMoney(value: unknown): string {
  const rawValue = String(value ?? '0').trim()
  const match = rawValue.match(/^([+-]?)(\d+)(?:\.(\d*))?$/)
  if (!match) return '-'

  const [, sign, integerPart, rawFraction = ''] = match
  const fraction = rawFraction.padEnd(3, '0')
  let scaled = BigInt(`${integerPart}${fraction.slice(0, 2)}`)
  if (Number(fraction[2]) >= 5) scaled += 1n

  const scaledText = scaled.toString().padStart(3, '0')
  const whole = scaledText.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const decimals = scaledText.slice(-2)
  const negative = sign === '-' && scaled !== 0n ? '-' : ''
  return `${negative}${whole}.${decimals}`
}
