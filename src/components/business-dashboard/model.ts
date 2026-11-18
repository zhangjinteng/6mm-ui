import type { IconName } from '../icon'
import { formatTradeReportDecimal } from '../futures-trade-report/formatters'

export type DashboardPeriod = 'today' | 'yesterday' | '7' | '30' | 'month' | 'last-month'
export interface DashboardPayload {
  scope: 'platform' | 'tenant' | 'merchant'
  range: { start: string; end: string }
  currency: string
  blocks: Record<string, { state: 'ready' | 'error'; data: any }>
  merchant_users?: any
}
export interface DashboardCard { key: string; label: string; value: unknown; unit?: string; icon: IconName; detail?: string }
export interface DashboardPanel {
  key: string; title: string; subtitle?: string; kind: 'line' | 'bar' | 'donut' | 'rank' | 'list'
  series?: { name: string; values: (number | null)[] }[]
  labels?: string[]; items?: { name: string; value: unknown; detail?: string; display?: string }[]
  unit?: string; note?: string
}
export const dashboardPeriods = [
  { label: '今日', value: 'today' }, { label: '昨日', value: 'yesterday' },
  { label: '近7日', value: '7' }, { label: '近30日', value: '30' },
  { label: '本月', value: 'month' }, { label: '上月', value: 'last-month' },
]
export const dashboardPalette = ['#2563eb', '#10a477', '#8b5cf6', '#d07912', '#0891b2', '#e34d59']
export function dashboardNumber(value: unknown, unit = ''): string {
  if ((typeof value !== 'string' && typeof value !== 'number') || value === '' || !Number.isFinite(Number(value))) return '—'
  const formatted = formatTradeReportDecimal(value, unit === 'USDT' || unit === '%' ? 2 : 0)
  if (formatted === '-') return '—'
  return unit === '%' ? formatted.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1') : formatted
}
const n = (v: unknown): number | null => v === null || v === undefined || v === '' ? null : Number.isFinite(Number(v)) ? Number(v) : null
function dates(range: DashboardPayload['range']): string[] {
  const result: string[] = []
  for (let t = Date.parse(`${range.start}T00:00:00Z`); t <= Date.parse(`${range.end}T00:00:00Z`); t += 86400000) result.push(new Date(t).toISOString().slice(0, 10))
  return result
}
export function dashboardView(payload: DashboardPayload, view: string) {
  const block = (key: string) => payload.blocks[key]?.state === 'ready' ? payload.blocks[key].data : null
  const u = block('users'), t = block('trade'), p = block('prediction'), a = block('assets'), pos = block('positions')?.snapshot
  const partner = block('partners'), merchant = block('merchant'), users = payload.merchant_users, runtime = block('prediction_runtime')
  const cards: DashboardCard[] = [], panels: DashboardPanel[] = []
  const card = (key: string, label: string, value: unknown, unit = '', icon: IconName = 'chart-no-axes-combined', detail = '') => cards.push({ key, label, value, unit, icon, detail })
  const labels = dates(payload.range)
  const trend = (key: string, title: string, rows: any[] | undefined, fields: [string, string][], unit = 'USDT', note = '') => {
    const map = new Map((rows ?? []).map(r => [r.date, r]))
    panels.push({ key, title, kind: 'line', labels: labels.map(d => d.slice(5)), unit, note,
      series: fields.map(([field, name]) => ({ name, values: labels.map(d => n(map.get(d)?.[field])) })) })
  }
  const rank = (key: string, title: string, items: any[] | undefined, unit = 'USDT', note = '') => panels.push({ key, title, kind: 'rank', items: items ?? [], unit, note })
  const donut = (key: string, title: string, items: any[], unit = 'USDT', note = '') => panels.push({ key, title, kind: 'donut', items, unit, note })
  const tradeCards = () => {
    card('trade', '合约成交额', t?.totals?.trade_amount, 'USDT', 'chart-no-axes-combined')
    card('trade-users', '合约交易用户', t?.totals?.trading_user_count, '人', 'users', '周期去重')
    card('orders', '合约订单数', t?.totals?.order_count, '笔', 'clipboard-list')
    card('fills', '合约成交笔数', t?.totals?.fill_count, '笔', 'arrow-left-right')
  }
  const predictionCards = () => {
    card('stake', '已结算下注', p?.totals?.stake_amount, 'USDT', 'circle-dollar-sign')
    card('returned', '已结算返还', p?.totals?.return_amount, 'USDT', 'undo-2')
    card('prediction-orders', '已结算订单', p?.totals?.order_count, '笔', 'clipboard-list')
    card('prediction-pnl', '预测订单盈亏', p?.totals?.platform_pnl, 'USDT', 'chart-no-axes-combined', '下注减返还')
  }
  const tradePanels = () => {
    trend('trade-trend', '合约成交趋势', t?.daily, [['value', '成交额']], 'USDT', coverageNote(t?.coverage))
    rank('symbols', '热门合约', t?.symbols)
    donut('position', '持仓方向', [{ name: '多仓', value: pos?.long_position_amount }, { name: '空仓', value: pos?.short_position_amount }], 'USDT', pos?.snapshot_at ? `快照：${pos.snapshot_at}` : '暂无持仓快照')
  }
  const predictionPanels = () => {
    trend('prediction-trend', '下注与返还趋势', p?.daily, [['stake', '已结算下注'], ['returned', '已结算返还']], 'USDT', coverageNote(p?.coverage))
    donut('plays', '玩法下注构成', (p?.plays ?? []).map((r: any) => ({ ...r, name: ({ high_low: '自选预测', up_down: '涨跌预测', grid: '预测网格' } as any)[r.name] ?? r.name })))
    rank('prediction-symbols', '币种下注贡献', p?.symbols)
    donut('results', '已结算订单结果', [{ name: '已中奖', value: p?.totals?.win_order_count }, { name: '未中奖', value: p?.totals?.lose_order_count }, { name: '已退款', value: p?.totals?.refund_order_count }], '笔')
    if (payload.blocks.prediction_runtime) {
      const plays: Record<string, string> = { high_low: '自选预测', up_down: '涨跌预测', grid: '预测网格' }
      panels.push({ key: 'pending', title: '当前待开奖订单', kind: 'list', unit: '笔', note: runtime ? `查询：${runtime.as_of} · 已受理、未终结口径` : '当前订单查询暂不可用',
        items: Object.entries(plays).map(([play, name]) => {
          const row = runtime?.pending?.find((r: any) => r.play === play)
          return { name, value: runtime ? row?.count ?? 0 : null, detail: runtime ? `${dashboardNumber(row?.amount ?? '0', 'USDT')} USDT` : undefined }
        }) })
      panels.push({ key: 'current-orders', title: '当前预测订单', kind: 'list', unit: 'USDT', note: '当前未终结订单，最新8笔；独立于日报周期',
        items: runtime?.orders?.map((r: any) => ({ name: `${r.symbol} · ${plays[r.play] ?? r.play}`, value: r.amount,
          detail: `${r.id} · ${runtimeState(r.state)} · ${r.created_at}` })) ?? [] })
      panels.push({ key: 'current-rounds', title: payload.scope === 'tenant' ? '本站路由当前场次' : '当前预测场次', kind: 'list',
        note: runtime ? `查询：${runtime.as_of} · 最新8场，非场次总数` : '当前场次查询暂不可用',
        items: runtime?.rounds?.map((r: any) => ({ name: r.symbol, value: null, display: runtimeState(r.state), detail: `${r.id} · 封盘：${r.closes_at}` })) ?? [] })
    }
  }
  if (payload.scope === 'merchant' && view === 'users') {
    for (const [key, label, icon] of [['new_users', '新增映射用户', 'user-plus'], ['current_online', '当前在线', 'activity'], ['active_users', '活跃用户', 'users'], ['trading_users', '合约交易用户', 'chart-no-axes-combined']]) {
      card(key!, label!, key === 'current_online' && !users?.snapshot_at ? null : users?.kpis?.[key!]?.value, '人', icon as IconName, key === 'current_online' ? (users?.snapshot_at ? `快照：${users.snapshot_at} UTC` : '暂无在线快照') : users?.kpis?.[key!]?.change_rate == null ? coverageNote(users?.coverage) : `较上期 ${Number(users.kpis[key!].change_rate).toFixed(1)}%`)
    }
    const rows = users?.trend ?? []
    panels.push({ key: 'user-growth', title: '新增用户趋势', kind: 'line', labels: rows.map((r: any) => r.hour === undefined ? r.date.slice(5) : `${r.hour}:00`), unit: '人', note: coverageNote(users?.coverage),
      series: [['new_users', '新增用户'], ['first_deposit', '首次入金'], ['first_trade', '首次交易']].map(([key, name]) => ({ name: name!, values: rows.map((r: any) => n(r[key!])) })) })
    donut('online', '当前在线状态', [['trading', '交易中'], ['holding', '持仓中'], ['only_online', '仅在线']].map(([key, name]) => ({ name: name!, value: users?.snapshot_at ? users?.online_status?.[key!] : null })), '人', users?.snapshot_at ? `快照：${users.snapshot_at} UTC` : '暂无在线快照')
    rank('regions', '新增用户首次地区', (users?.regions ?? []).map((r: any) => ({ name: r.country_name, value: r.value })), '人')
    rank('retention', '用户留存', (users?.retention ?? []).map((r: any) => ({ name: r.label, value: r.is_matured ? r.rate : null, detail: r.is_matured ? `${r.retained_count} / ${r.cohort_count}` : '待观察' })), '%')
    panels.push({ key: 'attention', title: '需要关注的用户', kind: 'list', unit: '人', items: [
      { name: '映射失败', value: users?.attention?.mapping_failed }, { name: '入金24小时未交易', value: users?.attention?.deposit_not_traded_24h }, { name: '活跃频次下降', value: users?.attention?.activity_declined },
    ] })
  } else if (payload.scope === 'merchant' && view === 'funds') {
    card('margin', '总保证金', merchant?.balance, 'USDT', 'wallet')
    card('available-rate', '可用率', merchant?.available_rate, '%', 'percent')
    card('net', '周期账变净额', merchant?.net, 'USDT', 'arrow-left-right')
    card('commission', '已入账合约返佣', merchant?.commission, 'USDT', 'receipt-text')
    panels.push({ key: 'margin-state', title: '保证金状态', kind: 'list', unit: 'USDT', items: [
      { name: '可用保证金', value: merchant?.available }, { name: '用户已分配保证金', value: merchant?.used }, { name: '合约返佣入账', value: merchant?.commission },
    ] })
    panels.push({ key: 'transfer-state', title: '划转待处理与异常', kind: 'list', unit: '笔', items: (merchant?.transfers ?? []).map((r: any) => ({ name: statusLabel(r.status), value: r.value })) })
  } else if (view === 'prediction') {
    predictionCards(); predictionPanels()
  } else if (view === 'contracts') {
    tradeCards(); card('fees', '用户合约手续费', t?.fees, 'USDT', 'receipt-text', coverageNote(t?.fee_coverage)); card('positions', '持仓价值（快照）', pos?.closing_position_amount, 'USDT', 'layers-3', pos?.snapshot_at ?? '暂无持仓快照'); tradePanels()
  } else if (view === 'assets') {
    for (const [key, label, value] of [['funding', '资金账户账面余额', a?.balances?.funding?.total], ['contract', '合约账户账面余额', a?.balances?.contract?.total], ['occupied', '资金账户冻结', a?.balances?.funding?.occupied], ['contract-occupied', '合约账户占用', a?.balances?.contract?.occupied]]) card(String(key), String(label), value, 'USDT', 'wallet')
    trend('funding-flow', '资金流入流出', a?.daily, [['deposit', '资金账本入账'], ['withdraw', '资金账本出账']], 'USDT', coverageNote(a?.coverage))
    trend('asset-trend', '账户余额趋势', a?.daily, [['funding', '资金账户'], ['contract', '合约账户']], 'USDT')
  } else if (view === 'partners') {
    card('merchants', '主商户', partner?.merchants, '个', 'users'); card('tenants', '白标', partner?.tenants, '个', 'building-2')
    rank('partner-ranks', '合作方合约成交贡献', partner?.ranks)
    panels.push({ key: 'callbacks', title: '商户回调任务状态', kind: 'list', unit: '笔', items: (partner?.callbacks ?? []).map((r: any) => ({ name: statusLabel(r.status), value: r.value })) })
  } else {
    card('users', '总用户数', u?.total, '人', 'users'); card('new', '本期新增用户', u?.new, '人', 'user-plus')
    tradeCards(); card('fees', '用户合约手续费', t?.fees, 'USDT', 'receipt-text'); predictionCards()
    card('funding', '资金账户账面余额', a?.balances?.funding?.total, 'USDT', 'wallet')
    tradePanels()
    const newMap = new Map((u?.daily ?? []).map((r: any) => [r.date, r.value]))
    trend('registered', '新增注册用户趋势', u ? labels.map(date => ({ date, value: newMap.get(date) ?? 0 })) : [], [['value', '新增用户']], '人')
    trend('funding-flow', '资金流入流出', a?.daily, [['deposit', '资金账本入账'], ['withdraw', '资金账本出账']], 'USDT', coverageNote(a?.coverage))
    donut('assets', '账户账面余额结构', [{ name: '资金账户', value: a?.balances?.funding?.total }, { name: '合约账户', value: a?.balances?.contract?.total }], 'USDT', a?.as_of ? `快照：${a.as_of}` : '暂无期末快照')
    predictionPanels()
  }
  for (const item of cards) {
    if (['trade', 'trade-users', 'orders', 'fills'].includes(item.key)) item.detail = [item.detail, coverageNote(t?.coverage)].filter(Boolean).join(' · ')
    if (['stake', 'returned', 'prediction-orders', 'prediction-pnl'].includes(item.key)) item.detail = [item.detail, coverageNote(p?.coverage)].filter(Boolean).join(' · ')
    if (item.key === 'fees') item.detail = `${coverageNote(t?.fee_coverage)} · 用户扣费，非净收入`
  }
  return { cards, panels }
}
export function coverageNote(coverage: any): string {
  if (!coverage) return '暂无统计发布'
  const missing = coverage.missing_dates?.length ?? 0
  return missing ? `缺少 ${missing} 天统计，缺失日期未补零` : coverage.incomplete ? '部分来源数据不完整' : '已发布统计'
}
export function statusLabel(status: string): string {
  return ({ pending: '待处理', processing: '处理中', retry: '等待重试', failed: '失败', success: '成功', sent: '已送达', completed: '已完成', unknown: '结果待确认' } as Record<string, string>)[status.toLowerCase()] ?? status
}
function runtimeState(state: string): string {
  const labels: Record<string, string> = { PREPARING: '准备中', BETTING: '下注中', LOCKED: '已封盘', OBSERVING: '观察中', RESULTING: '开奖中', SETTLING: '结算中', ACTIVE: '进行中', DEBITED: '已扣款', PENDING: '待处理', DEBIT_PENDING: '扣款处理中', GRID_2: '已受理', GRID_3: '运行中', GRID_4: '结算中' }
  return state.split(' / ').map(part => labels[part] ?? part).join(' / ')
}
export function dashboardChart(panel: DashboardPanel): Record<string, any> {
  const base = { animationDuration: 250, color: dashboardPalette, tooltip: { trigger: panel.kind === 'donut' ? 'item' : 'axis' }, textStyle: { fontFamily: 'inherit', fontSize: 11 } }
  if (panel.kind === 'donut') return { ...base, legend: { bottom: 0, icon: 'circle' }, series: [{ type: 'pie', radius: ['48%', '72%'], center: ['50%', '43%'], label: { show: false }, data: (panel.items ?? []).filter(r => n(r.value) !== null).map(r => ({ name: r.name, value: n(r.value) })) }] }
  return { ...base, grid: { top: 18, bottom: 35, left: 62, right: 20 }, legend: { bottom: 0, icon: 'circle' },
    xAxis: { type: 'category', boundaryGap: false, data: panel.labels ?? [], axisLine: { lineStyle: { color: '#cdd5df' } }, axisTick: { show: false } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#e9edf2' } } },
    series: (panel.series ?? []).map(r => ({ type: 'line', name: r.name, data: r.values, connectNulls: false, smooth: false, symbolSize: 5, lineStyle: { width: 2 } })) }
}
