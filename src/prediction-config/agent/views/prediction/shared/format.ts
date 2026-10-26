const INT64_MAX = 9223372036854775807n
export function exact(value: unknown): string {
    if (value === undefined || value === null) return '—'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
}
export function integer(value: unknown, positive = false): value is string {
    return typeof value === 'string' && /^(0|[1-9][0-9]*)$/.test(value)
        && value.length <= 19 && BigInt(value) <= INT64_MAX && (!positive || value !== '0')
}
export function identity(value: unknown): string | null {
    if (typeof value === 'number') return Number.isSafeInteger(value) && value > 0 ? String(value) : null
    return integer(value, true) ? value : null
}
export function safeCount(value: unknown): number | null {
    return integer(value) && BigInt(value) <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : null
}
export function decimal(value: unknown): value is string {
    return typeof value === 'string' && value.length <= 256 && /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value)
}
export function compareDecimal(a: string, b: string): number {
    if (!decimal(a) || !decimal(b)) throw new Error('INVALID_DECIMAL')
    const [ai, af = ''] = a.split('.'), [bi, bf = ''] = b.split('.')
    const width = Math.max(af.length, bf.length)
    const av = BigInt(ai + af.padEnd(width, '0')), bv = BigInt(bi + bf.padEnd(width, '0'))
    return av === bv ? 0 : av > bv ? 1 : -1
}
export function timestamp(value: unknown): string {
    if (!integer(value) || BigInt(value) > 8640000000000000n) return value == null ? '—' : exact(value)
    const date = new Date(Number(value))
    return Number.isNaN(date.getTime()) ? exact(value) : date.toLocaleString()
}
export function text(value: unknown, maximum = 64, symbol = false): value is string {
    return typeof value === 'string' && value.length > 0 && [...value].length <= maximum
        && value.trim() === value && !/[\u0000-\u001f\u007f]/.test(value)
        && (!symbol || /^[A-Z0-9][A-Z0-9._-]*$/.test(value))
}
export function localTime(ms: number): string {
    const date = new Date(ms), pad = (n: number) => String(n).padStart(2, '0')
    return date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) + ' '
        + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds())
}
export function epoch(local: string): string {
    if (!/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/.test(local)) throw new Error('INVALID_TIME_RANGE')
    const ms = new Date(local.replace(' ', 'T')).getTime()
    if (!Number.isSafeInteger(ms) || ms < 0 || localTime(ms) !== local) throw new Error('INVALID_TIME_RANGE')
    return String(ms)
}
