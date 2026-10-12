import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { MmQueryBar } from '../../query-bar'
import FuturesPositionReport from '../FuturesPositionReport.vue'
import type { FuturesPositionReportRow } from '../types'

const row: FuturesPositionReportRow = {
  id: 'day:2026-10-10:platform:0:', stat_date: '2026-10-10', source_type: 'platform', source_id: '0',
  source_name: '6MM', position_user_count: 2, long_position_user_count: 1, short_position_user_count: 1,
  long_position_amount: '100', short_position_amount: '50', closing_position_amount: '150',
  occupied_margin: '10', unrealized_pnl: '-1.256', average_leverage: '15', stat_status: 1,
}

describe('MmFuturesPositionReport', () => {
  it('keeps merchant filters scoped and displays position metrics', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesPositionReport, { props: { request } })
    await flushPromises()
    expect(wrapper.findAll('[data-query-field]').map(field => field.attributes('data-query-field')))
      .toEqual(['period', 'symbol', 'date_range'])
    expect(request.mock.calls[0][0]).not.toHaveProperty('source_type')
    expect(wrapper.text()).toContain('持仓用户')
    expect(wrapper.text()).toContain('15.00x')
    expect(wrapper.text()).toContain('-1.26')
    wrapper.unmount()
  })

  it('passes source and date filters for the platform view', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesPositionReport, { props: { request, showSources: true, showSourceCode: false, sourceSearch: 'name-or-id' } })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform' }), expect.anything())
    const bar = wrapper.getComponent(MmQueryBar)
    const value = { ...bar.props('modelValue'), period: 'month', source_type: 'tenant', source_id: ' White label ', symbol: 'btc', date_range: ['2026-10-01', '2026-10-10'] }
    bar.vm.$emit('update:modelValue', value)
    bar.vm.$emit('query', value)
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({
      period: 'month', source_type: 'tenant', source_keyword: 'White label', symbol: 'BTC',
      start_date: '2026-10-01', end_date: '2026-10-10',
    }), expect.anything())
    wrapper.unmount()
  })
})
