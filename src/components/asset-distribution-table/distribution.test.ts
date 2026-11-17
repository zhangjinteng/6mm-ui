import { defineComponent, h } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import type { AssetDistributionRequest, AssetDistributionRow } from './types'

vi.mock('../pro-table', () => ({ MmProTable: defineComponent({
  name: 'DistributionTestTable', props: ['columns', 'queryFields', 'filters', 'data', 'total', 'currentPage', 'sort'],
  emits: ['update:filters', 'update:sort', 'update:currentPage', 'query'],
  setup: (props, { slots }) => () => h('div', (props.data || []).map((row: any) =>
    h('div', props.columns.map((column: any) => h('span', { 'data-cell': column.key },
      slots[`cell-${column.key}`]?.({ row }) ?? (column.formatter ? column.formatter(row[column.key]) : String(row[column.key] ?? '')),
    ))),
  )),
}) }))
import DistributionTable from './AssetDistributionTable.vue'

const row: AssetDistributionRow = { id: 'tenant:101:funding', stat_date: '2026-11-16', source_type: 'tenant', source_id: '101', source_name: 'White label',
  account_type: 'funding', currency: 'USDT', funded_user_count: 1, total_balance: '9007199254740993.1234567890123456',
  available_balance: '3', restricted_balance: '0', current_price: '1', total_valuation: '3', asset_share: '75',
  updated_at: '2026-11-16T12:00:00Z', snapshot_status: 'complete' }
const wrappers: VueWrapper[] = []
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))
function fixture(showSources = true, request: AssetDistributionRequest = vi.fn(async () => ({ rows: [row], total: 24 }))) {
  const wrapper = mount(DistributionTable, { props: { request, showSources, formatTimestamp: value => value ? 'local-time' : '-' },
    slots: { currency: ({ row }: any) => h('b', `coin:${row.currency}`) } })
  wrappers.push(wrapper)
  return { wrapper, request, table: () => wrapper.findComponent({ name: 'DistributionTestTable' }) }
}

it('keeps Platform source fields/columns and exact money/percentage formatting', async () => {
  const f = fixture()
  await flushPromises()
  expect(f.table().props('columns')).toHaveLength(12)
  expect(f.table().props('queryFields').map((field: any) => field.key)).toEqual(['source_type', 'source_keyword', 'account_type'])
  expect(f.request).toHaveBeenCalledWith({ source_type: 'platform', source_keyword: '', account_type: '', page_no: 1, page_size: 20, order_by: 'source_name', order_dir: 'asc' }, { signal: expect.any(AbortSignal) })
  expect(f.table().props('total')).toBe(24)
  expect(f.wrapper.get('[data-cell="total_balance"]').text()).toBe('9,007,199,254,740,993.12')
  expect(f.wrapper.get('[data-cell="asset_share"]').text()).toBe('75.00%')
  expect(f.wrapper.get('[data-cell="updated_at"]').text()).toBe('local-time')
  expect(f.wrapper.get('[data-cell="currency"]').text()).toBe('coin:USDT')
})

it('white-label mode has no cross-source controls, columns or source request parameters', async () => {
  const f = fixture(false)
  await flushPromises()
  expect(f.table().props('columns')).toHaveLength(10)
  expect(f.table().props('queryFields').map((field: any) => field.key)).toEqual(['account_type'])
  expect(f.request).toHaveBeenCalledWith({ account_type: '', page_no: 1, page_size: 20, order_by: 'source_name', order_dir: 'asc' }, { signal: expect.any(AbortSignal) })
  f.table().vm.$emit('update:filters', { account_type: 'funding' })
  await flushPromises()
  expect(f.request).toHaveBeenLastCalledWith(expect.objectContaining({ account_type: 'funding' }), { signal: expect.any(AbortSignal) })
  f.table().vm.$emit('update:sort', { key: 'asset_share', order: 'desc' })
  await flushPromises()
  f.table().vm.$emit('update:currentPage', 2)
  await flushPromises()
  expect(f.request).toHaveBeenLastCalledWith({ account_type: 'funding', page_no: 2, page_size: 20, order_by: 'asset_share', order_dir: 'desc' }, { signal: expect.any(AbortSignal) })
})

it('incomplete snapshots stay missing and display their warning, without inventing zero', async () => {
  const f = fixture(false, vi.fn(async () => ({ rows: [{ ...row, total_balance: null, asset_share: null, updated_at: null, snapshot_status: 'incomplete' as const }], total: 1 })))
  await flushPromises()
  expect(f.wrapper.get('[data-cell="total_balance"]').text()).toBe('-')
  expect(f.wrapper.get('[data-cell="asset_share"]').text()).toBe('-')
  expect(f.wrapper.get('[data-cell="updated_at"]').text()).toContain('数据不完整')
})

it('cancels outdated pages and pending reads on unmount', async () => {
  let release!: (value: any) => void
  const request = vi.fn().mockImplementationOnce(() => new Promise(resolve => { release = resolve }))
    .mockResolvedValue({ rows: [{ ...row, total_balance: '2' }], total: 1 })
  const f = fixture(true, request)
  await flushPromises()
  const old = request.mock.calls[0][1].signal
  f.table().vm.$emit('update:currentPage', 2)
  await flushPromises()
  expect(old.aborted).toBe(true)
  release({ rows: [row], total: 1 })
  await flushPromises()
  expect(f.wrapper.get('[data-cell="total_balance"]').text()).toBe('2.00')
  let signal!: AbortSignal
  const pending = fixture(false, (_params, context) => { signal = context.signal; return new Promise(() => {}) })
  await flushPromises()
  pending.wrapper.unmount()
  expect(signal.aborted).toBe(true)
})
