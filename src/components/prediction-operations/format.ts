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
const validationMessages = new Set(["请选择有效的开始和结束时间","分页范围无效","查询只接受UID和账号条件","查询时间用途无效","请选择不超过31天的有效时间范围","查询字段必须为文本","用户、代理或站点ID无效","房间周期无效","交易对格式无效","筛选选项无效","UID或账号格式无效","查询内容过长","订单定位参数不完整","订单定位响应无效","订单列表归属无效","无权查看目标订单列表","订单创建时间无效","订单创建时间无效","订单创建日期超出查询范围","订单状态已变化或未找到，请重新定位","订单定位跳转次数已达上限，请重新定位"])
export function errorMessage(error: unknown): string {
    if (error instanceof Error && validationMessages.has(error.message)) return error.message
    const e = error as { error_code?: string; data?: {error_code?: string}; response?: {status?: number; data?: {data?: {error_code?: string}}} }
    if (e?.response?.status === 401) return '登录状态已失效，请重新登录'
    const rawCode = e?.response?.data?.data?.error_code ?? e?.data?.error_code ?? e?.error_code
    const code = typeof rawCode === 'string' ? rawCode.replace(/^ERROR_CODE_/, '') : ''
    const messages: Record<string,string> = {
        INVALID_ARGUMENT: '请求参数无效', INVALID_REQUEST: '请求参数无效', USER_FILTER_TOO_BROAD: '匹配用户超过500个，请缩小筛选条件',
        PERMISSION_DENIED: '无权访问', FORBIDDEN: '无权访问', UNAUTHENTICATED: '登录状态已失效，请重新登录',
        QUERY_CONTRACT_MISMATCH: '查询服务版本不匹配', ORDER_NOT_FOUND: '订单不存在', NOT_FOUND: '订单不存在',
        DEPENDENCY_UNAVAILABLE: '服务暂不可用', UNAVAILABLE: '服务暂不可用', SCOPE_UNAVAILABLE: '站点授权暂不可用',
        DEADLINE_EXCEEDED: '查询超时，请稍后重试'
    }
    return messages[code] || '查询失败，请稍后重试'
}
