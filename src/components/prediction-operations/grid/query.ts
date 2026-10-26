import type { GridOrder, GridPage, OrderView } from '../types'
const MAX_ID = 9223372036854775807n
const MAX_TIME = 253402300799999n
export const statuses = (view: OrderView): number[] =>
    view === 'current' ? [1, 2, 3, 4] : [5, 6, 7, 8]
function reject(): never {
    throw new Error('INVALID_REQUEST')
}
function integer(value: unknown, max = MAX_ID, zero = false): value is string {
    return (
        typeof value === 'string' &&
        (zero ? /^(0|[1-9]\d*)$/ : /^[1-9]\d*$/).test(value) &&
        value.length <= 19 &&
        BigInt(value) <= max
    )
}
export function epoch(value: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value)
    if (!match) return reject()
    const [year, month, day, hour, minute, second] = match.slice(1).map(Number)
    const date = new Date(0)
    date.setFullYear(year, month - 1, day)
    date.setHours(hour, minute, second, 0)
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day ||
        date.getHours() !== hour ||
        date.getMinutes() !== minute ||
        date.getSeconds() !== second ||
        date.getTime() < 0
    )
        return reject()
    return String(date.getTime())
}
export function serializeQuery(
    view: OrderView,
    values: Record<string, unknown>,
    page: number,
    size: number
): string {
    const keys = [
        'created_from_ms',
        'created_to_ms',
        'order_id',
        'order_no',
        'user_id',
        'public_user_id',
        'user_keyword',
        'client_order_id',
        'home_site_id',
        'symbol',
        'status'
    ]
    if (
        Object.keys(values).some((key) => !keys.includes(key)) ||
        !Number.isInteger(page) ||
        page < 1 ||
        page > 1000 ||
        !Number.isInteger(size) ||
        size < 1 ||
        size > 100
    )
        return reject()
    const from = values.created_from_ms,
        to = values.created_to_ms
    if (
        !integer(from, MAX_TIME, true) ||
        !integer(to, MAX_TIME, true) ||
        BigInt(to) <= BigInt(from) ||
        BigInt(to) - BigInt(from) > 2678400000n
    )
        return reject()
    const params = new URLSearchParams({ created_from_ms: from, created_to_ms: to })
    for (const key of keys.slice(2, -1)) {
        const raw = values[key]
        if (raw === undefined || raw === '') continue
        if (typeof raw !== 'string') return reject()
        let value: string = raw
        if (key === 'user_keyword') {
            if (/[\x00-\x1f\x7f]/.test(value)) return reject()
            value = value.trim()
            if (!value) continue
            if ([...value].length > 128) return reject()
        }
        if (['order_id', 'user_id'].includes(key) && !integer(value)) return reject()
        if (key === 'public_user_id' && (value.trim() !== value || [...value].length > 64 || /[\x00-\x1f\x7f]/.test(value))) return reject()
        if (key === 'order_no' && (value.length !== 20 || !/^GC[0-9]{12}[A-Z0-9]{6}$/.test(value))) return reject()
        if (key === 'client_order_id' && !/^[A-Za-z0-9_-]{8,64}$/.test(value)) return reject()
        if (key === 'symbol' && !/^[A-Z0-9]{2,32}$/.test(value)) return reject()
        if (
            key === 'home_site_id' &&
            (value.trim() !== value ||
                value.includes('\0') ||
                new TextEncoder().encode(value).length > 64)
        )
            return reject()
        params.set(key, value)
    }
    const selected = values.status
    if (
        selected !== undefined &&
        selected !== '' &&
        (typeof selected !== 'string' || !statuses(view).map(String).includes(selected))
    )
        return reject()
    for (const status of selected ? [Number(selected)] : statuses(view))
        params.append('statuses[]', String(status))
    params.set('page_no', String(page))
    params.set('page_size', String(size))
    return params.toString()
}
function record(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}
const amount = (v: unknown, signed = false): boolean =>
    typeof v === 'string' &&
    (signed ? /^-?(0|[1-9]\d*)(\.\d+)?$/ : /^(0|[1-9]\d*)(\.\d+)?$/).test(v)
export function validateOrder(
    value: unknown,
    view?: OrderView,
    orderId?: string,
    detail = false
): GridOrder {
    if (
        !record(value) ||
        !Number.isInteger(value.status) ||
        ![1, 2, 3, 4, 5, 6, 7, 8].includes(value.status as number) ||
        (view && !statuses(view).includes(value.status as number)) ||
        (orderId && value.order_id !== orderId)
    )
        throw new Error('INVALID_RESPONSE')
    for (const key of ['order_id', 'user_id', 'order_version', 'time_start_ms', 'time_end_ms'])
        if (!integer(value[key])) throw new Error('INVALID_RESPONSE')
    for (const key of [
        'home_site_id',
        'entry_site_id',
        'symbol',
        'settlement_asset',
        'cell_id',
        'price_low',
        'price_high',
        'status_name'
    ])
        if (typeof value[key] !== 'string') throw new Error('INVALID_RESPONSE')
    for (const key of [
        'stake_amount',
        'locked_gross_payout',
        'locked_net_profit',
        'locked_multiplier'
    ])
        if (!amount(value[key])) throw new Error('INVALID_RESPONSE')
    for (const key of ['created_at_ms', 'updated_at_ms'])
        if (!integer(value[key], MAX_TIME, true)) throw new Error('INVALID_RESPONSE')
    if (value.settled_at_ms !== null && !integer(value.settled_at_ms))
        throw new Error('INVALID_RESPONSE')
    if (value.order_no != null && (typeof value.order_no !== 'string' || !/^GC\d{12}[A-Z0-9]{6}$/.test(value.order_no)))
        throw new Error('INVALID_RESPONSE')
    if (value.settlement_mark_price != null && !amount(value.settlement_mark_price))
        throw new Error('INVALID_RESPONSE')
    if (value.settlement_price_time_ms != null && !integer(value.settlement_price_time_ms, MAX_TIME))
        throw new Error('INVALID_RESPONSE')
    if (Object.hasOwn(value, 'funding_read_available') && typeof value.funding_read_available !== 'boolean')
        throw new Error('INVALID_RESPONSE')
    for (const key of ['debit_ledger_id', 'settlement_ledger_id'])
        if (value[key] != null && !integer(value[key]))
            throw new Error('INVALID_RESPONSE')
    if (value.settlement_funding_type != null && !['PAYOUT', 'REFUND'].includes(value.settlement_funding_type as string))
        throw new Error('INVALID_RESPONSE')
    if (!Number.isInteger(value.result_code) || (value.result_code as number) < 1)
        throw new Error('INVALID_RESPONSE')
    const realized = [5, 6, 7].includes(value.status as number)
    if (
        realized
            ? !amount(value.realized_net_profit, true)
            : Object.hasOwn(value, 'realized_net_profit')
    )
        throw new Error('INVALID_RESPONSE')
    if (detail) {
        for (const key of [
            'client_order_id',
            'public_quote_id',
            'quote_id',
            'locked_model_version',
            'result_message'
        ])
            if (typeof value[key] !== 'string') throw new Error('INVALID_RESPONSE')
        for (const key of ['locked_layout_version', 'locked_config_version', 'bet_close_time_ms'])
            if (!integer(value[key])) throw new Error('INVALID_RESPONSE')
        if (
            !amount(value.locked_hit_probability) ||
            !Number.isInteger(value.payout_discarded_remainder) ||
            (value.payout_discarded_remainder as number) < 0 ||
            (value.payout_discarded_remainder as number) > 99
        )
            throw new Error('INVALID_RESPONSE')
        if (
            value.hit_time_ms === null
                ? value.hit_mark_price !== null
                : !integer(value.hit_time_ms) || typeof value.hit_mark_price !== 'string'
        )
            throw new Error('INVALID_RESPONSE')
    }
    return value as GridOrder
}
export function validatePage(
    value: unknown,
    view: OrderView,
    page: number,
    size: number
): GridPage {
    if (
        !record(value) ||
        !Array.isArray(value.lists) ||
        value.lists.length > size ||
        value.page_no !== page ||
        value.page_size !== size ||
        !Number.isSafeInteger(value.count) ||
        (value.count as number) < 0 ||
        !record(value.extend) ||
        !integer(value.extend.query_snapshot_at_ms, MAX_TIME, true)
    )
        throw new Error('INVALID_RESPONSE')
    value.lists.forEach((row) => validateOrder(row, view))
    return value as unknown as GridPage
}
export class ReadGate {
    private generation = 0
    private controller?: AbortController
    close(): void {
        this.generation++
        this.controller?.abort()
        this.controller = undefined
    }
    next() {
        this.close()
        const generation = this.generation,
            controller = new AbortController()
        this.controller = controller
        return {
            signal: controller.signal,
            current: () => generation === this.generation && !controller.signal.aborted
        }
    }
}
