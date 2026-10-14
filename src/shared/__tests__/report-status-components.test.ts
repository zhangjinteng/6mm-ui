import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import UserDailyReport from '../../components/user-daily-report/UserDailyReport.vue'
import PlatformTradeSummaryReport from '../../components/platform-trade-summary-report/PlatformTradeSummaryReport.vue'
import PlatformPnlReport from '../../components/platform-pnl-report/PlatformPnlReport.vue'
import FuturesTradeReport from '../../components/futures-trade-report/FuturesTradeReport.vue'
import FuturesPnlReport from '../../components/futures-pnl-report/FuturesPnlReport.vue'
import FuturesUserNetPnlReport from '../../components/futures-user-net-pnl-report/FuturesUserNetPnlReport.vue'
import FuturesFeeReport from '../../components/futures-fee-report/FuturesFeeReport.vue'
import FuturesFundingFeeReport from '../../components/futures-funding-fee-report/FuturesFundingFeeReport.vue'
import FuturesRiskReport from '../../components/futures-risk-report/FuturesRiskReport.vue'
import FuturesPositionReport from '../../components/futures-position-report/FuturesPositionReport.vue'
import PredictionUserPnlReport from '../../components/prediction-user-pnl-report/PredictionUserPnlReport.vue'
import AssetBalanceReport from '../../components/asset-balance-report/AssetBalanceReport.vue'

const reports: [string, Component][] = [
  ['用户报表', UserDailyReport], ['交易汇总', PlatformTradeSummaryReport], ['商户盈亏', PlatformPnlReport],
  ['合约交易', FuturesTradeReport], ['合约盈亏', FuturesPnlReport], ['用户净盈亏', FuturesUserNetPnlReport],
  ['手续费报表', FuturesFeeReport], ['资金费报表', FuturesFundingFeeReport], ['强平报表', FuturesRiskReport],
  ['持仓报表', FuturesPositionReport], ['预测报表', PredictionUserPnlReport], ['资产报表', AssetBalanceReport],
]

describe.each([false, true])('report status (source selectors: %s)', (showSources) => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-14T06:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it.each(reports)('%s uses dates rather than the backend status', async (_name, report) => {
    const cases = [
      ['2026-10-14', 1, '统计中', 'warning'],
      ['2026-10-14', 'completed', '统计中', 'warning'],
      ['2026-10-13', 0, '已完成', 'success'],
      ['2026-10-12', 2, '已完成', 'success'],
      ['2026-10-11', 'failed', '已完成', 'success'],
      ['2026-10', 2, '统计中', 'warning'],
      ['2026-09', 0, '已完成', 'success'],
      ['2026-10-15', 0, '已完成', 'success'],
      ['2026-11', 2, '已完成', 'success'],
      ['2026-10-14', undefined, '统计中', 'warning'],
      ['2026-10-13', undefined, '已完成', 'success'],
    ] as const
    const rows = cases.map(([stat_date, stat_status], index) => ({
      id: `case-${index}`, stat_date, stat_status, source_type: 'merchant', source_id: '1',
      source_code: 'demo', source_name: 'demo', play_type: 'all', symbol: '',
    }))
    const originalStatuses = rows.map(row => row.stat_status)
    const wrapper = mount(report, { props: {
      request: async () => ({ rows, total: rows.length }), showSources, autoRefreshable: false,
    } })
    await flushPromises()
    cases.forEach(([, , label, color], index) => {
      const tag = wrapper.find(`[data-row-key="case-${index}"] td:last-child .mm-tag`)
      expect(tag.exists()).toBe(true)
      expect(tag.classes()).toContain(`mm-tag--${color}`)
      expect(tag.text()).toBe(label)
    })
    expect(wrapper.text()).not.toContain('数据不完整')
    expect(rows.map(row => row.stat_status)).toEqual(originalStatuses)
    wrapper.unmount()
  })
})
