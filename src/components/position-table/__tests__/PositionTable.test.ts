import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import type { QueryBarField, QueryBarSegmentedField } from '../../query-bar'
import PositionTable from '../PositionTable.vue'
import type { PositionListQuery } from '../types'

describe('MmPositionTable', () => {
  it('normalizes the list query and renders market-derived values', async () => {
    const request = vi.fn(async (_query: PositionListQuery) => ({
      rows: [{
        created_at: '2026-08-10 08:00:00',
        entry_price: '100',
        id: 701,
        leverage: 10,
        margin_mode: 1,
        position_side: 'long',
        product_category: 'crypto',
        quantity: '2',
        symbol: 'BTCUSDT',
        user_id: 9001,
        user_type: 1,
      }],
      total: 1,
    }))
    const wrapper = mount(PositionTable, {
      props: {
        initialKeyword: '9001',
        marketPrices: { BTCUSDT: 105 },
        request,
      },
    })
    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        end_time: '',
        keyword: '9001',
        leverage: '',
        margin_mode: '',
        order_by: 'position_id',
        order_dir: 'desc',
        page_no: 1,
        page_size: 20,
        position_side: '',
        start_time: '',
        symbol: '',
        user_type: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.findAll('thead th').map(header => header.text())).toEqual(expect.arrayContaining([
      '用户 UID',
      '仓位 ID',
      '合约',
      '持仓价值(U)',
      '标记价格',
      '未实现盈亏(U)',
      '回报率',
    ]))
    expect(wrapper.text()).toContain('210.00')
    expect(wrapper.text()).toContain('+10.00')
    expect(wrapper.text()).toContain('+47.62%')
    wrapper.unmount()
  })

  it('includes robot filtering only when explicitly enabled', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(PositionTable, { props: { request } })
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
    const request = vi.fn(async (_query: PositionListQuery) => ({
      rows: [{ id: 703, user_id: 9003, user_type: 1 }],
      total: 1,
    }))
    const wrapper = mount(PositionTable, {
      props: { request, showUserType: false },
    })
    await flushPromises()

    const fields = wrapper.findComponent(MmQueryBar).props('fields') as QueryBarField[]
    expect(fields.some(field => field.key === 'user_type')).toBe(false)
    expect(wrapper.findAll('thead th').map(header => header.text())).not.toContain('用户类型')
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('user_type')
    wrapper.unmount()
  })

  it('supports all filters, business slots, actions, and exposed reload', async () => {
    const request = vi.fn(async () => ({
      rows: [{ id: 702, symbol: 'ETHUSDT', user_id: 9002 }],
      total: 1,
    }))
    const detail = vi.fn()
    const close = vi.fn()
    const wrapper = mount(PositionTable, {
      props: { actions: { close, detail }, request },
      slots: {
        'cell-symbol': ({ row }: { row: { symbol: string } }) => `PAIR:${row.symbol}`,
      },
    })
    await flushPromises()

    wrapper.findComponent(MmQueryBar).vm.$emit('query', {
      keyword: 'external-2',
      leverage: '20',
      margin_mode: 2,
      open_time: ['2026-08-01', '2026-08-02'],
      position_side: 'short',
      symbol: 'eth',
      user_type: 2,
    })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        end_time: '2026-08-02 23:59:59',
        keyword: 'external-2',
        leverage: '20',
        margin_mode: 2,
        position_side: 'short',
        start_time: '2026-08-01 00:00:00',
        symbol: 'eth',
        user_type: 2,
      }),
      expect.any(Object),
    )
    expect(wrapper.text()).toContain('PAIR:ETHUSDT')

    await wrapper.get('button[aria-label="查看详情"]').trigger('click')
    await wrapper.get('button[aria-label="平仓"]').trigger('click')
    expect(detail).toHaveBeenCalledWith(expect.objectContaining({ id: 702 }), expect.any(Object))
    expect(close).toHaveBeenCalledWith(expect.objectContaining({ id: 702 }), expect.any(Object))

    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })
})
