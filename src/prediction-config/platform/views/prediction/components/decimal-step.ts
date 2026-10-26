const decimal = /^(0|[1-9][0-9]{0,35})(?:\.[0-9]{1,18})?$/
export function stepDecimal(value: string, step: string, direction: 1 | -1, minimum = '0', maximum?: string): string | null {
    const values = [value, step, minimum, ...(maximum === undefined ? [] : [maximum])]
    if (!values.every(v => decimal.test(v))) return null
    const scale = Math.max(...values.map(v => v.split('.')[1]?.length ?? 0))
    const units = (v: string) => { const [i, f = ''] = v.split('.'); return BigInt(i + f.padEnd(scale, '0')) }
    const delta = units(step), min = units(minimum), max = maximum === undefined ? undefined : units(maximum)
    if (delta <= 0n || (max !== undefined && min > max)) return null
    let next = units(value) + BigInt(direction) * delta
    if (next < min) next = min
    if (max !== undefined && next > max) next = max
    const digits = next.toString().padStart(scale + 1, '0')
    if (!scale) return digits
    const fraction = digits.slice(-scale).replace(/0+$/, '')
    return digits.slice(0, -scale) + (fraction ? '.' + fraction : '')
}
// Shift decimal text without Number conversion; unfinished input stays invalid for the existing validator.
export function shiftDecimalText(value: string, places: 2 | -2): string {
    if (!/^(0|[1-9][0-9]*)(?:\.[0-9]*)?$/.test(value)) return value
    const [integer, fraction = ''] = value.split('.'), digits = integer + fraction, point = integer.length + places
    const shifted = point <= 0 ? '0.' + '0'.repeat(-point) + digits : point >= digits.length ? digits + '0'.repeat(point - digits.length) : digits.slice(0, point) + '.' + digits.slice(point)
    const [i, f = ''] = shifted.split('.'), trimmed = f.replace(/0+$/, '')
    return (i.replace(/^0+(?=\d)/, '') || '0') + (trimmed ? '.' + trimmed : '')
}
