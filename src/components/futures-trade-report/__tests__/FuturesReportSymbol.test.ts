import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import FuturesPnlReport from '../../futures-pnl-report/FuturesPnlReport.vue'
import type { FuturesPnlReportQuery, FuturesPnlReportRow } from '../../futures-pnl-report/types'
import FuturesFeeReport from '../../futures-fee-report/FuturesFeeReport.vue'
import type { FuturesFeeReportRow } from '../../futures-fee-report/types'
import FuturesFundingFeeReport from '../../futures-funding-fee-report/FuturesFundingFeeReport.vue'
import type { FuturesFundingFeeReportRow } from '../../futures-funding-fee-report/types'
import FuturesRiskReport from '../../futures-risk-report/FuturesRiskReport.vue'
import type { FuturesRiskReportRow } from '../../futures-risk-report/types'
import FuturesPositionReport from '../../futures-position-report/FuturesPositionReport.vue'
import type { FuturesPositionReportRow } from '../../futures-position-report/types'
import type { ProTableColumn } from '../../pro-table'
import { MmQueryBar } from '../../query-bar'

type ReportRow = FuturesPnlReportRow & FuturesFeeReportRow & FuturesFundingFeeReportRow & FuturesRiskReportRow & FuturesPositionReportRow
type Result = { rows: ReportRow[], total: number }
type ReportProps = {
  request: (query: FuturesPnlReportQuery, context: { signal: AbortSignal }) => Promise<Result>
  showSymbolWhenFiltered?: boolean
  showSources?: boolean
}

const row: ReportRow = {
  id: 'day:2026-10-13:platform:0:', stat_date: '2026-10-13', source_type: 'platform', source_id: '0',
  source_name: '6MM', stat_status: 1, trading_user_count: 2, profitable_user_count: 1, losing_user_count: 1,
  trade_amount: '100', profit_amount: '10', loss_amount: '2', net_pnl: '8', fee_user_count: 2, fee_count: 3,
  maker_trade_amount: '20', taker_trade_amount: '80', maker_handling_fee: '0.1', taker_handling_fee: '0.2', total_handling_fee: '0.3',
  funding_settlement_user_count: 2, funding_settlement_position_amount: '100', funding_settlement_count: 3,
  funding_fee_income: '2', funding_fee_expense: '1', funding_fee_net_income: '1', funding_fee_net_income_rate: '1',
  liquidation_user_count: 1, liquidation_count: 1, liquidation_position_amount: '100', liquidation_trade_amount: '90',
  liquidation_realized_pnl: '-10', liquidation_fee: '1', bankruptcy_count: 0, bankruptcy_loss: '0',
  uncollected_liquidation_fee: '0', uncollected_trading_fee: '0', position_user_count: 2,
  long_position_user_count: 1, short_position_user_count: 1, long_position_amount: '60', short_position_amount: '40',
  closing_position_amount: '100', occupied_margin: '10', unrealized_pnl: '2', average_leverage: '10',
}

const reports = [
  { name: 'Pnl', mountReport: (props: ReportProps) => mount(FuturesPnlReport, { props }) },
  { name: 'Fee', mountReport: (props: ReportProps) => mount(FuturesFeeReport, { props }) },
  { name: 'FundingFee', mountReport: (props: ReportProps) => mount(FuturesFundingFeeReport, { props }) },
  { name: 'Risk', mountReport: (props: ReportProps) => mount(FuturesRiskReport, { props }) },
  { name: 'Position', mountReport: (props: ReportProps) => mount(FuturesPositionReport, { props }) },
]

describe.each(reports)('MmFutures$nameReport contract column', ({ mountReport }) => {
  it('uses accepted response symbols, keeps draft inputs separate and hides after reset', async () => {
    const request = vi.fn(async (query: FuturesPnlReportQuery) => ({
      rows: [{ ...row, symbol: query.symbol === 'BNB' ? 'BNBUSDT' : query.symbol }], total: 1,
    }))
    const wrapper = mountReport({ request, showSources: true, showSymbolWhenFiltered: true })
    await flushPromises()
    const keys = () => (wrapper.getComponent({ name: 'MmProTable' }).props('columns') as ProTableColumn<ReportRow>[]).map(column => column.key)
    expect(keys()).not.toContain('symbol')
    const bar = wrapper.getComponent(MmQueryBar)

    await wrapper.get('[data-query-field="symbol"] input').setValue(' bnb ')
    expect(keys()).not.toContain('symbol')
    bar.vm.$emit('query', bar.props('modelValue'))
    await flushPromises()
    expect(keys().slice(0, 2)).toEqual(['stat_date', 'symbol'])
    const columns = wrapper.getComponent({ name: 'MmProTable' }).props('columns') as ProTableColumn<ReportRow>[]
    expect(columns.find(column => column.key === 'symbol')?.title).toBe('合约')
    expect(wrapper.get('.mm-table__body-table').text()).toContain('BNBUSDT')
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ symbol: 'BNB' }), expect.anything())

    await wrapper.get('[data-query-field="symbol"] input').setValue('ETHUSDT')
    await flushPromises()
    expect(wrapper.get('.mm-table__body-table').text()).toContain('BNBUSDT')
    expect(wrapper.get('.mm-table__body-table').text()).not.toContain('ETHUSDT')
    bar.vm.$emit('reset', { period: 'day', symbol: '', source_type: 'platform', source_id: '', date_range: null })
    await flushPromises()
    expect(keys()).not.toContain('symbol')
    wrapper.unmount()
  })

  it('preserves existing consumer columns unless opted in', async () => {
    const wrapper = mountReport({ request: async () => ({ rows: [{ ...row, symbol: 'BNBUSDT' }], total: 1 }) })
    await flushPromises()
    const columns = wrapper.getComponent({ name: 'MmProTable' }).props('columns') as ProTableColumn<ReportRow>[]
    expect(columns.map(column => column.key)).not.toContain('symbol')
    wrapper.unmount()
  })

  it('does not invent a contract from input when the response has no symbol', async () => {
    for (const symbol of [undefined, '', '   ']) {
      const wrapper = mountReport({
        request: async () => ({ rows: [{ ...row, symbol }], total: 1 }), showSymbolWhenFiltered: true,
      })
      await flushPromises()
      const bar = wrapper.getComponent(MmQueryBar)
      bar.vm.$emit('query', { ...bar.props('modelValue'), symbol: 'BNBUSDT' })
      await flushPromises()
      const columns = wrapper.getComponent({ name: 'MmProTable' }).props('columns') as ProTableColumn<ReportRow>[]
      expect(columns.map(column => column.key)).not.toContain('symbol')
      wrapper.unmount()
    }
  })

  it('ignores stale responses from aborted contract searches', async () => {
    let resolveOlder!: (result: Result) => void
    let olderSignal!: AbortSignal
    const request = vi.fn(async (query: FuturesPnlReportQuery, context: { signal: AbortSignal }) => {
      if (query.symbol === 'BNBUSDT') {
        olderSignal = context.signal
        return new Promise<Result>(resolve => { resolveOlder = resolve })
      }
      return { rows: [{ ...row, symbol: query.symbol }], total: 1 }
    })
    const wrapper = mountReport({ request, showSymbolWhenFiltered: true })
    await flushPromises()
    const bar = wrapper.getComponent(MmQueryBar)
    bar.vm.$emit('query', { ...bar.props('modelValue'), symbol: 'BNBUSDT' })
    await flushPromises()
    bar.vm.$emit('query', { ...bar.props('modelValue'), symbol: 'ETHUSDT' })
    await flushPromises()
    expect(olderSignal.aborted).toBe(true)
    resolveOlder({ rows: [{ ...row, symbol: 'BNBUSDT' }], total: 1 })
    await flushPromises()
    expect(wrapper.get('.mm-table__body-table').text()).toContain('ETHUSDT')
    expect(wrapper.get('.mm-table__body-table').text()).not.toContain('BNBUSDT')
    wrapper.unmount()
  })
})
