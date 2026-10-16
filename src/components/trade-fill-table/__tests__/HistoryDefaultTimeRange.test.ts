import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import HistoryOrderTable from '../../history-order-table/HistoryOrderTable.vue'
import HistoryPositionTable from '../../history-position-table/HistoryPositionTable.vue'
import { MmQueryBar } from '../../query-bar'
import type { DateRangeValue } from '../../date-picker-panel'
import TradeFillTable from '../TradeFillTable.vue'

describe.each([
  ['trade fills', TradeFillTable],
  ['history positions', HistoryPositionTable],
  ['history orders', HistoryOrderTable],
] as const)('%s default time range', (_name, component) => {
  it('uses the initial range for the first request and restores it on reset', async () => {
    const initialTimeRange: DateRangeValue = ['2026-10-10', '2026-10-16']
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(component, { props: { initialTimeRange, request } })
    await flushPromises()

    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({
      start_time: '2026-10-10 00:00:00',
      end_time: '2026-10-16 23:59:59',
    }), expect.any(Object))
    const queryBar = wrapper.findComponent(MmQueryBar)
    expect(queryBar.props('modelValue')?.time_range).toEqual(initialTimeRange)

    queryBar.vm.$emit('query', { time_range: ['2026-09-01', '2026-09-02'] })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({
      start_time: '2026-09-01 00:00:00',
      end_time: '2026-09-02 23:59:59',
    }), expect.any(Object))
    await wrapper.get('button[data-query-action="reset"]').trigger('click')
    await flushPromises()
    expect(queryBar.props('modelValue')?.time_range).toEqual(initialTimeRange)
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({
      start_time: '2026-10-10 00:00:00',
      end_time: '2026-10-16 23:59:59',
      page_no: 1,
    }), expect.any(Object))
    expect(initialTimeRange).toEqual(['2026-10-10', '2026-10-16'])
    wrapper.unmount()
  })

  it('does not force the default back after the user explicitly clears it', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(component, {
      props: { initialTimeRange: ['2026-10-10', '2026-10-16'], request },
    })
    await flushPromises()
    wrapper.findComponent(MmQueryBar).vm.$emit('query', { time_range: null })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({
      start_time: '', end_time: '',
    }), expect.any(Object))
    wrapper.unmount()
  })
})
