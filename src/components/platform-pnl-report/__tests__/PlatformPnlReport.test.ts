import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { MmQueryBar } from '../../query-bar'
import PlatformPnlReport from '../PlatformPnlReport.vue'
import type { PlatformPnlReportRow } from '../types'

const row: PlatformPnlReportRow = {
  id: 'day:2026-10-12:platform:0', stat_date: '2026-10-12', source_type: 'platform',
  source_id: '0', source_name: '6MM', contract_trade_pnl: '-10.005',
  contract_trading_fee_income: '2.345', contract_liquidation_fee_income: '0',
  platform_funding_fee_net: '-0.5', contract_total_pnl: '-8.16',
  prediction_business_pnl: '9', total_pnl: '0.84', stat_status: 1,
}

describe('MmPlatformPnlReport', () => {
  it('uses Agent day/month filters and formats signed amounts', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(PlatformPnlReport, { props: { request } })
    await flushPromises()
    expect(wrapper.findAll('[data-query-field]').map(field => field.attributes('data-query-field'))).toEqual(['period', 'date_range'])
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('source_type')
    expect(wrapper.text()).toContain('-10.01')
    expect(wrapper.text()).toContain('+2.35')
    wrapper.unmount()
  })

  it('defaults Platform source to platform and supports tenant/month switch', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(PlatformPnlReport, { props: { request, showSources: true } })
    await flushPromises()
    const source = wrapper.get('[data-query-field="source_type"]')
    expect(source.findAll('button[role="radio"]').map(button => button.text())).toEqual(['平台', '白标', '商户'])
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform', period: 'day' }), expect.anything())
    await source.findAll('button[role="radio"]')[1]!.trigger('click')
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'tenant' }), expect.anything())
    const bar = wrapper.getComponent(MmQueryBar)
    bar.vm.$emit('update:modelValue', { ...bar.props('modelValue'), period: 'month', source_keyword: 'Tenant A', date_range: ['2026-10-01', '2026-10-12'] })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'month', source_keyword: 'Tenant A', start_date: '2026-10-01' }), expect.anything())
    wrapper.unmount()
  })

  it('shows incomplete status when either product has not published', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [{ ...row, stat_status: 2 }], total: 1 }))
    const wrapper = mount(PlatformPnlReport, { props: { request } })
    await flushPromises()
    expect(wrapper.text()).toContain('数据不完整')
    wrapper.unmount()
  })
})
