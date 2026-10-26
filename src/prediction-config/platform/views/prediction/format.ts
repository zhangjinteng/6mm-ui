export const INT64_MAX = 9223372036854775807n
export function unsigned(value: unknown, max = INT64_MAX, zero = true): value is string {
    return (
        typeof value === 'string' &&
        /^(0|[1-9]\d*)$/.test(value) &&
        BigInt(value) <= max &&
        (zero || value !== '0')
    )
}
export function decimalText(value: unknown): string {
    if (value === undefined || value === null) return '未提供'
    return typeof value === 'string' && /^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)
        ? value
        : '数据格式异常'
}
export function compareDecimal(a: string, b: string): number {
    const split = (v: string) => {
        const [i, f = ''] = v.split('.')
        return { i: BigInt(i), f }
    }
    const x = split(a),
        y = split(b)
    if (x.i !== y.i) return x.i > y.i ? 1 : -1
    const n = Math.max(x.f.length, y.f.length),
        xf = x.f.padEnd(n, '0'),
        yf = y.f.padEnd(n, '0')
    return xf === yf ? 0 : xf > yf ? 1 : -1
}
export function safeCount(value: string): number | null {
    return unsigned(value, BigInt(Number.MAX_SAFE_INTEGER)) ? Number(value) : null
}
export function timeText(value: unknown): string {
    if (value === undefined || value === null) return '未提供'
    if (!unsigned(value, 8640000000000000n)) return `${String(value)}（无法显示时间）`
    return new Date(Number(value)).toLocaleString('zh-CN', { hour12: false })
}
export function roomLabel(duration: string, game = 'UP_DOWN'): string {
    const rooms: Record<string, string> = {
        '35': '5',
        '40': '10',
        '45': '15',
        '60': '30',
        '90': '60'
    }
    return game === 'UP_DOWN'
        ? rooms[duration]
            ? `${rooms[duration]}秒`
            : `历史周期${duration}秒`
        : `${duration}秒`
}
const labels: Record<string, string> = {
    PLAYER: '玩家',
    MARKET_MAKER: '做市机器人',
    UP: '上涨',
    DOWN: '下跌',
    PENDING: '待处理',
    ACTIVE: '生效',
    RESULT_READY: '待结算',
    SETTLED: '已结算',
    CANCELED: '已取消',
    UNKNOWN: '资金结果未知',
    MANUAL_REQUIRED: '需人工处理',
    DEBITED: '已扣款',
    SETTLE_PENDING: '待派发',
    REFUND_PENDING: '待退款',
    REFUNDED: '已退款',
    REJECTED: '已拒绝',
    WIN: '赢',
    LOSE: '输',
    DRAW: '平',
    PREPARING: '准备中',
    BETTING: '下注中',
    LOCKED: '已封盘',
    OBSERVING: '观察中',
    RESULTING: '计算结果',
    SETTLING: '结算中',
    FINISHED: '已结束',
    UNBOUND: '未绑定',
    DRAINING: '等待旧业务完成',
    READY: '条件就绪',
    BLOCKED: '条件未就绪',
    MAKER_DISABLED: '做市关闭',
    UNAVAILABLE: '暂无运行健康证据',
    PLANNED: '已计划',
    FUNDING: '资金处理中',
    COMPENSATING: '退款处理中',
    COMPENSATED: '已退款完成',
    ACTIVATED: '已激活',
    INITIAL: '初始做市',
    REPLENISHMENT: '动态补单',
    STRATEGY_MISSING: '尚未配置策略',
    SITE_BINDING_MISSING: '尚未绑定站点',
    SITE_BINDING_DRAINING: '站点正在变更',
    ROBOT_HOME_SITE_MISMATCH: '机器人归属站点不一致',
    ROBOT_BINDINGS_INSUFFICIENT: '可用机器人不足',
    FROZEN: '冻结',
    DISABLED: '禁用'
}
export function enumLabel(value: unknown): string {
    if (value === undefined || value === null || value === '') return '未提供'
    const raw = String(value),
        key = raw.replace(
            /^(MARKET_MAKER_READINESS_BLOCKER_|MARKET_MAKER_READINESS_STATE_|MARKET_MAKER_SITE_BINDING_STATE_|MARKET_MAKER_WORKER_HEALTH_|MARKET_MAKER_RUNTIME_BATCH_STATE_|MARKET_MAKER_RUNTIME_BATCH_KIND_|SITE_BINDING_STATE_|BUSINESS_STATUS_|FUND_STATUS_|ORDER_SOURCE_|ORDER_RESULT_|ROUND_STATE_|DIRECTION_)/,
            ''
        )
    return labels[key] ?? `未识别（${raw}）`
}
export function errorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
    )
        return error.message
    return '暂时无法获取确定结果，请稍后刷新或核验原操作'
}
