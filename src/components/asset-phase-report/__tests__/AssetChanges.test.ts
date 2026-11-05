import { flushPromises, mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import AssetPhaseReport from '../AssetPhaseReport.vue'
import { MmQueryBar } from '../../query-bar'
import type { AssetReportQuery, AssetReportRow } from '../types'

it.each([false, true])('requests scoped asset flows and preserves missing amounts (showSources=%s)', async showSources => {
  const request = vi.fn(async (params: AssetReportQuery) => {
    const row: AssetReportRow = { id: 'r1', stat_date: '2026-11-05', source_name: 'demo', source_id: '1',
      source_type: 'tenant', account_type: params.account_type, currency: 'USDT', opening_assets: null,
      closing_assets: '9007199254740993.12', deposit_in: '0', withdraw_out: null, transfer_net: null,
      realized_pnl: '2', fee_net: '-1', manual_adjust: null, funded_user_count: null, total_assets: null,
      negative_assets: null, buckets: [], stat_status: 'processing', updated_at: null }
    return { rows: [row], total: 1 }
  })
  const wrapper = mount(AssetPhaseReport, { props: { kind: 'changes', showSources, request, formatTimestamp: String } })
  try {
    await flushPromises()
    expect(request.mock.calls[0]?.[0]).toMatchObject({ period: 'day', account_type: 'funding', currency: 'USDT', page_size: 20 })
    const bar = wrapper.getComponent(MmQueryBar)
    expect(bar.props('fields')?.some(field => field.key === 'source_type')).toBe(showSources)
    expect('source_type' in request.mock.calls[0]![0]).toBe(showSources)
    const cells = wrapper.get('[data-row-key="r1"]').findAll('td').map(td => td.text())
    expect(cells).toContain('0.00')
    expect(cells).toContain('—')
    expect(cells).toContain('9,007,199,254,740,993.12')
    expect(wrapper.text()).not.toContain('合约已实现盈亏(U)')
    const filters = { ...bar.props('modelValue'), period: 'month', account_type: 'contract' }
    bar.vm.$emit('update:modelValue', filters)
    bar.vm.$emit('query', filters)
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ period: 'month', account_type: 'contract' }), expect.anything())
    expect(wrapper.text()).toContain('合约已实现盈亏(U)')
  } finally {
    wrapper.unmount()
  }
})
