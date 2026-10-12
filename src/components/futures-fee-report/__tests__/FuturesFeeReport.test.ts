import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { createMmLocaleContext, mmLocaleKey } from '../../../composables/use-locale'
import { MmQueryBar } from '../../query-bar'
import FuturesFeeReport from '../FuturesFeeReport.vue'
import { formatTradeReportDecimal } from '../../futures-trade-report/formatters'
import type { FuturesFeeReportRow } from '../types'

const row: FuturesFeeReportRow = {
  id: 'day:2026-10-10:merchant:9007199254740993:', stat_date: '2026-10-10', source_id: '9007199254740993',
  source_type: 'merchant', source_code: 'MER1', source_name: 'Merchant 1', fee_user_count: 1, fee_count: 2,
  maker_trade_amount: '9007199254740993.126', taker_trade_amount: '20',
  maker_handling_fee: '0.1', taker_handling_fee: '0.2', total_handling_fee: '0.3', stat_status: 1,
}

describe('MmFuturesFeeReport', () => {
  it('keeps its layout class and query fields even when the report is empty', async () => {
    const wrapper = mount(FuturesFeeReport, {
      props: { request: async () => ({ rows: [], total: 0 }) },
      attrs: { class: 'consumer-report', 'data-testid': 'consumer-report' },
    })
    await flushPromises()
    expect(wrapper.classes()).toContain('mm-futures-fee-report')
    expect(wrapper.classes()).toContain('consumer-report')
    expect(wrapper.attributes('data-testid')).toBe('consumer-report')
    expect(wrapper.findAll('[data-query-field]').map(field => field.attributes('data-query-field')))
      .toEqual(['period', 'symbol', 'date_range'])
    wrapper.unmount()
  })
  it('uses precise decimals and hides platform-only columns for merchants', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesFeeReport, { props: { request } })
    await flushPromises()
    expect(wrapper.text()).toContain('9,007,199,254,740,993.13')
    expect(wrapper.text()).toContain('0.30')
    expect(wrapper.getComponent({ name: 'MmProTable' }).props('autoRefreshable')).toBe(false)
    expect(wrapper.text()).not.toContain('自动刷新')
    expect(wrapper.text()).not.toContain('来源名称')
    expect(request.mock.calls[0][0]).not.toHaveProperty('source_type')
    wrapper.unmount()
  })
  it('defaults to platform and switches source types with segmented buttons', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesFeeReport, { props: { request, showSources: true } })
    await flushPromises()
    const sourceField = wrapper.get('[data-query-field="source_type"]')
    expect(sourceField.classes()).toContain('mm-query-bar__field--segmented')
    expect(sourceField.findAll('button[role="radio"]').map(button => button.text())).toEqual(['平台', '白标', '商户'])
    expect(sourceField.get('button[aria-checked="true"]').text()).toBe('平台')
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform' }), expect.anything())
    await sourceField.findAll('button[role="radio"]')[1]!.trigger('click')
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'tenant' }), expect.anything())
    wrapper.unmount()
  })
  it('switches periods and forwards source/date filters before pagination', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesFeeReport, { props: { request, showSources: true } })
    await flushPromises()
    const bar = wrapper.getComponent(MmQueryBar)
    bar.vm.$emit('update:modelValue', { ...bar.props('modelValue'), period: 'month', source_type: 'tenant', source_id: '1', symbol: 'btcUsdt', date_range: ['2026-10-01', '2026-10-10'] })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'month', source_type: 'tenant', source_id: '1', symbol: 'BTCUSDT', start_date: '2026-10-01', end_date: '2026-10-10', page_no: 1 }), expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(wrapper.text()).toContain('来源名称')
    wrapper.unmount()
  })
  it('can remove source codes and search source names or IDs without changing the legacy defaults', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesFeeReport, { props: { request, showSources: true, showSourceCode: false, sourceSearch: 'name-or-id' } })
    await flushPromises()
    expect(wrapper.findAll('.mm-table__header-table th').map(cell => cell.text())).not.toContain('来源')
    expect(wrapper.findAll('.mm-table__header-table th').map(cell => cell.text())).toContain('来源名称')
    expect(wrapper.find('.mm-table__body-table').text()).not.toContain('MER1')
    expect(wrapper.get('[data-query-field="source_id"] input').attributes('placeholder')).toBe('来源名称 / ID')
    const bar = wrapper.getComponent(MmQueryBar)
    for (const text of [' Merchant ', '9007199254740993']) {
      bar.vm.$emit('update:modelValue', { ...bar.props('modelValue'), source_id: text })
      bar.vm.$emit('query', { ...bar.props('modelValue'), source_id: text })
      await flushPromises()
      expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_keyword: text.trim(), page_no: 1 }), expect.anything())
      expect(request.mock.calls.at(-1)?.[0]).not.toHaveProperty('source_id')
    }
    wrapper.unmount()
  })
  it('updates English/Chinese copy and surfaces errors', async () => {
    const locale = ref<'en-US' | 'zh-CN'>('en-US')
    const request = vi.fn(async () => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesFeeReport, { props: { request }, global: { provide: { [mmLocaleKey as symbol]: createMmLocaleContext(locale) } } })
    await flushPromises()
    expect(wrapper.text()).toContain('Charged users')
    locale.value = 'zh-CN'
    await flushPromises()
    expect(wrapper.text()).toContain('扣费用户')
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
