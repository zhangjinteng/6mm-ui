import { defineComponent, h, reactive } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { MarketCurrentApi, MarketHistoryApi, MarketPriceMap } from './types'

vi.mock('../components/pro-table', () => {
  return {
    MmProTable: defineComponent({
      name: 'MarketTestTable',
      props: ['columns', 'queryFields', 'filters', 'data', 'currentPage', 'total'],
      emits: ['update:filters', 'update:currentPage', 'query', 'reset'],
      setup: (props, { slots }) => () => h('div', (props.data || []).map((row: any) =>
        h('div', (props.columns || []).map((column: any) =>
          h('span', { 'data-cell': column.key }, slots[`cell-${column.key}`]?.({ row, value: row[column.key] })
            ?? column.formatter?.(row[column.key], row) ?? String(row[column.dataIndex] ?? '')),
        )),
      )),
    }),
  }
})

import CurrentPage from './MarketCurrentPage.vue'
import HistoryPage from './MarketHistoryPage.vue'

const wrappers: VueWrapper[] = []
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))
const row = { id: 1, symbol: 'BTCUSDT', remain: '1:2:3' }
const historyRow = { symbol: 'BTCUSDT', timestamp_ms: Date.UTC(2026, 10, 16, 6), open: '0.00000001', high: '2', low: '0', close: '1.50' }
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(callback => { resolve = callback })
  return { promise, resolve }
}
function current(apiPatch: Partial<MarketCurrentApi> = {}, priceMap: MarketPriceMap = {}) {
  const api = {
    preview: vi.fn(async () => ({ lists: [row], count: 55 })),
    symbols: vi.fn(async () => [{ symbol: 'BTCUSDT' }]),
    tradeStats: vi.fn(async () => ({ BTCUSDT: { trade_volume_24h: '123.456', trade_quantity_24h: '0.12345678' } })),
    ...apiPatch,
  }
  const wrapper = mount(CurrentPage, { props: { api, priceMap }, slots: { symbol: ({ symbol }: any) => h('b', `coin:${symbol}`) } })
  wrappers.push(wrapper)
  return { api, wrapper, table: () => wrapper.findComponent({ name: 'MarketTestTable' }) }
}

describe('shared current market page', () => {
  it('uses host APIs, public reactive prices, all nine columns and symbol rendering', async () => {
    const prices = reactive<MarketPriceMap>({ BTCUSDT: { lastPrice: '123.456', markPrice: '124', indexPrice: '125', fundingRate: '0.0001', openInterest: '321' } })
    const f = current({}, prices)
    await flushPromises()
    expect(f.api.preview).toHaveBeenCalledWith({ keyword: '', sym: 'All', page_no: 1, page_size: 20 }, expect.any(AbortSignal))
    expect(f.api.tradeStats).toHaveBeenCalledWith(['BTCUSDT'], expect.any(AbortSignal))
    expect(f.table().props('columns')).toHaveLength(9)
    expect(f.table().props('total')).toBe(55)
    expect(f.wrapper.text()).toContain('coin:BTCUSDT')
    expect(f.wrapper.get('[data-cell="last"]').text()).toBe('123.45')
    expect(f.wrapper.get('[data-cell="funding"]').text()).toBe('0.01%')
    expect(f.wrapper.get('[data-cell="volume"]').text()).toBe('123.45')
    expect(f.wrapper.get('[data-cell="quantity"]').text()).toBe('0.12345678')
    expect(f.table().props('queryFields')[1].options).toEqual([{ label: '全部交易对', value: 'All' }, { label: 'BTCUSDT', value: 'BTCUSDT' }])
    prices.BTCUSDT.lastPrice = '456.789'
    await flushPromises()
    expect(f.wrapper.get('[data-cell="last"]').text()).toBe('456.78')
  })

  it('does not invent prices or trade totals when the upstream is unavailable', async () => {
    const f = current({ tradeStats: vi.fn().mockRejectedValue(new Error('unavailable')) })
    await flushPromises()
    for (const key of ['last', 'mark', 'index', 'volume', 'quantity', 'funding', 'interest']) {
      expect(f.wrapper.get(`[data-cell="${key}"]`).text()).toBe('-')
    }
  })

  it('aborts stale statistics and does not let the older page replace current totals', async () => {
    const pending = deferred<Record<string, { trade_volume_24h: string; trade_quantity_24h: string }>>()
    const tradeStats = vi.fn().mockImplementationOnce(() => pending.promise)
      .mockResolvedValue({ BTCUSDT: { trade_volume_24h: '222', trade_quantity_24h: '2' } })
    const f = current({ tradeStats })
    await flushPromises()
    const firstSignal = tradeStats.mock.calls[0][1] as AbortSignal
    f.table().vm.$emit('update:currentPage', 2)
    await flushPromises()
    expect(firstSignal.aborted).toBe(true)
    expect(f.api.preview).toHaveBeenLastCalledWith(expect.objectContaining({ page_no: 2 }), expect.any(AbortSignal))
    pending.resolve({ BTCUSDT: { trade_volume_24h: '999', trade_quantity_24h: '9' } })
    await flushPromises()
    expect(f.wrapper.get('[data-cell="volume"]').text()).toBe('222.00')
  })

  it('cancels catalog and pending statistics requests when unmounted', async () => {
    const stats = vi.fn(() => new Promise<any>(() => {}))
    const symbols = vi.fn(() => new Promise<any>(() => {}))
    const f = current({ tradeStats: stats, symbols })
    await flushPromises()
    f.wrapper.unmount()
    expect((stats.mock.calls[0] as any)[1].aborted).toBe(true)
    expect((symbols.mock.calls[0] as any)[0].aborted).toBe(true)
  })
})

it('shared history keeps paging windows, precision, filters and host symbol display', async () => {
  const anchor = Date.UTC(2026, 10, 16, 6, 22)
  const api: MarketHistoryApi = {
    symbols: vi.fn(async () => [{ symbol: 'BTCUSDT' }]),
    history: vi.fn(async () => ({ lists: [historyRow], count: 123, end_ms: anchor })),
  }
  const wrapper = mount(HistoryPage, { props: { api }, slots: { symbol: ({ symbol }: any) => h('b', `coin:${symbol}`) } })
  wrappers.push(wrapper)
  await flushPromises()
  const table = wrapper.findComponent({ name: 'MarketTestTable' })
  expect(api.history).toHaveBeenCalledWith(expect.objectContaining({ metric: 'index_price', interval: '1m', range: '24h', page_no: 1, page_size: 20 }), expect.any(AbortSignal))
  expect(table.props('total')).toBe(123)
  expect(table.props('data')[0]._rowKey).toBe(`index_price-BTCUSDT-${historyRow.timestamp_ms}`)
  expect(wrapper.get('[data-cell="open"]').text()).toBe('0.00000001')
  expect(wrapper.get('[data-cell="close"]').text()).toBe('1.5')
  expect(wrapper.text()).toContain('coin:BTCUSDT')
  table.vm.$emit('update:currentPage', 2)
  await flushPromises()
  expect(api.history).toHaveBeenLastCalledWith(expect.objectContaining({ page_no: 2, end_ms: anchor }), expect.any(AbortSignal))
  table.vm.$emit('update:filters', { ...table.props('filters'), metric: 'mark_price' })
  await flushPromises()
  expect(api.history).toHaveBeenLastCalledWith(expect.objectContaining({ metric: 'mark_price', page_no: 1, end_ms: undefined }), expect.any(AbortSignal))
  wrapper.unmount()
  expect((vi.mocked(api.symbols).mock.calls[0][0]).aborted).toBe(true)
})
