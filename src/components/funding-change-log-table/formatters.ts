export function formatFundingAmount(value: unknown, currency: unknown, showPositiveSign = false): string {
  const match = String(value ?? '').trim().match(/^([+-]?)(\d+)(?:\.(\d*))?$/)
  if (!match) return '-'
  const [, rawSign, rawInteger, rawFraction = ''] = match
  const integer = rawInteger.replace(/^0+(?=\d)/, '')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const fraction = rawFraction.slice(0, 8).replace(/0+$/, '').padEnd(2, '0')
  const isZero = /^0+$/.test(integer) && /^0*$/.test(rawFraction)
  const sign = rawSign === '-' && !isZero ? '-' : showPositiveSign && !isZero ? '+' : ''
  const unit = String(currency ?? '').trim()
  return `${sign}${grouped}.${fraction}${unit ? ` ${unit}` : ''}`
}

export function fundingBalanceChangeClass(value: unknown): string {
  const amount = Number(value)
  return amount > 0 ? 'is-positive' : amount < 0 ? 'is-negative' : ''
}
