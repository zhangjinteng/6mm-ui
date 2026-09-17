import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import type { QueryBarField, QueryBarSegmentedField } from '../../query-bar'
import CurrentOrderTable from '../CurrentOrderTable.vue'
import type { CurrentOrderListQuery } from '../types'

describe('MmCurrentOrderTable', () => {
  it('normalizes the initial request and renders the current-order contract', async () => {
    const request = vi.fn(async (_query: CurrentOrderListQuery) => ({
      hasMore: false,
      rows: [{
        created_at: '2026-08-10 08:00:00',
        filled_quantity: '0.123456',
        leverage: 20,
        maker_only: true,
        margin_mode: 1,
        order_id: 801,
        order_status: 2,
        order_type: 'limit',
        price: '70000.126',
        product_category: 'crypto',
        quantity: '1.234567',
        reduce_only: false,
        side: 'buy',
        symbol: 'BTCUSDT',
        user_id: 9001,
        user_type: 1,
      }],
    }))
    const wrapper = mount(CurrentOrderTable, {
      props: { initialKeyword: '9001', request },
    })
    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        cursor: undefined,
        end_time: '',
        keyword: '9001',
        leverage: '',
        maker_only: '',
        margin_mode: '',
        order_status: [],
        order_type: '',
        page_size: 20,
        reduce_only: '',
        side: '',
        start_time: '',
        symbol: '',
        user_type: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.get('[data-mm-component="pro-table"]').attributes('aria-label')).toBe('当前委托数据')
    expect(wrapper.findAll('thead th').map(header => header.text())).toEqual(expect.arrayContaining([
      '用户 UID',
      '委托编号',
      '合约',
      '委托类型',
      '委托价格',
      '委托数量',
      '成交数量',
      '委托状态',
    ]))
    expect(wrapper.text()).toContain('限价 Maker')
    expect(wrapper.text()).toContain('70000.13')
    expect(wrapper.text()).toContain('1.2345')
    expect(wrapper.text()).toContain('部分成交')
    wrapper.unmount()
  })

  it('includes robot filtering only when explicitly enabled', async () => {
    const request = vi.fn(async () => ({ hasMore: false, rows: [] }))
    const wrapper = mount(CurrentOrderTable, { props: { request } })
    await flushPromises()

    const queryBar = wrapper.findComponent(MmQueryBar)
    const userTypeField = () => (queryBar.props('fields') as QueryBarField[])
      .find(field => field.key === 'user_type') as QueryBarSegmentedField | undefined

    expect(userTypeField()?.options).not.toContainEqual({ label: '机器人', value: 3 })
    expect(userTypeField()?.width).toBe(154)

    await wrapper.setProps({ includeRobotUserType: true })
    await flushPromises()

    expect(userTypeField()?.options).toContainEqual({ label: '机器人', value: 3 })
    expect(userTypeField()?.width).toBe(208)

    queryBar.vm.$emit('query', { user_type: 3 })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ user_type: 3 }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    wrapper.unmount()
  })

  it('can hide the user-type column, filter, and request parameter', async () => {
    const request = vi.fn(async (_query: CurrentOrderListQuery) => ({
      hasMore: false,
      rows: [{ order_id: 804, user_id: 9004, user_type: 1 }],
    }))
    const wrapper = mount(CurrentOrderTable, {
      props: { request, showUserType: false },
    })
    await flushPromises()

    const fields = wrapper.findComponent(MmQueryBar).props('fields') as QueryBarField[]
    expect(fields.some(field => field.key === 'user_type')).toBe(false)
    expect(wrapper.findAll('thead th').map(header => header.text())).not.toContain('用户类型')
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('user_type')
    wrapper.unmount()
  })

  it('supports all filters and cursor-stack navigation', async () => {
    const request = vi.fn(async (query: { cursor?: string }) => ({
      hasMore: !query.cursor,
      nextCursor: query.cursor ? null : 'cursor-next',
      rows: [{ order_id: query.cursor ? 802 : 801, user_id: 9001 }],
    }))
    const wrapper = mount(CurrentOrderTable, { props: { request } })
    await flushPromises()

    wrapper.findComponent(MmQueryBar).vm.$emit('query', {
      keyword: 'external-1',
      leverage: '20',
      maker_only: 1,
      margin_mode: 2,
      order_type: 'limit',
      reduce_only: 0,
      side: 'sell',
      symbol: 'btc',
      time_range: ['2026-08-01', '2026-08-02'],
      user_type: 2,
    })
    await flushPromises()

    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        cursor: undefined,
        end_time: '2026-08-02 23:59:59',
        keyword: 'external-1',
        leverage: '20',
        maker_only: 1,
        margin_mode: 2,
        order_type: 'limit',
        reduce_only: 0,
        side: 'sell',
        start_time: '2026-08-01 00:00:00',
        symbol: 'btc',
        user_type: 2,
      }),
      expect.objectContaining({
        filters: expect.objectContaining({ keyword: 'external-1' }),
        signal: expect.any(AbortSignal),
      }),
    )

    await wrapper.get('button[aria-label="下一页"]').trigger('click')
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ cursor: 'cursor-next' }),
      expect.any(Object),
    )

    await wrapper.get('button[aria-label="上一页"]').trigger('click')
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ cursor: undefined }),
      expect.any(Object),
    )
    wrapper.unmount()
  })

  it('supports business slots, actions, reactive initial keyword, and exposed reload', async () => {
    const request = vi.fn(async () => ({
      rows: [{ order_id: 803, symbol: 'ETHUSDT', user_id: 9003 }],
    }))
    const detail = vi.fn()
    const cancel = vi.fn()
    const wrapper = mount(CurrentOrderTable, {
      props: { actions: { cancel, detail }, initialKeyword: '', request },
      slots: {
        'cell-symbol': ({ row }: { row: { symbol: string } }) => `PAIR:${row.symbol}`,
        'cell-user_id': ({ row }: { row: { user_id: number } }) => `UID:${row.user_id}`,
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('PAIR:ETHUSDT')
    expect(wrapper.text()).toContain('UID:9003')
    await wrapper.get('button[aria-label="查看详情 803"]').trigger('click')
    await wrapper.get('button[aria-label="撤销委托 803"]').trigger('click')
    expect(detail).toHaveBeenCalledWith(expect.objectContaining({ order_id: 803 }), expect.any(Object))
    expect(cancel).toHaveBeenCalledWith(expect.objectContaining({ order_id: 803 }), expect.any(Object))

    await wrapper.setProps({ initialKeyword: '9003' })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ keyword: '9003' }),
      expect.any(Object),
    )

    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })
})
