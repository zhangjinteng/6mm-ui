import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { createMmLocaleContext, mmLocaleKey } from '../../../composables/use-locale'
import { MmQueryBar } from '../../query-bar'
import type { ProTableColumn } from '../../pro-table'
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
  it('keeps its layout class and query fields even when the report is empty', async () => {
    const wrapper = mount(FuturesTradeReport, {
      props: { request: async () => ({ rows: [], total: 0 }) },
      attrs: { class: 'consumer-report', 'data-testid': 'consumer-report' },
    })
    await flushPromises()
    expect(wrapper.classes()).toContain('mm-futures-trade-report')
    expect(wrapper.classes()).toContain('consumer-report')
    expect(wrapper.attributes('data-testid')).toBe('consumer-report')
    expect(wrapper.findAll('[data-query-field]').map(field => field.attributes('data-query-field')))
      .toEqual(['period', 'symbol', 'date_range'])
    wrapper.unmount()
  })
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
  it('defaults to platform and switches source types with segmented buttons', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(FuturesTradeReport, { props: { request, showSources: true } })
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
    const wrapper = mount(FuturesTradeReport, { props: { request, showSources: true } })
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
    const wrapper = mount(FuturesTradeReport, { props: { request, showSources: true, showSourceCode: false, sourceSearch: 'name-or-id' } })
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
  it('shows the contract column only for accepted symbol results and keeps draft filters separate', async () => {
    const request = vi.fn(async (query: { symbol: string }) => ({
      rows: [{ ...row, symbol: query.symbol === 'BNB' ? 'BNBUSDT' : query.symbol }], total: 1,
    }))
    const wrapper = mount(FuturesTradeReport, { props: { request, showSymbolWhenFiltered: true } })
    await flushPromises()
    const keys = () => (wrapper.getComponent({ name: 'MmProTable' }).props('columns') as ProTableColumn<FuturesTradeReportRow>[]).map(column => column.key)
    expect(keys()).not.toContain('symbol')

    const bar = wrapper.getComponent(MmQueryBar)
    await wrapper.get('[data-query-field="symbol"] input').setValue(' bnb ')
    await flushPromises()
    expect(keys()).not.toContain('symbol')
    bar.vm.$emit('query', bar.props('modelValue'))
    await flushPromises()
    expect(keys().slice(0, 2)).toEqual(['stat_date', 'symbol'])
    expect(wrapper.get('.mm-table__body-table').text()).toContain('BNBUSDT')
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ symbol: 'BNB' }), expect.anything())

    await wrapper.get('[data-query-field="symbol"] input').setValue('ETHUSDT')
    await flushPromises()
    expect(wrapper.get('.mm-table__body-table').text()).toContain('BNBUSDT')
    expect(wrapper.get('.mm-table__body-table').text()).not.toContain('ETHUSDT')

    bar.vm.$emit('reset', { period: 'day', symbol: '', date_range: null })
    await flushPromises()
    expect(keys()).not.toContain('symbol')
    wrapper.unmount()
  })
  it('keeps the contract column disabled for existing consumers unless opted in', async () => {
    const wrapper = mount(FuturesTradeReport, {
      props: { request: async () => ({ rows: [{ ...row, symbol: 'BTCUSDT' }], total: 1 }) },
    })
    await flushPromises()
    const columns = wrapper.getComponent({ name: 'MmProTable' }).props('columns') as ProTableColumn<FuturesTradeReportRow>[]
    expect(columns.map(column => column.key)).not.toContain('symbol')
    wrapper.unmount()
  })
  it('does not replace the visible contract when an aborted search resolves late', async () => {
    let resolveOlder!: (result: { rows: FuturesTradeReportRow[], total: number }) => void
    const request = vi.fn(async (query: { symbol: string }) => {
      if (query.symbol === 'BNBUSDT') {
        return new Promise<{ rows: FuturesTradeReportRow[], total: number }>(resolve => { resolveOlder = resolve })
      }
      return { rows: [{ ...row, symbol: query.symbol }], total: 1 }
    })
    const wrapper = mount(FuturesTradeReport, { props: { request, showSymbolWhenFiltered: true } })
    await flushPromises()
    const bar = wrapper.getComponent(MmQueryBar)
    bar.vm.$emit('query', { ...bar.props('modelValue'), symbol: 'BNBUSDT' })
    await flushPromises()
    bar.vm.$emit('query', { ...bar.props('modelValue'), symbol: 'ETHUSDT' })
    await flushPromises()
    resolveOlder({ rows: [{ ...row, symbol: 'BNBUSDT' }], total: 1 })
    await flushPromises()
    expect(wrapper.get('.mm-table__body-table').text()).toContain('ETHUSDT')
    expect(wrapper.get('.mm-table__body-table').text()).not.toContain('BNBUSDT')
    wrapper.unmount()
  })
  it('rounds without float precision loss or negative zero', () => {
    expect(formatTradeReportDecimal('-0.001')).toBe('0.00')
    expect(formatTradeReportDecimal('999.995')).toBe('1,000.00')
    expect(formatTradeReportDecimal('9007199254740993', 0)).toBe('9,007,199,254,740,993')
  })
})
