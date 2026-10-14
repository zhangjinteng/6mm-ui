import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MmQueryBar } from '../../query-bar'
import AssetBalanceReport from '../AssetBalanceReport.vue'
import type { AssetBalanceReportRow } from '../types'

const row: AssetBalanceReportRow = { id: '1', stat_date: '2026-10-13', account_type: 'funding', currency: 'USDT',
  source_type: 'merchant', source_id: '1', source_name: 'demo', funded_user_count: 7,
  opening_total: '9007199254740993.123456789', closing_total: null, period_net_change: null,
  closing_available: '0', closing_occupied: '0.004', stat_status: 'processing' }

describe('MmAssetBalanceReport', () => {
  beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-10-14T06:00:00Z')) })
  afterEach(() => vi.useRealTimers())

  it('preserves unknown balances, exact decimals, account type and manual refresh for merchants', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1, currencies: ['BTC', 'USDT'] }))
    const wrapper = mount(AssetBalanceReport, { props: { request } })
    await flushPromises()
    expect(wrapper.findAll('[data-query-field]').map(field => field.attributes('data-query-field'))).toEqual(['period', 'currency', 'date_range'])
    expect(request.mock.calls[0][0]).not.toHaveProperty('source_type')
    expect(wrapper.text()).toContain('资金账户')
    expect(wrapper.text()).toContain('9,007,199,254,740,993.12')
    const cells = wrapper.get('[data-row-key="1"]').findAll('td')
    expect(cells[5]!.text()).toBe('-')
    expect(cells[6]!.text()).toBe('-')
    expect(cells[7]!.text()).toBe('0.00')
    expect(cells.at(-1)!.text()).toBe('已完成')
    expect(wrapper.find('.mm-pro-table__auto-refresh').exists()).toBe(false)
    const calls = request.mock.calls.length
    await wrapper.get('button[aria-label="刷新"]').trigger('click'); await flushPromises()
    expect(request.mock.calls.length).toBe(calls + 1)
    wrapper.unmount()
  })

  it('passes platform month/source/currency filters and shows date-based processing status', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [{ ...row, stat_date: '2026-10', account_type: 'contract' as const, stat_status: 'completed' }], total: 1, currencies: ['BTC', 'USDT'] }))
    const wrapper = mount(AssetBalanceReport, { props: { request, showSources: true } })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform' }), expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(wrapper.text()).toContain('合约账户')
    expect(wrapper.get('[data-row-key="1"] td:last-child').text()).toBe('统计中')
    const bar = wrapper.getComponent(MmQueryBar)
    const filters = { ...bar.props('modelValue'), period: 'month', currency: ' btc ', source_type: 'tenant', source_keyword: ' white ', date_range: ['2026-10-01', '2026-10-14'] }
    bar.vm.$emit('update:modelValue', filters); bar.vm.$emit('query', filters); await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'month', currency: 'BTC', source_type: 'tenant', source_keyword: 'white' }), expect.anything())
    expect((bar.props('fields') ?? []).find(field => field.key === 'currency')).toMatchObject({
      options: [{ value: '' }, { value: 'BTC' }, { value: 'USDT' }],
    })
    wrapper.unmount()
  })

  it('shows a historical row as completed regardless of backend completeness', async () => {
    const request = vi.fn(async () => ({ rows: [{ ...row, stat_status: 2 }], total: 1 }))
    const wrapper = mount(AssetBalanceReport, { props: { request, showSources: true } })
    await flushPromises()
    expect(wrapper.get('[data-row-key="1"] td:last-child').text()).toBe('已完成')
    expect(wrapper.text()).not.toContain('数据不完整')
    wrapper.unmount()
  })
})
