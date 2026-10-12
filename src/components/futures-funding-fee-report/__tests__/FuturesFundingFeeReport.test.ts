import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { createMmLocaleContext, mmLocaleKey } from '../../../composables/use-locale'
import { MmQueryBar } from '../../query-bar'
import FuturesFundingFeeReport from '../FuturesFundingFeeReport.vue'
import type { FuturesFundingFeeReportQuery, FuturesFundingFeeReportRow } from '../types'

const row: FuturesFundingFeeReportRow = {
  id: 'day:2026-10-09:platform:0:', stat_date: '2026-10-09', source_type: 'platform',
  source_id: '0', source_code: '6MM', source_name: '6MM', funding_settlement_user_count: 4,
  funding_settlement_position_amount: '9007199254740993.126', funding_settlement_count: 11,
  funding_fee_income: '1.21', funding_fee_expense: '1.16', funding_fee_net_income: '0.05',
  funding_fee_net_income_rate: '0.0001', stat_status: 1,
}

const requestRows = async (_query: FuturesFundingFeeReportQuery, _context: { signal: AbortSignal }) => ({ rows: [row], total: 1 })

describe('MmFuturesFundingFeeReport', () => {
  it('shows agent metrics without source columns and formats exact amounts', async () => {
    const request = vi.fn(requestRows)
    const wrapper = mount(FuturesFundingFeeReport, { props: { request } })
    await flushPromises()
    expect(wrapper.text()).toContain('9,007,199,254,740,993.13')
    expect(wrapper.text()).toContain('0.0001%')
    expect(wrapper.text()).not.toContain('来源名称')
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('source_type')
    wrapper.unmount()
  })

  it('defaults to platform scope and forwards source, period, contract and dates', async () => {
    const request = vi.fn(requestRows)
    const wrapper = mount(FuturesFundingFeeReport, { props: { request, showSources: true, showSourceCode: false, sourceSearch: 'name-or-id' } })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform' }), expect.anything())
    const bar = wrapper.getComponent(MmQueryBar)
    const filters = { ...bar.props('modelValue'), source_type: 'tenant', source_id: ' White ', period: 'month',
      symbol: 'btcusdt', date_range: ['2026-10-01', '2026-10-10'] }
    bar.vm.$emit('update:modelValue', filters)
    bar.vm.$emit('query', filters)
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'tenant', source_keyword: 'White', period: 'month',
      symbol: 'BTCUSDT', start_date: '2026-10-01', end_date: '2026-10-10' }), expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(request.mock.calls.at(-1)?.[0]).not.toHaveProperty('source_id')
    wrapper.unmount()
  })

  it('updates locale without dropping the table', async () => {
    const locale = ref<'en-US' | 'zh-CN'>('en-US')
    const wrapper = mount(FuturesFundingFeeReport, {
      props: { request: async () => ({ rows: [row], total: 1 }) },
      global: { provide: { [mmLocaleKey as symbol]: createMmLocaleContext(locale) } },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Settlement users')
    locale.value = 'zh-CN'
    await flushPromises()
    expect(wrapper.text()).toContain('结算用户')
    wrapper.unmount()
  })
})
