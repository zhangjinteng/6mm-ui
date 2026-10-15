import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import FundingOverviewTable from '../FundingOverviewTable.vue'

describe('MmFundingOverviewTable', () => {
  it('requests descending funding balance, displays exact rounded amounts and disables automatic refresh', async () => {
    const request = vi.fn(async () => ({ rows: [{ id: 101, user_id: '900000101', username: 'alice',
      funding_balance: '9007199254740993.995', contract_equity: '20', contract_occupied: '4',
      total_assets: '9007199254741013.995', last_changed_at: '2026-10-15 10:00:00' }], total: 1 }))
    const wrapper = mount(FundingOverviewTable, { props: { request } })
    await flushPromises()
    expect(request).toHaveBeenCalledWith({ keyword: '', start_time: '', end_time: '',
      order_by: 'funding_balance', order_dir: 'desc', page_no: 1, page_size: 20 },
    expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(wrapper.text()).toContain('9,007,199,254,740,994.00')
    expect(wrapper.text()).toContain('900000101')
    expect(wrapper.text()).toContain('2026-10-15 10:00:00')
    expect(wrapper.find('.mm-pro-table__auto-refresh').exists()).toBe(false)
    wrapper.unmount()
  })

  it('forwards keyword/date filters and server sorting instead of filtering only the current page', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(FundingOverviewTable, { props: { request } })
    await flushPromises()
    const table = wrapper.findComponent({ name: 'MmProTable' })
    table.vm.$emit('update:filters', { keyword: ' BOB ', last_changed_range: ['2026-10-01', '2026-10-15'] })
    await flushPromises()
    table.vm.$emit('query')
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ keyword: 'BOB',
      start_time: '2026-10-01', end_time: '2026-10-15' }), expect.anything())
    table.vm.$emit('update:sort', { key: 'total_assets', order: 'asc' })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ order_by: 'total_assets', order_dir: 'asc' }), expect.anything())
    wrapper.unmount()
  })

  it('supports host identity slots and source-column extensions', async () => {
    const request = vi.fn(async () => ({ rows: [{ id: 101, user_id: '900000101', username: 'alice' }], total: 1 }))
    const wrapper = mount(FundingOverviewTable, { props: { request,
      columns: defaults => [...defaults, { key: 'source_name', title: '来源名称' }] },
    slots: { 'cell-user_id': '<a>Host user detail</a>', 'cell-username': '<b>Host username</b>' } })
    await flushPromises()
    expect(wrapper.text()).toContain('Host user detail')
    expect(wrapper.text()).toContain('Host username')
    expect(wrapper.text()).toContain('来源名称')
    wrapper.unmount()
  })

  it('sends pagination changes and resets the keyword/date query', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 100 }))
    const wrapper = mount(FundingOverviewTable, { props: { request } })
    await flushPromises()
    const table = wrapper.findComponent({ name: 'MmProTable' })
    table.vm.$emit('update:currentPage', 2)
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ page_no: 2 }), expect.anything())
    table.vm.$emit('update:pageSize', 50)
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ page_no: 2, page_size: 50 }), expect.anything())
    table.vm.$emit('reset', { keyword: '', last_changed_range: null })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ page_no: 1, keyword: '', start_time: '', end_time: '' }), expect.anything())
    wrapper.unmount()
  })

  it('explicitly labels retained last-successful rows after a reload error', async () => {
    const request = vi.fn().mockResolvedValueOnce({ rows: [{ id: 101, username: 'old-row' }], total: 1 })
      .mockRejectedValueOnce({ msg: '查询失败' })
    const wrapper = mount(FundingOverviewTable, { props: { request } })
    await flushPromises()
    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    await flushPromises()
    expect(wrapper.text()).toContain('查询失败')
    expect(wrapper.text()).toContain('上一次成功数据')
    wrapper.unmount()
  })
})
