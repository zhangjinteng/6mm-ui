import { mount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { MmQueryBar } from '../../query-bar'
import PlatformTradeSummaryReport from '../PlatformTradeSummaryReport.vue'
import type { PlatformTradeSummaryRow } from '../types'

const row: PlatformTradeSummaryRow = { id: 'day:2026-10-12:platform:0', stat_date: '2026-10-12', source_type: 'platform', source_id: '0',
  source_code: '6MM', source_name: '6MM', total_trading_user_count: 2, trading_user_count: 1, contract_trade_count: 7,
  contract_trade_amount: '9007199254740993.123456789', prediction_trading_user_count: 2, prediction_valid_order_count: 4,
  prediction_valid_stake_amount: '25.01', stat_status: 2 }

describe('MmPlatformTradeSummaryReport', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-14T06:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it('keeps merchant filters scoped and disables automatic refresh without removing manual refresh', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(PlatformTradeSummaryReport, { props: { request } })
    await flushPromises()
    expect(wrapper.findAll('[data-query-field]').map(field => field.attributes('data-query-field'))).toEqual(['period', 'date_range'])
    expect(request.mock.calls[0][0]).not.toHaveProperty('source_type')
    expect(wrapper.find('.mm-pro-table__auto-refresh').exists()).toBe(false)
    expect(wrapper.text()).toContain('9,007,199,254,740,993.12')
    expect(wrapper.text()).toContain('已完成')
    expect(wrapper.text()).not.toContain('数据不完整')
    const calls = request.mock.calls.length
    await wrapper.get('button[aria-label="刷新"]').trigger('click')
    await flushPromises()
    expect(request.mock.calls.length).toBe(calls + 1)
    wrapper.unmount()
  })
  it('passes platform source-name/ID and month filters with an abort signal', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(PlatformTradeSummaryReport, { props: { request, showSources: true } })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform' }), expect.objectContaining({ signal: expect.any(AbortSignal) }))
    const bar = wrapper.getComponent(MmQueryBar)
    const filters = { ...bar.props('modelValue'), period: 'month', source_type: 'merchant', source_keyword: ' demo ', date_range: ['2026-10-01', '2026-10-14'] }
    bar.vm.$emit('update:modelValue', filters); bar.vm.$emit('query', filters)
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'month', source_type: 'merchant', source_keyword: 'demo', start_date: '2026-10-01', end_date: '2026-10-14' }), expect.anything())
    expect(wrapper.find('th[data-column-key="source_id"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it.each(['platform', 'tenant', 'merchant'] as const)('displays date-based day/month status for %s without changing source status', async (sourceType) => {
    const dailyRows = [
      { ...row, id: 'today', stat_date: '2026-10-14', source_type: sourceType, stat_status: 1 },
      { ...row, id: 'yesterday', stat_date: '2026-10-13', source_type: sourceType, stat_status: 0 },
      { ...row, id: 'partial', stat_date: '2026-10-12', source_type: sourceType, stat_status: 2 },
    ]
    const monthlyRows = [
      { ...row, id: 'current-month', stat_date: '2026-10', source_type: sourceType, stat_status: 2 },
      { ...row, id: 'previous-month', stat_date: '2026-09', source_type: sourceType, stat_status: 0 },
    ]
    const request = vi.fn(async (params: { period: string }) => {
      const rows = params.period === 'month' ? monthlyRows : dailyRows
      return { rows, total: rows.length }
    })
    const wrapper = mount(PlatformTradeSummaryReport, { props: { request, showSources: true } })
    await flushPromises()
    expect(wrapper.get('[data-row-key="today"] td:last-child .mm-tag--warning').text()).toBe('统计中')
    expect(wrapper.get('[data-row-key="yesterday"] td:last-child .mm-tag--success').text()).toBe('已完成')
    expect(wrapper.get('[data-row-key="partial"] td:last-child .mm-tag--success').text()).toBe('已完成')
    const bar = wrapper.getComponent(MmQueryBar)
    const filters = { ...bar.props('modelValue'), period: 'month', source_type: sourceType }
    bar.vm.$emit('update:modelValue', filters)
    bar.vm.$emit('query', filters)
    await flushPromises()
    expect(wrapper.get('[data-row-key="current-month"] td:last-child .mm-tag--warning').text()).toBe('统计中')
    expect(wrapper.get('[data-row-key="previous-month"] td:last-child .mm-tag--success').text()).toBe('已完成')
    expect(wrapper.text()).not.toContain('数据不完整')
    expect(dailyRows.map(value => value.stat_status)).toEqual([1, 0, 2])
    expect(monthlyRows.map(value => value.stat_status)).toEqual([2, 0])
    wrapper.unmount()
  })
})
