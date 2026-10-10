import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { createMmLocaleContext, mmLocaleKey } from '../../../composables/use-locale'
import { MmQueryBar } from '../../query-bar'
import FuturesTradeReport from '../FuturesTradeReport.vue'
import { formatTradeReportDecimal } from '../formatters'
import type { FuturesTradeReportRow } from '../types'

const row: FuturesTradeReportRow = {
  id: 'day:2026-10-10:merchant:9007199254740993:', stat_date: '2026-10-10', source_id: '9007199254740993',
  source_type: 'merchant', source_code: 'MER1', source_name: 'Merchant 1', trading_user_count: 1,
  order_count: 2, order_amount: '9007199254740993.126', filled_order_count: 1, fill_count: 1,
  trade_amount: '10', cancel_order_count: 0, cancel_amount: '0', amount_fill_rate: '31.078', stat_status: 1,
}

describe('MmFuturesTradeReport', () => {
  it('uses precise decimals and hides platform-only columns for merchants', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesTradeReport, { props: { request } })
    await flushPromises()
    expect(wrapper.text()).toContain('9,007,199,254,740,993.13')
    expect(wrapper.text()).toContain('31.08%')
    expect(wrapper.text()).not.toContain('来源名称')
    expect(request.mock.calls[0][0]).not.toHaveProperty('source_type')
    wrapper.unmount()
  })
  it('switches periods and forwards source/date filters before pagination', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesTradeReport, { props: { request, showSources: true } })
    await flushPromises()
    const bar = wrapper.getComponent(MmQueryBar)
    bar.vm.$emit('update:modelValue', { ...bar.props('modelValue'), period: 'month', source_type: 'tenant', source_id: '1', symbol: 'btcUsdt', date_range: ['2026-10-01', '2026-10-10'] })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'month', source_type: 'tenant', source_id: '1', symbol: 'BTCUSDT', start_date: '2026-10-01', end_date: '2026-10-10', page_no: 1 }), expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(wrapper.text()).toContain('来源名称')
    wrapper.unmount()
  })
  it('updates English/Chinese copy and surfaces errors', async () => {
    const locale = ref<'en-US' | 'zh-CN'>('en-US')
    const request = vi.fn(async () => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesTradeReport, { props: { request }, global: { provide: { [mmLocaleKey as symbol]: createMmLocaleContext(locale) } } })
    await flushPromises()
    expect(wrapper.text()).toContain('Trading users')
    locale.value = 'zh-CN'
    await flushPromises()
    expect(wrapper.text()).toContain('成交用户')
    request.mockRejectedValueOnce(new Error('Report unavailable'))
    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    await flushPromises()
    expect(wrapper.text()).toContain('Report unavailable')
    wrapper.unmount()
  })
  it('rounds without float precision loss or negative zero', () => {
    expect(formatTradeReportDecimal('-0.001')).toBe('0.00')
    expect(formatTradeReportDecimal('999.995')).toBe('1,000.00')
    expect(formatTradeReportDecimal('9007199254740993', 0)).toBe('9,007,199,254,740,993')
  })
})
