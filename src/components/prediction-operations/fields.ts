import { orderStatusSummary } from './status-tone'
import { orderIdentityText } from './order-identity'
import { decimalText, enumLabel, roomLabel, timeText } from './format'
export interface Field {
    key: string
    label: string
    kind?: 'amount' | 'enum' | 'time' | 'room'
}
export const orderFields: Field[] = [
    { key: 'order_no', label: '订单号' },
    { key: 'order_id', label: '内部订单ID' },
    { key: 'debit_ledger_id', label: '扣款流水号' },
    { key: 'settlement_ledger_id', label: '派彩／退款流水号' },
    { key: 'agent_id', label: '主代理ID' },
    { key: 'user_id', label: '用户ID' },
    { key: 'home_site_id', label: '归属站点ID' },
    { key: 'order_source', label: '订单来源', kind: 'enum' },
    { key: 'symbol', label: '交易对' },
    { key: 'market_id', label: '市场ID' },
    { key: 'round_id', label: '回合号' },
    { key: 'duration_seconds', label: '房间', kind: 'room' },
    { key: 'direction', label: '方向', kind: 'enum' },
    { key: 'settlement_asset', label: '结算币种' },
    ...[
        ['stake', '本金'],
        ['estimated_net_profit', '预计净收益'],
        ['estimated_return', '预计返还'],
        ['final_net_profit', '最终净收益'],
        ['final_return', '最终返还'],
        ['agent_profit', '代理收益'],
        ['open_price', '起始价格'],
        ['result_price', '结果价格']
    ].map(([key, label]) => ({ key, label, kind: 'amount' as const })),
    ...[
        ['business_status', '业务状态'],
        ['fund_status', '资金状态'],
        ['unknown_from', '资金未知前状态'],
        ['result', '结果']
    ].map(([key, label]) => ({ key, label, kind: 'enum' as const })),
    ...[
        ['created_at_ms', '创建时间'],
        ['accepted_at_ms', '接受时间'],
        ['expire_at_ms', '到期时间'],
        ['result_at_ms', '结果时间'],
        ['settled_at_ms', '结算时间']
    ].map(([key, label]) => ({ key, label, kind: 'time' as const })),
    { key: 'config_version', label: '配置版本' },
    { key: 'order_version', label: '订单版本' },
    { key: 'funds_transaction_id', label: '资金交易号' },
    { key: 'client_request_id', label: '客户请求号' }
]
export const roundFields: Field[] = [
    { key: 'round_id', label: '回合号' },
    { key: 'agent_id', label: '主代理ID' },
    { key: 'symbol', label: '交易对' },
    { key: 'duration_seconds', label: '房间', kind: 'room' },
    { key: 'status', label: '状态', kind: 'enum' },
    { key: 'result', label: '结果', kind: 'enum' },
    { key: 'market_id', label: '市场ID' },
    { key: 'generation_id', label: '场次组号' },
    { key: 'config_version', label: '配置版本' },
    { key: 'settlement_asset', label: '结算币种' },
    ...[
        ['player_stake', '玩家本金'],
        ['market_maker_stake', '做市本金'],
        ['total_stake', '总本金'],
        ['up_pool', '上涨资金池'],
        ['down_pool', '下跌资金池'],
        ['locked_up_pool', '封盘上涨资金池'],
        ['locked_down_pool', '封盘下跌资金池'],
        ['start_price', '起始价格'],
        ['end_price', '结束价格'],
        ['total_return', '总返还'],
        ['platform_revenue', '平台收入'],
        ['truncation_tail', '截断尾差'],
        ['agent_profit', '代理收益'],
        ['pool_share', '资金池分成']
    ].map(([key, label]) => ({ key, label, kind: 'amount' as const })),
    ...[
        ['participant_count', '参与人数'],
        ['order_count', '订单总数'],
        ['player_order_count', '玩家订单数'],
        ['market_maker_order_count', '做市订单数']
    ].map(([key, label]) => ({ key, label })),
    ...[
        ['bet_open_at_ms', '开放下注'],
        ['bet_close_at_ms', '停止下注'],
        ['observe_end_at_ms', '观察结束'],
        ['draw_at_ms', '开奖时间'],
        ['display_end_at_ms', '展示结束'],
        ['result_at_ms', '结果时间'],
        ['settled_at_ms', '结算时间']
    ].map(([key, label]) => ({ key, label, kind: 'time' as const })),
    { key: 'cancel_reason', label: '取消原因', kind: 'enum' }
]
export function fieldText(row: Record<string, unknown>, field: Field, game: string): string {
    if (field.key === 'order_no') {
        const number = row.order_no
        const prefix = game === 'UP_DOWN' ? 'UD' : game === 'HIGH_LOW' ? 'HL' : ''
        if (prefix && typeof number === 'string' && new RegExp(`^${prefix}[0-9]{12}[A-Z0-9]{6}$`).test(number)) return number
        return typeof row.order_id === 'string' && row.order_id ? row.order_id : '未提供'
    }
    if (field.key === 'settlement_ledger_id') {
        const missing = missingSettlementLedgerText(row)
        if (missing) return missing
    }
    const value = row[field.key]
    if (field.kind === 'amount') return decimalText(value)
    if (field.kind === 'enum') return enumLabel(value)
    if (field.kind === 'time') return timeText(value)
    if (value === undefined || value === null) return '未提供'
    if (field.kind === 'room')
        return typeof value === 'string' ? roomLabel(value, game) : '数据格式异常'
    return typeof value === 'string'
        ? value
        : typeof value === 'boolean'
          ? value
              ? '是'
              : '否'
          : '数据格式异常'
}

function missingSettlementLedgerText(row: Record<string, unknown>): string | undefined {
    if (row.settlement_ledger_id !== undefined && row.settlement_ledger_id !== null && row.settlement_ledger_id !== '') return undefined
    if (typeof row.debit_ledger_id !== 'string' || !/^[1-9][0-9]*$/.test(row.debit_ledger_id)) return undefined
    if (!['SETTLED', 'BUSINESS_STATUS_SETTLED'].includes(String(row.business_status))) return undefined
    if (['LOSE', 'ORDER_RESULT_LOSE'].includes(String(row.result))) return '无（下单时已扣款）'
    if (['WIN', 'ORDER_RESULT_WIN', 'DRAW', 'ORDER_RESULT_DRAW'].includes(String(row.result))) return '关联异常'
    return undefined
}

// Main table business columns are separate from original detail facts.
const operationTableDefinitions: Record<string, Field> = {
    order_id: { key: 'order_id', label: '\u8ba2\u5355\u53f7' },
    debit_ledger_id: { key: 'debit_ledger_id', label: '\u6263\u6b3e\u6d41\u6c34\u53f7' },
    round_id: { key: 'round_id', label: '\u573a\u6b21\u7f16\u53f7' },
    public_user_id: { key: 'public_user_id', label: 'UID' },
    user_name: { key: 'user_name', label: '\u7528\u6237\u8d26\u53f7' },
    ownership_type: { key: 'ownership_type', label: '\u5f52\u5c5e\u7c7b\u578b' },
    ownership_id: { key: 'ownership_id', label: '\u5f52\u5c5eID' },
    ownership_name: { key: 'ownership_name', label: '\u5f52\u5c5e\u540d\u79f0' },
    source_name: { key: 'source_name', label: '来源名称' },
    source_type: { key: 'source_type', label: '来源类型' },
    symbol: { key: 'symbol', label: '\u4ea4\u6613\u54c1\u79cd' },
    duration_seconds: { key: 'duration_seconds', label: '\u5468\u671f', kind: 'room' },
    direction: { key: 'direction', label: '\u9884\u6d4b\u65b9\u5411', kind: 'enum' },
    stake: { key: 'stake', label: '\u4e0b\u6ce8\u91d1\u989d(U)', kind: 'amount' },
    final_odds: { key: 'final_odds', label: '\u6700\u7ec8\u8d54\u7387' },
    estimated_return: {
        key: 'estimated_return',
        label: '\u9884\u8ba1\u8fd4\u8fd8(U)',
        kind: 'amount'
    },
    open_price: { key: 'open_price', label: '\u5f00\u76d8\u4ef7\u683c', kind: 'amount' },
    order_status: { key: 'order_status', label: '\u8ba2\u5355\u72b6\u6001' },
    created_at_ms: { key: 'created_at_ms', label: '\u4e0b\u5355\u65f6\u95f4', kind: 'time' },
    actual_direction: { key: 'actual_direction', label: '\u5b9e\u9645\u65b9\u5411', kind: 'enum' },
    result_price: { key: 'result_price', label: '\u7ed3\u7b97\u4ef7\u683c', kind: 'amount' },
    actual_return: { key: 'actual_return', label: '\u5b9e\u9645\u8fd4\u8fd8(U)', kind: 'amount' },
    realized_pnl: { key: 'realized_pnl', label: '\u8ba2\u5355\u76c8\u4e8f(U)', kind: 'amount' },
    funds_completed_at_ms: {
        key: 'funds_completed_at_ms',
        label: '\u7ed3\u7b97\u65f6\u95f4',
        kind: 'time'
    },
    settlement_ledger_id: { key: 'settlement_ledger_id', label: '\u7ed3\u7b97\u6d41\u6c34\u53f7' },
    fixed_odds: { key: 'fixed_odds', label: '\u56fa\u5b9a\u8d54\u7387', kind: 'amount' },
    expire_at_ms: { key: 'expire_at_ms', label: '\u5230\u671f\u65f6\u95f4', kind: 'time' },
    bet_open_at_ms: {
        key: 'bet_open_at_ms',
        label: '\u5f00\u59cb\u4e0b\u6ce8\u65f6\u95f4',
        kind: 'time'
    },
    bet_close_at_ms: {
        key: 'bet_close_at_ms',
        label: '\u505c\u6b62\u4e0b\u6ce8\u65f6\u95f4',
        kind: 'time'
    },
    draw_at_ms: { key: 'draw_at_ms', label: '\u5f00\u5956\u65f6\u95f4', kind: 'time' },
    start_price: { key: 'start_price', label: '\u5f00\u76d8\u4ef7\u683c', kind: 'amount' },
    end_price: { key: 'end_price', label: '\u7ed3\u7b97\u4ef7\u683c', kind: 'amount' },
    up_pool: { key: 'up_pool', label: '\u4e0a\u6da8\u4e0b\u6ce8\u91d1\u989d(U)', kind: 'amount' },
    down_pool: {
        key: 'down_pool',
        label: '\u4e0b\u8dcc\u4e0b\u6ce8\u91d1\u989d(U)',
        kind: 'amount'
    },
    draw_outcome: { key: 'draw_outcome', label: '\u5f00\u5956\u7ed3\u679c' },
    participant_count: { key: 'participant_count', label: '\u53c2\u4e0e\u4eba\u6570' },
    order_count: { key: 'order_count', label: '\u8ba2\u5355\u6570\u91cf' },
    total_stake: { key: 'total_stake', label: '\u603b\u4e0b\u6ce8\u91d1\u989d(U)', kind: 'amount' },
    total_return: {
        key: 'total_return',
        label: '\u603b\u8fd4\u8fd8\u91d1\u989d(U)',
        kind: 'amount'
    },
    round_pnl: { key: 'round_pnl', label: '\u573a\u6b21\u76c8\u4e8f(U)' },
    status: { key: 'status', label: '\u573a\u6b21\u72b6\u6001', kind: 'enum' },
    settled_at_ms: {
        key: 'settled_at_ms',
        label: '\u7ed3\u7b97\u5b8c\u6210\u65f6\u95f4',
        kind: 'time'
    }
}
const operationTables: Record<string, string[]> = {
    UP_DOWN_CURRENT: [
        'order_id',
        'round_id',
        'public_user_id',
        'user_name',
        'source_name',
        'source_type',
        'symbol',
        'duration_seconds',
        'direction',
        'stake',
        'final_odds',
        'estimated_return',
        'open_price',
        'order_status',
        'created_at_ms'
    ],
    UP_DOWN_HISTORY: [
        'order_id',
        'round_id',
        'public_user_id',
        'user_name',
        'source_name',
        'source_type',
        'symbol',
        'duration_seconds',
        'direction',
        'actual_direction',
        'stake',
        'final_odds',
        'open_price',
        'result_price',
        'order_status',
        'actual_return',
        'realized_pnl',
        'funds_completed_at_ms',
        'debit_ledger_id',
        'settlement_ledger_id'
    ],
    HIGH_LOW_CURRENT: [
        'order_id',
        'public_user_id',
        'user_name',
        'source_name',
        'source_type',
        'symbol',
        'duration_seconds',
        'direction',
        'open_price',
        'stake',
        'fixed_odds',
        'estimated_return',
        'created_at_ms',
        'order_status'
    ],
    HIGH_LOW_HISTORY: [
        'order_id',
        'public_user_id',
        'user_name',
        'source_name',
        'source_type',
        'symbol',
        'duration_seconds',
        'direction',
        'actual_direction',
        'open_price',
        'stake',
        'fixed_odds',
        'expire_at_ms',
        'result_price',
        'order_status',
        'actual_return',
        'realized_pnl',
        'funds_completed_at_ms',
        'debit_ledger_id',
        'settlement_ledger_id'
    ],
    UP_DOWN_ROUNDS: [
        'round_id',
        'symbol',
        'duration_seconds',
        'bet_open_at_ms',
        'bet_close_at_ms',
        'draw_at_ms',
        'start_price',
        'end_price',
        'up_pool',
        'down_pool',
        'draw_outcome',
        'participant_count',
        'order_count',
        'total_stake',
        'total_return',
        'round_pnl',
        'status',
        'settled_at_ms'
    ]
}
export function operationHistoryDetailFields(game: 'UP_DOWN' | 'HIGH_LOW'): Field[] {
    return operationTables[`${game}_HISTORY`].map(key => ({
        ...operationTableDefinitions[key],
        ...(key === 'user_name' ? { label: '用户名' } : {})
    }))
}

export function operationTableFields(game: string, view: string): Field[] {
    let keys = (
        operationTables[view === 'rounds' ? 'UP_DOWN_ROUNDS' : `${game}_${view.toUpperCase()}`] ??
        []
    )
    if (view === 'history') {
        keys = keys.filter(key => !['debit_ledger_id', 'settlement_ledger_id'].includes(key) &&
            (game !== 'UP_DOWN' || key !== 'round_id'))
        if (game === 'HIGH_LOW') {
            keys = [...keys.filter(key => !['expire_at_ms', 'funds_completed_at_ms'].includes(key)), 'expire_at_ms', 'funds_completed_at_ms']
        }
    }
    return keys.map((key) => operationTableDefinitions[key])
}
function tableMoney(value: string): string {
    if (!/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) return '—'
    const [integer, fraction = ''] = value.split('.')
    return integer + '.' + fraction.replace(/0+$/, '').padEnd(2, '0')
}
function tableOdds(value: unknown): string {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return '—'
    const { numerator, denominator } = value as Record<string, unknown>
    const decimal = (v: unknown): v is string =>
        typeof v === 'string' && v.length <= 128 && /^(0|[1-9]\d*)(\.\d+)?$/.test(v)
    if (!decimal(numerator) || !decimal(denominator)) return '—'
    const scale = (v: string) => v.split('.')[1]?.length ?? 0
    const a = BigInt(numerator.replace('.', '')) * 10n ** BigInt(scale(denominator))
    const b = BigInt(denominator.replace('.', '')) * 10n ** BigInt(scale(numerator))
    if (b === 0n) return '—'
    let remainder = a % b,
        fraction = ''
    for (let i = 0; remainder !== 0n && i < 4; i++) {
        remainder *= 10n
        fraction += String(remainder / b)
        remainder %= b
    }
    fraction = fraction.replace(/0+$/, '')
    return `${remainder === 0n ? '' : '≈'}${a / b}${fraction ? '.' + fraction : ''}x`
}
export function tableFieldText(row: Record<string, unknown>, field: Field, game: string): string {
    const key = field.key
    if (key === 'round_id' && typeof row.round_no === 'string' && /^[0-9]{14}[0-9A-Z]{9}$/.test(row.round_no)) return row.round_no
    if (key === 'order_no') return fieldText(row, field, game)
    if (key === 'order_id' && typeof row.order_no === 'string' &&
        new RegExp(`^${game === 'UP_DOWN' ? 'UD' : 'HL'}[0-9]{12}[A-Z0-9]{6}$`).test(row.order_no)) return row.order_no
    if (key === 'settlement_ledger_id') {
        const missing = missingSettlementLedgerText(row)
        if (missing) return missing
    }
    const identity = orderIdentityText(key, row)
    if (identity !== undefined) return identity
    // These prototype columns still have no authoritative admin projection.
    if (['draw_outcome', 'round_pnl'].includes(key)) return '—'
    if (key === 'order_status') { const summary = orderStatusSummary(row); return summary ? enumLabel(summary.value) : '—' }
    if (key === 'final_odds') return tableOdds(row.final_odds)
    const value = row[key]
    if (value === undefined || value === null || value === '') return '—'
    if (
        key === 'open_price' &&
        game === 'HIGH_LOW' &&
        ['PENDING', 'BUSINESS_STATUS_PENDING'].includes(String(row.business_status)) &&
        typeof value === 'string' &&
        /^0(\.0+)?$/.test(value)
    )
        return '—'
    if (key === 'fixed_odds') return tableOdds({ numerator: value, denominator: '1' })
    if (
        [
            'stake',
            'estimated_return',
            'actual_return',
            'realized_pnl',
            'up_pool',
            'down_pool',
            'total_stake',
            'total_return'
        ].includes(key)
    )
        return typeof value === 'string' ? tableMoney(value) : '—'
    return fieldText(row, field, game)
}
