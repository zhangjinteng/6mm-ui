import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { MmQueryBar } from '../../query-bar'
import FuturesUserNetPnlReport from '../FuturesUserNetPnlReport.vue'
import type { FuturesUserNetPnlReportRow } from '../types'

const row: FuturesUserNetPnlReportRow = {
  id: 'day:2026-10-10:platform:0', stat_date: '2026-10-10', source_type: 'platform', source_id: '0', source_name: 'Platform',
  settled_user_count: 2, profitable_user_count: 1, losing_user_count: 1, breakeven_user_count: 0,
  close_order_count: 3, close_amount: '9007199254740993.126', realized_pnl: '12.345', trading_fee: '2',
  funding_fee: '0', liquidation_fee: '0', true_net_pnl: '-0.001', stat_status: 1,
}

describe('MmFuturesUserNetPnlReport', () => {
  it('preserves legacy Agent filters while formatting large and signed amounts', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesUserNetPnlReport, { props: { request } })
    await flushPromises()
    expect(wrapper.findAll('[data-query-field]').map(field => field.attributes('data-query-field'))).toEqual(['period', 'date_range'])
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('source_type')
    expect(wrapper.text()).toContain('9,007,199,254,740,993.13')
    expect(wrapper.text()).toContain('+12.35')
    expect(wrapper.text()).not.toContain('-0.00')
    wrapper.unmount()
  })

  it('defaults Platform to platform scope and switches to white label/monthly', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesUserNetPnlReport, { props: { request, showSources: true } })
    await flushPromises()
    const source = wrapper.get('[data-query-field="source_type"]')
    expect(source.findAll('button[role="radio"]').map(button => button.text())).toEqual(['平台', '白标', '商户'])
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform', period: 'day' }), expect.anything())
    await source.findAll('button[role="radio"]')[1]!.trigger('click')
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'tenant' }), expect.anything())
    const bar = wrapper.getComponent(MmQueryBar)
    bar.vm.$emit('update:modelValue', { ...bar.props('modelValue'), period: 'month', source_keyword: 'Tenant A', date_range: ['2026-10-01', '2026-10-10'] })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'month', source_keyword: 'Tenant A', start_date: '2026-10-01', end_date: '2026-10-10' }), expect.anything())
    wrapper.unmount()
  })
})
