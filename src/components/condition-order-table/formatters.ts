const STOP_TRIGGER_TYPES = new Set(['stop_market', 'stop_limit'])
const TAKE_PROFIT_TRIGGER_TYPES = new Set(['take_profit_market', 'take_profit_limit'])

export function conditionOrderTriggerOperator(triggerType?: string, side?: string): '≤' | '≥' {
  const normalizedTriggerType = (triggerType || '').toLowerCase()
  const normalizedSide = (side || '').toLowerCase()

  if (STOP_TRIGGER_TYPES.has(normalizedTriggerType)) return normalizedSide === 'sell' ? '≤' : '≥'
  if (TAKE_PROFIT_TRIGGER_TYPES.has(normalizedTriggerType)) return normalizedSide === 'sell' ? '≥' : '≤'
  return normalizedSide === 'buy' ? '≤' : '≥'
}

export function formatConditionOrderLeverage(value: unknown): string {
  const leverage = Number(value)
  return Number.isFinite(leverage) && leverage > 0 ? `${leverage}x` : '-'
}

function expandScientificNotation(value: string): string {
  const text = value.trim()
  if (!text || !/[eE]/.test(text)) return text
  const match = text.match(/^([+-]?)(\d*\.?\d+)[eE]([+-]?\d+)$/)
  if (!match) return text

  const [, sign, coefficient, exponentText] = match
  const exponent = Number(exponentText)
  const [integerPart = '', decimalPart = ''] = coefficient.split('.')
  const digits = `${integerPart}${decimalPart}` || '0'
  const decimalIndex = integerPart.length + exponent
  if (decimalIndex <= 0) return `${sign}0.${'0'.repeat(Math.abs(decimalIndex))}${digits}`
  if (decimalIndex >= digits.length) return `${sign}${digits}${'0'.repeat(decimalIndex - digits.length)}`
  return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`
}

export function formatConditionOrderQuantity(value: unknown, accountChange = false): string {
  if (accountChange) {
    const quantity = Number(value ?? 0)
    return Number.isFinite(quantity)
      ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(quantity)
      : '0.00'
  }

  const plainText = expandScientificNotation(String(value ?? '0')).replace(/,/g, '').trim()
  const match = plainText.match(/^([+-]?)(\d*)(?:\.(\d*))?$/)
  if (!match) return '0'
  const [, sign, integerPartRaw, decimalPartRaw = ''] = match
  const integerPart = integerPartRaw.replace(/^0+(?=\d)/, '') || '0'
  const decimalPart = decimalPartRaw.slice(0, 6).replace(/0+$/, '')
  const result = decimalPart ? `${integerPart}.${decimalPart}` : integerPart
  return sign === '-' && result !== '0' ? `-${result}` : result
}

export function formatConditionOrderPrice(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-'
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return '-'
  return String(Math.floor(numberValue * 100) / 100)
}

export function isCancelableConditionOrderStatus(value: unknown): boolean {
  return [-1, 0, 1].includes(Number(value))
}
