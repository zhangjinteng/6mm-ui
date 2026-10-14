import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { MmQueryBar } from '../../query-bar'
import FuturesPnlReport from '../FuturesPnlReport.vue'
import type { FuturesPnlReportRow } from '../types'

const row: FuturesPnlReportRow = {
  id: 'day:2026-10-10:platform:0:', stat_date: '2026-10-10', source_type: 'platform',
  source_id: '0', source_code: '6MM', source_name: '6MM', trading_user_count: 2,
  profitable_user_count: 1, losing_user_count: 1, trade_amount: '9007199254740993.126',
  profit_amount: '9.999', loss_amount: '0.004', net_pnl: '9.995', stat_status: 0,
}

describe('MmFuturesPnlReport', () => {
  it('keeps the full-width shell and filters when there are no results', async () => {
    const wrapper = mount(FuturesPnlReport, { props: { request: async () => ({ rows: [], total: 0 }) } })
    await flushPromises()
    expect(wrapper.classes()).toContain('mm-futures-pnl-report')
    expect(wrapper.findAll('[data-query-field]').map(field => field.attributes('data-query-field')))
      .toEqual(['period', 'symbol', 'date_range'])
    wrapper.unmount()
  })

  it('shows source filters and reports user net PnL without float precision loss', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesPnlReport, { props: { request, showSources: true, showSourceCode: false, sourceSearch: 'name-or-id' } })
    await flushPromises()
    expect(wrapper.text()).toContain('9,007,199,254,740,993.13')
    expect(wrapper.find('.mm-futures-pnl-report__positive').exists()).toBe(true)
    expect(wrapper.text()).toContain('+10.00')
    expect(wrapper.text()).toContain('已完成')
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform', period: 'day' }), expect.anything())
    const sourceField = wrapper.get('[data-query-field="source_type"]')
    expect(sourceField.findAll('button[role="radio"]').map(button => button.text())).toEqual(['平台', '白标', '商户'])
    await sourceField.findAll('button[role="radio"]')[2]!.trigger('click')
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'merchant' }), expect.anything())
    const bar = wrapper.getComponent(MmQueryBar)
    bar.vm.$emit('update:modelValue', { ...bar.props('modelValue'), period: 'month', symbol: 'btc', source_id: ' Demo ', date_range: ['2026-10-01', '2026-10-10'] })
    bar.vm.$emit('query', { ...bar.props('modelValue'), period: 'month', symbol: 'btc', source_id: ' Demo ', date_range: ['2026-10-01', '2026-10-10'] })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'month', symbol: 'BTC', source_keyword: 'Demo', start_date: '2026-10-01', end_date: '2026-10-10' }), expect.anything())
    wrapper.unmount()
  })
})
