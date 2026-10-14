import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import PredictionUserPnlReport from '../PredictionUserPnlReport.vue'
import type { PredictionUserPnlReportRow } from '../types'

const row: PredictionUserPnlReportRow = {
  id: '2026-10-13:merchant:1:all:*', stat_date: '2026-10-13', play_type: 'all',
  source_type: 'merchant', source_id: '1', source_code: 'A1', source_name: 'Merchant One',
  trading_user_count: 1, valid_trading_user_count: 1, profitable_user_count: 1,
  losing_user_count: 0, breakeven_user_count: 0, order_count: 2,
  win_order_count: 1, lose_order_count: 1, refund_order_count: 0,
  stake_amount: '9007199254740993.125', valid_stake_amount: '9007199254740993.125',
  return_amount: '9007199254740994.125', user_net_pnl: '1', platform_pnl: '-1',
  payout_rate: '100.00000001', stat_status: 1,
}

describe('MmPredictionUserPnlReport', () => {
  it('keeps merchant filters and precise money without exposing source selectors', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(PredictionUserPnlReport, { props: { request } })
    await flushPromises()
    expect(wrapper.findAll('[data-query-field]').map(field => field.attributes('data-query-field')))
      .toEqual(['play_type', 'symbol', 'date_range'])
    expect(wrapper.text()).toContain('9,007,199,254,740,993.13')
    expect(wrapper.text()).toContain('+1.00')
    expect(wrapper.text()).toContain('-1.00')
    expect(request.mock.calls[0][0]).not.toHaveProperty('source_type')
    wrapper.unmount()
  })

  it('defaults to the platform source and shows status and source columns', async () => {
    const request = vi.fn(async (..._args: unknown[]) => ({ rows: [row], total: 1 }))
    const wrapper = mount(PredictionUserPnlReport, { props: { request, showSources: true, sourceSearch: 'name-or-id' } })
    await flushPromises()
    const source = wrapper.get('[data-query-field="source_type"]')
    expect(source.get('button[aria-checked="true"]').text()).toBe('平台')
    expect(wrapper.text()).toContain('来源名称')
    expect(wrapper.text()).toContain('已完成')
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ source_type: 'platform', source_keyword: '' }), expect.anything())
    wrapper.unmount()
  })
})
