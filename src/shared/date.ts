export interface PlainDate {
  day: number
  month: number
  year: number
}

export interface CalendarCell extends PlainDate {
  currentMonth: boolean
  value: string
  weekend: boolean
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

export function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 0
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]!
}

export function formatDateValue(date: PlainDate): string {
  return `${String(date.year).padStart(4, '0')}-${pad(date.month)}-${pad(date.day)}`
}

export function parseDateValue(value: string): PlainDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null
  return { day, month, year }
}

function fromUtcDate(date: Date): string {
  return formatDateValue({
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  })
}

export function addDays(value: string, amount: number): string {
  const date = parseDateValue(value)
  if (!date) return value
  return fromUtcDate(new Date(Date.UTC(date.year, date.month - 1, date.day + amount)))
}

export function addMonths(value: string, amount: number): string {
  const date = parseDateValue(value)
  if (!date) return value
  const monthIndex = date.year * 12 + date.month - 1 + amount
  const year = Math.floor(monthIndex / 12)
  const month = ((monthIndex % 12) + 12) % 12 + 1
  return formatDateValue({ day: Math.min(date.day, daysInMonth(year, month)), month, year })
}

export function compareDateValues(left: string, right: string): number {
  return left === right ? 0 : left < right ? -1 : 1
}

export function todayDateValue(): string {
  const today = new Date()
  return formatDateValue({ day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() })
}

export function formatDate(value: string, pattern = 'YYYY-MM-DD'): string {
  const date = parseDateValue(value)
  if (!date) return ''
  const tokens: Record<string, string> = {
    DD: pad(date.day),
    MM: pad(date.month),
    YYYY: String(date.year).padStart(4, '0'),
  }
  return pattern.replace(/YYYY|MM|DD/g, (token) => tokens[token]!)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function parseFormattedDate(input: string, pattern = 'YYYY-MM-DD'): string | null {
  const tokens: Array<'YYYY' | 'MM' | 'DD'> = []
  let expression = '^'
  for (let index = 0; index < pattern.length;) {
    const token = (['YYYY', 'MM', 'DD'] as const).find((candidate) => pattern.startsWith(candidate, index))
    if (token) {
      tokens.push(token)
      expression += token === 'YYYY' ? '(\\d{4})' : '(\\d{2})'
      index += token.length
    } else {
      expression += escapeRegExp(pattern[index]!)
      index++
    }
  }
  const match = new RegExp(`${expression}$`).exec(input.trim())
  if (!match) return null
  const parts: Partial<Record<'YYYY' | 'MM' | 'DD', number>> = {}
  tokens.forEach((token, index) => { parts[token] = Number(match[index + 1]) })
  const value = formatDateValue({ day: parts.DD ?? 0, month: parts.MM ?? 0, year: parts.YYYY ?? 0 })
  return parseDateValue(value) ? value : null
}

export function buildCalendarMonth(monthValue: string, firstDayOfWeek: 0 | 1 = 0): CalendarCell[] {
  const match = /^(\d{4})-(\d{2})$/.exec(monthValue)
  if (!match) return []
  const year = Number(match[1])
  const month = Number(match[2])
  if (!daysInMonth(year, month)) return []
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const offset = (firstWeekday - firstDayOfWeek + 7) % 7
  const first = addDays(formatDateValue({ day: 1, month, year }), -offset)

  return Array.from({ length: 42 }, (_, index) => {
    const value = addDays(first, index)
    const date = parseDateValue(value)!
    const weekday = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()
    return { ...date, currentMonth: date.year === year && date.month === month, value, weekend: weekday === 0 || weekday === 6 }
  })
}
