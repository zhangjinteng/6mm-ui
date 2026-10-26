import { orderIdentityText } from '../order-identity'
export const exact = (value: unknown): string =>
    value === undefined || value === null
        ? '—'
        : value === ''
          ? '（空）'
          : typeof value === 'string' || typeof value === 'number'
            ? String(value)
            : '—'
export function localTime(ms: number): string {
    const date = new Date(ms),
        pad = (value: number) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
export function timestamp(value: unknown): string {
    if (typeof value !== 'string' || !/^\d+$/.test(value) || BigInt(value) > 253402300799999n)
        return exact(value)
    return localTime(Number(value))
}
export const fields: Record<string, string> = {
    order_no: '订单编号',
    order_id: '内部订单ID',
    user_id: '用户ID',
    symbol: '交易对',
    cell_id: '网格单元',
    price_low: '价格下界',
    price_high: '价格上界',
    stake_amount: '本金',
    locked_multiplier: '锁定倍率',
    status: '订单状态',
    created_at_ms: '创建时间',
    locked_gross_payout: '锁定总返还',
    realized_net_profit: '用户已实现净收益',
    settled_at_ms: '结算时间',
    settlement_mark_price: '结算标记价',
    settlement_price_time_ms: '结算价格行情时间',
    debit_ledger_id: '扣款流水号',
    settlement_funding_type: '派彩／退款类型',
    settlement_ledger_id: '派彩／退款流水号',
    home_site_id: '归属站点ID',
    entry_site_id: '入口站点ID',
    settlement_asset: '结算资产',
    time_start_ms: '单元开始时间',
    time_end_ms: '单元结束时间',
    locked_net_profit: '锁定净收益',
    order_version: '订单版本',
    updated_at_ms: '更新时间',
    result_code: '结果代码',
    client_order_id: '客户端订单号',
    public_quote_id: '公共报价ID',
    quote_id: '报价ID',
    locked_layout_version: '锁定布局版本',
    locked_config_version: '锁定站点配置版本',
    locked_model_version: '锁定模型版本',
    bet_close_time_ms: '封盘时间',
    locked_hit_probability: '锁定命中概率',
    hit_time_ms: '命中时间',
    hit_mark_price: '命中价格',
    payout_discarded_remainder: '返还舍弃余数',
    result_message: '结果说明'
}
export const listFields = [
    'order_no',
    'user_id',
    'symbol',
    'cell_id',
    'price_low',
    'price_high',
    'stake_amount',
    'locked_multiplier',
    'status',
    'created_at_ms',
    'locked_gross_payout',
    'realized_net_profit',
    'settled_at_ms',
    'home_site_id',
    'entry_site_id',
    'settlement_asset',
    'time_start_ms',
    'time_end_ms',
    'locked_net_profit',
    'order_version',
    'updated_at_ms',
    'result_code'
]
export const groups = [
    {
        title: '订单信息',
        keys: [
            'order_no',
            'client_order_id',
            'user_id',
            'home_site_id',
            'entry_site_id',
            'symbol',
            'settlement_asset',
            'cell_id',
            'status',
            'order_version'
        ]
    },
    {
        title: '锁定条件',
        keys: [
            'price_low',
            'price_high',
            'stake_amount',
            'locked_multiplier',
            'locked_gross_payout',
            'locked_net_profit',
            'public_quote_id',
            'quote_id',
            'locked_layout_version',
            'locked_config_version',
            'locked_model_version',
            'locked_hit_probability',
            'time_start_ms',
            'time_end_ms',
            'bet_close_time_ms'
        ]
    },
    {
        title: '结果与时间',
        keys: [
            'realized_net_profit',
            'result_code',
            'result_message',
            'hit_time_ms',
            'hit_mark_price',
            'settlement_mark_price',
            'settlement_price_time_ms',
            'debit_ledger_id',
            'settlement_funding_type',
            'settlement_ledger_id',
            'payout_discarded_remainder',
            'created_at_ms',
            'updated_at_ms',
            'settled_at_ms'
        ]
    }
]
export const statusNames = [
    '',
    '待扣款',
    '进行中',
    '已命中',
    '未命中',
    '已结算·赢',
    '已结算·输',
    '作废',
    '拒绝'
]
export const display = (key: string, value: unknown): string =>
    key.endsWith('_ms')
        ? timestamp(value)
        : key === 'status' && typeof value === 'number'
          ? statusNames[value] || exact(value)
          : exact(value)
export function errorInfo(error: unknown): { code: string; unauthorized: boolean; trace: string } {
    const e = error as
        | {
              error_code?: string
              message?: string
              response?: {
                  status?: number
                  data?: { data?: { error_code?: string; trace_id?: string } }
              }
          }
        | undefined
    const data = e?.response?.data?.data
    const raw = data?.error_code || e?.error_code || e?.message || ''
    const code = [
        'SCOPE_UNAVAILABLE',
        'DEPENDENCY_UNAVAILABLE',
        'FORBIDDEN',
        'ORDER_NOT_FOUND',
        'INVALID_REQUEST',
        'USER_FILTER_TOO_BROAD',
        'INVALID_RESPONSE'
    ].includes(raw)
        ? raw
        : 'LOAD_FAILED'
    return {
        code,
        unauthorized: e?.response?.status === 401,
        trace:
            typeof data?.trace_id === 'string' && /^[a-zA-Z0-9-]{1,64}$/.test(data.trace_id)
                ? data.trace_id
                : ''
    }
}
export const messages: Record<string, string> = {
    current: '网格当前订单',
    history: '网格历史订单',
    readOnly: '只读查询',
    noPermission: '没有订单查询权限',
    noDetail: '没有详情查询权限',
    detail: '详情',
    query: '筛选订单',
    timeRange: '创建日期（最多31天）',
    empty: '暂无符合条件的记录',
    invalidQuery: '请检查时间范围、筛选内容和页码',
    total: '总记录数',
    previous: '上一页',
    next: '下一页',
    pageSize: '每页条数',
    limit: '仅可查询前1000页，请缩小时间或筛选范围',
    retry: '重试',
    loading: '加载中',
    authExpired: '登录状态已失效，请重新登录',
    SCOPE_UNAVAILABLE: '订单查询范围暂不可用',
    DEPENDENCY_UNAVAILABLE: '订单查询服务暂不可用',
    FORBIDDEN: '没有此次查询权限',
    ORDER_NOT_FOUND: '订单不存在或不在查询范围内',
    INVALID_REQUEST: '查询条件不合法',
    USER_FILTER_TOO_BROAD: '匹配用户超过500个，请缩小筛选条件',
    INVALID_RESPONSE: '订单数据不完整，请重试',
    LOAD_FAILED: '订单加载失败，请重试'
}

// Prototype table values stay separate from original detail facts.
export const tableLabels: Record<string, string> = {
    order_no: '订单编号',
    order_id: '内部订单ID',
    debit_ledger_id: '扣款流水号',
    public_user_id: 'UID',
    user_name: '\u7528\u6237\u8d26\u53f7',
    source_name: '来源名称',
    source_type: '来源类型',
    symbol: '\u4ea4\u6613\u54c1\u79cd',
    cell_id: '\u4e0b\u5355\u683c\u5b50',
    price_range: '\u683c\u5b50\u4ef7\u683c\u533a\u95f4',
    stake_amount: '\u4e0b\u6ce8\u91d1\u989d(U)',
    locked_multiplier: '\u4e0b\u5355\u8d54\u7387',
    locked_gross_payout: '\u9884\u8ba1\u8fd4\u8fd8(U)',
    created_at_ms: '\u4e0b\u5355\u65f6\u95f4',
    order_status: '\u8ba2\u5355\u72b6\u6001',
    result_price: '\u7ed3\u7b97\u4ef7\u683c',
    result_cell: '\u7ed3\u679c\u683c\u5b50',
    actual_return: '\u5b9e\u9645\u8fd4\u8fd8(U)',
    realized_pnl: '\u8ba2\u5355\u76c8\u4e8f(U)',
    settled_at_ms: '\u7ed3\u7b97\u65f6\u95f4',
    settlement_ledger_id: '派彩／退款流水号',
    internal_user_id: '\u5185\u90e8\u7528\u6237ID'
}
const tableKeys: Record<string, string[]> = {
    current: [
        'order_no',
        'public_user_id',
        'user_name',
        'symbol',
        'price_range',
        'stake_amount',
        'locked_multiplier',
        'locked_gross_payout',
        // 当前订单暂不展示结算字段；保留字段定义与接口数据，便于恢复。
        // 'result_price',
        // 'settlement_ledger_id',
        'debit_ledger_id',
        'order_status',
        'created_at_ms'
    ],
    history: [
        'order_no',
        'public_user_id',
        'user_name',
        'symbol',
        'price_range',
        'stake_amount',
        'locked_multiplier',
        'result_price',
        'order_status',
        'actual_return',
        'realized_pnl',
        'created_at_ms',
        'settled_at_ms',
        'debit_ledger_id',
        'settlement_ledger_id'
    ]
}
function gridOrderKeys(view: string, platform: boolean): string[] {
    const keys = [...(tableKeys[view] ?? [])]
    if (platform)
        keys.splice(
            keys.indexOf('user_name') + 1,
            0,
            'source_name',
            'source_type'
        )
    return keys
}
export function gridTableKeys(view: string, platform = false): string[] {
    return gridOrderKeys(view, platform).filter(key => view !== 'history' || !['debit_ledger_id', 'settlement_ledger_id'].includes(key))
}
function listMoney(value: unknown): string {
    if (typeof value !== 'string' || !/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) return '—'
    const [integer, fraction = ''] = value.split('.')
    return integer + '.' + fraction.replace(/0+$/, '').padEnd(2, '0')
}
function listOdds(value: unknown): string {
    if (typeof value !== 'string' || !/^(0|[1-9]\d*)(\.\d+)?$/.test(value)) return '—'
    const [integer, fraction = ''] = value.split('.')
    const approximate = /[1-9]/.test(fraction.slice(4)),
        visible = fraction.slice(0, 4).replace(/0+$/, '')
    return `${approximate ? '≈' : ''}${integer}${visible ? '.' + visible : ''}x`
}
export function gridTableDisplay(
    key: string,
    row: Record<string, unknown>,
    baseDisplay = display
): string {
    const identity = orderIdentityText(key, row)
    if (identity !== undefined) return identity
    if (key === 'result_price')
        return typeof row.settlement_mark_price === 'string' && row.settlement_mark_price !== ''
            ? row.settlement_mark_price
            : '—'
    if (['debit_ledger_id', 'settlement_funding_type', 'settlement_ledger_id'].includes(key) && row.funding_read_available !== true)
        return baseDisplay('ledger_unavailable', '暂不可用')
    if (key === 'settlement_ledger_id') {
        if (row.status === 6)
            return row.settlement_ledger_id || row.settlement_funding_type
                ? baseDisplay('ledger_anomaly', '关联异常')
                : baseDisplay('ledger_loss', '无（下单时已扣款）')
        if ((row.status === 5 && row.settlement_funding_type === 'REFUND') ||
            (row.status === 7 && row.settlement_funding_type === 'PAYOUT'))
            return baseDisplay('ledger_anomaly', '关联异常')
        if (typeof row.settlement_ledger_id === 'string' && row.settlement_ledger_id !== '')
            return row.settlement_ledger_id
        if (row.status === 5 || (row.status === 7 && (row.debit_ledger_id || row.settlement_funding_type === 'REFUND'))) return baseDisplay('ledger_anomaly', '关联异常')
        if ([1, 2, 3, 4].includes(Number(row.status))) return baseDisplay('ledger_pending', '结算中')
        return '—'
    }
    if (key === 'result_cell') return '—'
    if (key === 'order_status') return baseDisplay('status', row.status)
    if (key === 'price_range')
        return typeof row.price_low === 'string' && typeof row.price_high === 'string'
            ? `${listMoney(row.price_low)} – ${listMoney(row.price_high)}`
            : '—'
    if (key === 'actual_return')
        return listMoney(
            row.status === 5
                ? row.locked_gross_payout
                : row.status === 6
                  ? '0'
                  : row.status === 7
                    ? row.stake_amount
                    : undefined
        )
    if (key === 'realized_pnl')
        return typeof row.status === 'number' && [5, 6, 7].includes(row.status)
            ? listMoney(row.realized_net_profit)
            : '—'
    if (key === 'locked_multiplier') return listOdds(row[key])
    if (['stake_amount', 'locked_gross_payout'].includes(key)) return listMoney(row[key])
    const value = row[key]
    return typeof value === 'string' && value !== '' ? baseDisplay(key, value) : '—'
}
