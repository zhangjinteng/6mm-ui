import { defineComponent, h } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import type { ContractVipRequest, ContractVipRow } from './types'

vi.mock('../pro-table', () => ({ MmProTable: defineComponent({
  name: 'VipTestTable', props: ['columns', 'queryFields', 'filters', 'data', 'sort', 'currentPage', 'total', 'loading'],
  emits: ['update:filters', 'update:sort', 'update:currentPage', 'update:pageSize', 'query'],
  setup: (props, { slots }) => () => h('div', [
    slots['field-keyword']?.({ field: props.queryFields[0], value: props.filters.keyword, update: () => {} }),
    ...(props.data || []).map((row: any) => h('div', props.columns.map((column: any) =>
      h('span', { 'data-cell': column.key }, slots[`cell-${column.key}`]?.({ row }) ?? String(row[column.dataIndex] ?? '')),
    ))),
  ]),
}) }))
import VipTable from './ContractVipTable.vue'

const row: ContractVipRow = { id: 1, user_id: '9001', username: 'alice', nice_name: 'Alice', agent_id: 0,
  vip_level: 0, volume_30d: '1234.5', current_threshold: '0', next_threshold: '5000', progress_percent: 24.69,
  vip_level_updated_at: null, last_calculated_at: null }
const wrappers: VueWrapper[] = []
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))
function fixture(request: ContractVipRequest = vi.fn(async () => ({ rows: [row], total: 123 })), extra = {}) {
  const wrapper = mount(VipTable, { props: { request, ...extra }, slots: {
    'cell-user_id': ({ row }: any) => h('b', { 'data-uid': '' }, row.user_id),
  } })
  wrappers.push(wrapper)
  return { wrapper, request, table: () => wrapper.findComponent({ name: 'VipTestTable' }) }
}

it('submits keyword, VIP zero, sort, page and cancellation context without host scope parameters', async () => {
  const f = fixture()
  await flushPromises()
  expect(f.request).toHaveBeenCalledWith({ page_no: 1, page_size: 20, keyword: '', vip_level: '', sort_field: undefined, sort_order: undefined }, { signal: expect.any(AbortSignal) })
  expect(f.table().props('queryFields').map((field: any) => field.key)).toEqual(['keyword', 'vip_level'])
  expect(f.table().props('total')).toBe(123)
  f.table().vm.$emit('update:filters', { keyword: '  Alpha  ', vip_level: 0 })
  f.table().vm.$emit('query', { keyword: '  Alpha  ', vip_level: 0 })
  await flushPromises()
  f.table().vm.$emit('update:sort', { key: 'volume_30d', order: 'desc' })
  await flushPromises()
  f.table().vm.$emit('update:pageSize', 30)
  await flushPromises()
  f.table().vm.$emit('update:currentPage', 2)
  await flushPromises()
  expect(f.request).toHaveBeenLastCalledWith({ page_no: 2, page_size: 30, keyword: 'Alpha', vip_level: 0, sort_field: 'volume_30d', sort_order: 'desc' }, { signal: expect.any(AbortSignal) })
})

it('preserves amount/progress rendering, empty timestamps and host UID slots without source columns', async () => {
  const f = fixture()
  await flushPromises()
  expect(f.table().props('columns')).toHaveLength(8)
  expect(f.table().props('columns').some((c: any) => c.key.startsWith('source_'))).toBe(false)
  expect(f.wrapper.get('[data-uid]').text()).toBe('9001')
  expect(f.wrapper.get('[data-cell="volume_30d"]').text()).toBe('1,234.50')
  expect(f.wrapper.get('[data-cell="progress_percent"]').text()).toBe('24.69%')
  expect(f.wrapper.get('[data-cell="last_calculated_at"]').text()).toBe('—')
})

it('allows platform source columns and keeps missing thresholds distinct from highest VIP', async () => {
  const f = fixture(vi.fn(async () => ({ rows: [{ ...row, next_threshold: null, progress_percent: null }], total: 1 })), {
    sourceColumns: [{ key: 'source_name', dataIndex: 'source_name', title: '来源名称' }, { key: 'source_type', dataIndex: 'source_type', title: '来源类型' }],
  })
  await flushPromises()
  expect(f.table().props('columns')).toHaveLength(10)
  expect(f.wrapper.get('[data-cell="progress_percent"]').text()).toBe('—')
  await f.wrapper.setProps({ request: vi.fn(async () => ({ rows: [{ ...row, next_threshold: null, progress_percent: 100 }], total: 1 })) })
  f.table().vm.$emit('query', {})
  await flushPromises()
  expect(f.wrapper.get('[data-cell="progress_percent"]').text()).toBe('最高等级')
})

it('aborts pending reads on unmount and ignores stale page responses', async () => {
  let release!: (value: any) => void
  const request = vi.fn().mockImplementationOnce(() => new Promise(resolve => { release = resolve }))
    .mockResolvedValue({ rows: [{ ...row, user_id: '9002' }], total: 2 })
  const f = fixture(request)
  await flushPromises()
  const oldSignal = request.mock.calls[0][1].signal
  f.table().vm.$emit('update:currentPage', 2)
  await flushPromises()
  expect(oldSignal.aborted).toBe(true)
  release({ rows: [row], total: 1 })
  await flushPromises()
  expect(f.wrapper.get('[data-uid]').text()).toBe('9002')
  let pendingSignal!: AbortSignal
  const pending = fixture((_params, { signal }) => { pendingSignal = signal; return new Promise(() => {}) })
  await flushPromises()
  pending.wrapper.unmount()
  expect(pendingSignal.aborted).toBe(true)
})
