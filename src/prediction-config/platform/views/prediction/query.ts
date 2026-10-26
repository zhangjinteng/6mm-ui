import { lastSevenDaysRange, todayRange } from './calendar-range'
import { unsigned, compareDecimal } from './format'
export const hasPermission = (permissions: readonly string[], permission: string) =>
    permissions.includes('*') || permissions.includes(permission)
export function dateRangeQuery(range: unknown, timeField?: string): Record<string, string> {
    if (
        !Array.isArray(range) ||
        range.length !== 2 ||
        range.some(
            (date) =>
                !(date instanceof Date) ||
                !Number.isSafeInteger(date.getTime()) ||
                date.getTime() <= 0
        )
    )
        throw Error('请选择有效的开始和结束时间')
    if (timeField)
        return {
            time_field: timeField,
            time_from_ms: String(range[0].getTime()),
            time_to_ms: String(range[1].getTime())
        }
    return {
        created_from_ms: String(range[0].getTime()),
        created_to_ms: String(range[1].getTime())
    }
}
export function defaultQueryRange(view: 'rounds' | 'current' | 'history', now = new Date()): [Date, Date] {
    return view === 'current' ? todayRange(now) : lastSevenDaysRange(now)
}
export const orderChoices = {
    direction: ['UP', 'DOWN'],
    order_source: ['PLAYER', 'MARKET_MAKER'],
    business_status: ['PENDING', 'ACTIVE', 'RESULT_READY', 'SETTLED', 'CANCELED'],
    fund_status: [
        'PENDING',
        'DEBITED',
        'SETTLE_PENDING',
        'SETTLED',
        'REFUND_PENDING',
        'REFUNDED',
        'UNKNOWN',
        'REJECTED',
        'MANUAL_REQUIRED'
    ],
    result: ['PENDING', 'WIN', 'LOSE', 'DRAW', 'CANCELED'],
    sort_field: ['CREATED_AT', 'SETTLED_AT', 'STAKE', 'FINAL_RETURN'],
    sort_direction: ['ASC', 'DESC']
}
export const roundChoices = {
    status: ['PREPARING', 'BETTING', 'LOCKED', 'OBSERVING', 'RESULTING', 'SETTLING', 'FINISHED'],
    result: orderChoices.result,
    sort_field: ['BET_OPEN_AT', 'BET_CLOSE_AT', 'TOTAL_STAKE', 'AGENT_REVENUE'],
    sort_direction: orderChoices.sort_direction
}
export function buildQuery(
    game: 'UP_DOWN' | 'HIGH_LOW',
    round: boolean,
    filters: Record<string, unknown>,
    page: number,
    pageSize: number
): Record<string, string | number> {
    if (
        !Number.isInteger(page) ||
        page < 1 ||
        page > 2147483647 ||
        !Number.isInteger(pageSize) ||
        pageSize < 1 ||
        pageSize > 200
    )
        throw Error('分页范围无效')
    if ('user_filter' in filters || 'user_ids' in filters) throw Error('查询只接受UID和账号条件')
    const newTime = ['time_field', 'time_from_ms', 'time_to_ms'].some((k) => k in filters)
    if (
        newTime &&
        (['created_from_ms', 'created_to_ms'].some((k) => k in filters) ||
            !(round ? ['CREATED_AT', 'DRAW_AT'] : ['CREATED_AT', 'FUNDS_COMPLETED_AT']).includes(
                String(filters.time_field)
            ))
    )
        throw Error('查询时间用途无效')
    const a = filters[newTime ? 'time_from_ms' : 'created_from_ms'],
        b = filters[newTime ? 'time_to_ms' : 'created_to_ms']
    if (
        !unsigned(a) ||
        !unsigned(b) ||
        BigInt(a) <= 0n ||
        BigInt(a) >= BigInt(b) ||
        BigInt(b) - BigInt(a) > 2678400000n
    )
        throw Error('请选择不超过31天的有效时间范围')
    const result: Record<string, string | number> = {
        game_type: game,
        page_number: page,
        page_size: pageSize
    }
    const ids = ['agent_id', ...(round ? [] : ['home_site_id', 'user_id'])]
    const texts = [
        'symbol',
        'market_id',
        'round_id',
        ...(round ? [] : ['order_id', 'public_user_id', 'user_name', 'user_keyword']),
        'duration_seconds',
        ...(newTime
            ? ['time_field', 'time_from_ms', 'time_to_ms']
            : ['created_from_ms', 'created_to_ms']),
        ...ids
    ]
    const choices: Record<string, string[]> = round ? roundChoices : orderChoices
    for (const k of [...texts, ...Object.keys(choices)]) {
        const v = filters[k]
        if (v === undefined || v === null || v === '') continue
        if (typeof v !== 'string') throw Error('查询字段必须为文本')
        const text = v.trim()
        if (!text) continue
        if (ids.includes(k) && !unsigned(text, undefined, false))
            throw Error('用户、代理或站点ID无效')
        if (k === 'duration_seconds' && !unsigned(text)) throw Error('房间周期无效')
        if (k === 'symbol' && !/^[A-Z0-9]{2,32}$/.test(text.toUpperCase()))
            throw Error('交易对格式无效')
        if (choices[k] && !choices[k].includes(text)) throw Error('筛选选项无效')
        if (
            ['public_user_id', 'user_name', 'user_keyword'].includes(k) &&
            (/[\u0000-\u001f\u007f]/.test(v) ||
                [...text].length > (k === 'public_user_id' ? 64 : 128))
        )
            throw Error('UID或账号格式无效')
        if (text.length > 128) throw Error('查询内容过长')
        result[k] = k === 'symbol' ? text.toUpperCase() : text
    }
    return result
}
export function validateStrategy(s: Record<string, unknown>): string[] {
    const errors: string[] = [],
        fields = [
            'initial_total_stake_min',
            'initial_total_stake_max',
            'replenishment_deviation_percent',
            'max_total_pool_imbalance',
            'target_up_ratio_min_percent',
            'target_up_ratio_max_percent'
        ]
    if (
        fields.some(
            (k) =>
                typeof s[k] !== 'string' ||
                !/^(0|[1-9]\d*)(\.\d+)?$/.test(s[k] as string) ||
                (s[k] as string).length > 128
        )
    )
        return ['金额和比例必须为有效十进制文本']
    const d = (k: string) => s[k] as string
    if (
        compareDecimal(d('initial_total_stake_min'), '0') <= 0 ||
        compareDecimal(d('initial_total_stake_min'), d('initial_total_stake_max')) > 0
    )
        errors.push('初始总资金范围无效')
    if (compareDecimal(d('max_total_pool_imbalance'), '0') <= 0)
        errors.push('总资金池差额上限必须大于0')
    if (
        compareDecimal(d('replenishment_deviation_percent'), '0') <= 0 ||
        compareDecimal(d('replenishment_deviation_percent'), '50') >= 0
    )
        errors.push('补单偏差必须大于0且小于50%')
    if (
        compareDecimal(d('target_up_ratio_min_percent'), d('target_up_ratio_max_percent')) > 0 ||
        compareDecimal(d('target_up_ratio_max_percent'), '100') > 0
    )
        errors.push('目标比例必须有序且位于0—100%')
    if (
        !unsigned(s.order_interval_ms, undefined, false) ||
        !unsigned(s.stop_before_bet_close_seconds, 30n)
    )
        errors.push('订单间隔必须为正，停止补单时间须在0—30秒内')
    const min = s.orders_per_side_min,
        max = s.orders_per_side_max
    if (
        typeof min !== 'number' ||
        typeof max !== 'number' ||
        !Number.isInteger(min) ||
        !Number.isInteger(max) ||
        min < 1 ||
        max < min ||
        max > 2147483647
    )
        errors.push('每侧笔数范围无效')
    if (typeof s.enabled !== 'boolean' || typeof s.dynamic_replenishment_enabled !== 'boolean')
        errors.push('开关值无效')
    return errors
}
