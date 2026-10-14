import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { createMmLocaleContext, mmLocaleKey } from '../../../composables/use-locale'
import { MmQueryBar } from '../../query-bar'
import UserDailyReport from '../UserDailyReport.vue'
import type { UserDailyReportQuery, UserDailyReportRow } from '../types'

const row: UserDailyReportRow = {
  id: 'day:2026-10-13:platform:0', stat_date: '2026-10-13', source_type: 'platform',
  source_id: '0', source_code: '6MM', source_name: '6MM', initial_user_count: 14,
  new_user_count: 0, transfer_in_user_count: 1, transfer_in_conversion_rate: '7.14',
  transfer_in_amount: '9007199254740993.126', transfer_out_user_count: 0,
  transfer_out_amount: '0', active_user_count: 2, active_rate: '14.29',
  total_trading_user_count: 1, trading_user_count: 1, prediction_trading_user_count: 0,
  stat_status: 'completed',
}
const response = async (_query: UserDailyReportQuery, _context: { signal: AbortSignal }) => ({ rows: [row], total: 1 })

describe('MmUserDailyReport', () => {
  it('shows the original agent columns with exact monetary formatting', async () => {
    const request = vi.fn(response)
    const wrapper = mount(UserDailyReport, { props: { request } })
    await flushPromises()
    expect(wrapper.text()).toContain('9,007,199,254,740,993.13')
    expect(wrapper.text()).toContain('7.14%')
    expect(wrapper.text()).not.toContain('来源名称')
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('source_type')
    wrapper.unmount()
  })

  it('defaults to platform and forwards period, source and UTC date filters', async () => {
    const request = vi.fn(response)
    const wrapper = mount(UserDailyReport, { props: { request, showSources: true, showSourceCode: false, sourceSearch: 'name-or-id' } })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform', page_size: 20 }), expect.anything())
    const bar = wrapper.getComponent(MmQueryBar)
    const filters = { ...bar.props('modelValue'), period: 'month', source_type: 'merchant',
      source_id: ' Alpha ', date_range: ['2026-10-01', '2026-10-14'] }
    bar.vm.$emit('update:modelValue', filters)
    bar.vm.$emit('query', filters)
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'month', source_type: 'merchant',
      source_keyword: 'Alpha', start_date: '2026-10-01', end_date: '2026-10-14' }),
    expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(request.mock.calls.at(-1)?.[0]).not.toHaveProperty('source_id')
    wrapper.unmount()
  })

  it('updates labels when the shared locale changes', async () => {
    const locale = ref<'en-US' | 'zh-CN'>('en-US')
    const wrapper = mount(UserDailyReport, {
      props: { request: response },
      global: { provide: { [mmLocaleKey as symbol]: createMmLocaleContext(locale) } },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Opening users')
    locale.value = 'zh-CN'
    await flushPromises()
    expect(wrapper.text()).toContain('期初用户')
    wrapper.unmount()
  })
})
