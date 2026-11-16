export const metricOptions = [
    { label: '标记价格', value: 'mark_price' },
    { label: '指数价格', value: 'index_price' }
] as const

export const intervalOptions = [
    { label: '1分钟', value: '1m' },
    { label: '3分钟', value: '3m' },
    { label: '5分钟', value: '5m' },
    { label: '15分钟', value: '15m' },
    { label: '30分钟', value: '30m' },
    { label: '1小时', value: '1h' },
    { label: '2小时', value: '2h' },
    { label: '4小时', value: '4h' },
    { label: '6小时', value: '6h' },
    { label: '12小时', value: '12h' },
    { label: '1天', value: '1d' },
    { label: '1周', value: '1w' },
    { label: '1月', value: '1mon' }
] as const

export const rangeOptions = [
    { label: '近24小时', value: '24h' },
    { label: '近7天', value: '7d' },
    { label: '近30天', value: '30d' }
] as const

export type HistoryMetric = (typeof metricOptions)[number]['value']
export type HistoryInterval = (typeof intervalOptions)[number]['value']
export type HistoryRange = (typeof rangeOptions)[number]['value']

export const defaultMetric: HistoryMetric = 'index_price'

export function valueColumnTitles() {
    return ['开盘价', '最高价', '最低价', '收盘价']
}

// 直接格式化十进制字符串，不能转成 Number 后再丢失小币种和大金额精度。
export function formatHistoryValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return '-'
    const text = String(value)
    const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(text)
    if (!match) return text
    const integer = match[2].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const fraction = (match[3] || '').replace(/0+$/, '')
    return `${match[1]}${integer}${fraction ? `.${fraction}` : ''}`
}

export function formatHistoryTime(value: unknown, timeZone?: string): string {
    const timestamp = Number(value)
    if (!Number.isFinite(timestamp) || value === null || value === undefined) return '-'
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) return '-'
    const parts = new Intl.DateTimeFormat('zh-CN', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(date)
    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value || ''
    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`
}
