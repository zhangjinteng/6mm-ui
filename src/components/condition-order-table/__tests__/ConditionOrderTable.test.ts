import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import MmConditionOrderTable from '../MmConditionOrderTable.vue'
import MmTpSlOrderTable from '../MmTpSlOrderTable.vue'
import type { ConditionOrderListQuery } from '../types'

describe('condition-order table presets', () => {
  it('enables the bounded fill-height layout for both public presets by default', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const conditionOrder = mount(MmConditionOrderTable, {
      props: { lifecycle: 'current', request },
    })
    const tpSlOrder = mount(MmTpSlOrderTable, {
      props: { lifecycle: 'current', request },
    })
    await flushPromises()

    expect(conditionOrder.get('[data-mm-component="pro-table"]').classes()).toContain('is-fill-height')
    expect(tpSlOrder.get('[data-mm-component="pro-table"]').classes()).toContain('is-fill-height')

    conditionOrder.unmount()
    tpSlOrder.unmount()
  })

  it('normalizes the current condition-order request and renders returned rows', async () => {
    const request = vi.fn(async (_query: ConditionOrderListQuery) => ({
      rows: [{
        condition_id: 'condition-1',
        created_at: '2026-08-10 08:00:00',
        leverage: 20,
        margin_mode: 1,
        price: '64000.126',
        product_category: 'commodity',
        product_category_name: '大宗商品',
        quantity: '1.234567',
        side: 'sell',
        symbol: 'BTCUSDT',
        trigger_price: '65000',
        trigger_status: 0,
        trigger_type: 'stop_market',
        user_id: 9001,
        user_type: 1,
        working_type: 'MARK_PRICE',
      }],
      total: 1,
    }))
    const wrapper = mount(MmConditionOrderTable, {
      props: { lifecycle: 'current', request },
    })
    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        end: '',
        keyword: '',
        kind: 'condition',
        lifecycle: 'current',
        order_type: '',
        page_no: 1,
        page_size: 20,
        reduce_only: '',
        side: '',
        start: '',
        sym: '',
        user_type: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.get('[data-mm-component="pro-table"]').attributes('aria-label')).toBe('条件委托数据')
    expect(wrapper.text()).toContain('止损-市价')
    expect(wrapper.text()).toContain('待触发')
    expect(wrapper.text()).toContain('20x')
    expect(wrapper.text()).toContain('大宗商品')
    wrapper.unmount()
  })

  it('can hide the user-type column, filter, and request parameter', async () => {
    const request = vi.fn(async (_query: ConditionOrderListQuery) => ({
      rows: [{ condition_id: 'condition-hidden-user-type', user_id: 9005, user_type: 1 }],
      total: 1,
    }))
    const wrapper = mount(MmConditionOrderTable, {
      props: { lifecycle: 'current', request, showUserType: false },
    })
    await flushPromises()

    const fields = wrapper.findComponent(MmQueryBar).props('fields') as Array<{ key: string }>
    expect(fields.some(field => field.key === 'user_type')).toBe(false)
    expect(wrapper.findAll('thead th').map(header => header.text())).not.toContain('用户类型')
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('user_type')
    wrapper.unmount()
  })

  it('uses compact default widths for dense condition-order tables', async () => {
    const request = vi.fn(async () => ({
      rows: [{ condition_id: 'condition-compact', trigger_status: 0 }],
      total: 1,
    }))
    const wrapper = mount(MmConditionOrderTable, {
      props: { lifecycle: 'current', request },
    })
    await flushPromises()

    expect(wrapper.findAll('.mm-table__header-table th').map(header => header.attributes('style'))).toEqual([
      'width: 112px; min-width: 112px;',
      'width: 78px; min-width: 78px;',
      'width: 165px; min-width: 165px;',
      'width: 110px; min-width: 110px;',
      'width: 88px; min-width: 88px;',
      'width: 116px; min-width: 116px;',
      'width: 66px; min-width: 66px;',
      'width: 88px; min-width: 88px;',
      'width: 62px; min-width: 62px;',
      'width: 90px; min-width: 90px;',
      'width: 102px; min-width: 102px;',
      'width: 100px; min-width: 100px;',
      'width: 170px; min-width: 170px;',
      'width: 176px; min-width: 176px;',
    ])
    wrapper.unmount()
  })

  it('owns the TP/SL preset and forwards all filters to the request adapter', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(MmTpSlOrderTable, {
      props: { lifecycle: 'history', request },
    })
    await flushPromises()

    wrapper.findComponent(MmQueryBar).vm.$emit('query', {
      keyword: 'external-user',
      order_type: 'take_profit_market',
      reduce_only: 1,
      side: 'buy',
      symbol: 'btc',
      time_range: ['2026-08-01', '2026-08-02'],
      user_type: 2,
    })
    await flushPromises()

    expect(request).toHaveBeenLastCalledWith(
      {
        end: '2026-08-02 23:59:59',
        keyword: 'external-user',
        kind: 'tp_sl',
        lifecycle: 'history',
        order_type: 'take_profit_market',
        page_no: 1,
        page_size: 20,
        reduce_only: 1,
        side: 'buy',
        start: '2026-08-01 00:00:00',
        sym: 'btc',
        user_type: 2,
      },
      expect.objectContaining({
        filters: expect.objectContaining({ keyword: 'external-user' }),
        signal: expect.any(AbortSignal),
      }),
    )
    expect(wrapper.get('[data-mm-component="pro-table"]').attributes('aria-label')).toBe('历史止盈止损委托数据')
    wrapper.unmount()
  })

  it('supports host-owned detail and cancel actions while hiding cancel in history', async () => {
    const detail = vi.fn()
    const cancel = vi.fn()
    const request = vi.fn(async () => ({
      rows: [{ condition_id: 'condition-2', trigger_status: 0, user_id: 9002 }],
      total: 1,
    }))
    const wrapper = mount(MmConditionOrderTable, {
      props: { actions: { cancel, detail }, lifecycle: 'current', request },
    })
    await flushPromises()

    await wrapper.get('button[aria-label="查看详情 condition-2"]').trigger('click')
    await wrapper.get('button[aria-label="撤销条件委托 condition-2"]').trigger('click')
    expect(detail).toHaveBeenCalledWith(expect.objectContaining({ condition_id: 'condition-2' }), expect.any(Object))
    expect(cancel).toHaveBeenCalledWith(expect.objectContaining({ condition_id: 'condition-2' }), expect.any(Object))
    wrapper.unmount()

    const historyWrapper = mount(MmConditionOrderTable, {
      props: { actions: { cancel, detail }, lifecycle: 'history', request },
    })
    await flushPromises()
    expect(historyWrapper.find('button[aria-label="撤销条件委托 condition-2"]').exists()).toBe(false)
    historyWrapper.unmount()
  })

})
