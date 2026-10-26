export type StatusTone = 'success' | 'danger' | 'primary' | 'warning' | 'neutral'
type PredictionDomain = 'direction' | 'business' | 'fund' | 'round'
const prefixes: Record<PredictionDomain, string> = {
    direction: 'DIRECTION_', business: 'BUSINESS_STATUS_', fund: 'FUND_STATUS_', round: 'ROUND_STATE_'
}
// Only known enum values receive meaning. Future values keep their original label and neutral tone.
const tones: Record<PredictionDomain, Record<string, StatusTone>> = {
    direction: { UP: 'success', DOWN: 'danger' },
    business: {
        PENDING: 'warning', ACTIVE: 'primary', RESULT_READY: 'warning',
        SETTLED: 'success', CANCELED: 'neutral'
    },
    fund: {
        PENDING: 'warning', DEBITED: 'primary', SETTLE_PENDING: 'warning',
        SETTLED: 'success', REFUND_PENDING: 'warning', REFUNDED: 'success',
        UNKNOWN: 'warning', REJECTED: 'danger', MANUAL_REQUIRED: 'warning'
    },
    round: {
        PREPARING: 'warning', BETTING: 'primary', LOCKED: 'warning', OBSERVING: 'primary',
        RESULTING: 'warning', SETTLING: 'warning', FINISHED: 'success'
    }
}
export function predictionTone(domain: PredictionDomain, value: unknown): StatusTone {
    if (typeof value !== 'string') return 'neutral'
    const prefix = prefixes[domain]
    const key = value.startsWith(prefix) ? value.slice(prefix.length) : value
    return Object.prototype.hasOwnProperty.call(tones[domain], key) ? tones[domain][key] : 'neutral'
}
export function orderStatusParts(row: Record<string, unknown>) {
    return (['business_status', 'fund_status'] as const).flatMap(key => {
        const value = row[key]
        return typeof value === 'string' && value
            ? [{ key, value, tone: predictionTone(key === 'business_status' ? 'business' : 'fund', value) }]
            : []
    })
}
// Grid's HIT (3) and MISS (4) are not funds-completed states.
// Both settled outcomes (5/6) are complete; the unchanged label still states win/loss.
export function gridStatusTone(value: unknown): StatusTone {
    switch (value) {
        case 1: case 3: case 4: return 'warning'
        case 2: return 'primary'
        case 5: case 6: return 'success'
        case 8: return 'danger'
        default: return 'neutral'
    }
}

/** Display projection only; original business/fund fields remain available in details. */
export function orderStatusSummary(row: Record<string, unknown>) {
    const parts = orderStatusParts(row)
    if (!parts.length) return null
    const business = parts.find(part => part.key === 'business_status')
    const fund = parts.find(part => part.key === 'fund_status')
    const b = business?.value.replace(/^BUSINESS_STATUS_/, '')
    const f = fund?.value.replace(/^FUND_STATUS_/, '')
    // Missing or future funding states must never masquerade as completion.
    if (!fund) return { key: 'fund_status', value: 'FUND_STATUS_UNKNOWN', tone: 'warning' as StatusTone }
    if (f !== 'SETTLED' && f !== 'DEBITED') return fund
    if (!business) return { key: 'business_status', value: 'BUSINESS_STATUS_UNKNOWN', tone: 'neutral' as StatusTone }
    if (f === 'DEBITED' && b === 'SETTLED') return { ...fund, tone: 'warning' as StatusTone }
    return business
}
export function orderStatusTitle(row: Record<string, unknown>) {
    return orderStatusParts(row).map(part => `${part.key}: ${part.value}`).join(' / ')
}
/** Inspect decimal text directly, including sub-Number precision values and negative zero. */
export function profitTone(value: unknown): StatusTone {
    if (typeof value !== 'string' || !/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value) || !/[1-9]/.test(value)) return 'neutral'
    return value.startsWith('-') ? 'danger' : 'success'
}
