import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import type { QueryBarField, QueryBarSegmentedField } from '../../query-bar'
import LiquidationTable from '../LiquidationTable.vue'
import type { LiquidationListQuery } from '../types'

describe('MmLiquidationTable', () => {
  it('normalizes list filters and renders the default liquidation columns', async () => {
    const request = vi.fn(async (_query: LiquidationListQuery) => ({
      rows: [{
        average_execution_price: '64976.2',
        leverage: 150,
        liquidation_fee: '0',
        liquidation_quantity: '2.23',
        margin_mode: 2,
        occurred_at: '2026-08-10 06:14:26',
        position_id: 10019033,
        position_side: 'long',
        product_category: 'crypto',
        symbol: 'BTCUSDT',
        user_id: 9117305547,
        user_type: 1,
      }],
      total: 1,
    }))
    const wrapper = mount(LiquidationTable, {
      props: { initialKeyword: '10019033', request },
    })
    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        end_time: '',
        keyword: '10019033',
        order_by: 'occurred_at',
        order_dir: 'desc',
        page_no: 1,
        page_size: 20,
        position_side: '',
        product_category: '',
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
      '强平数量',
      '平均执行价',
      '强平费(U)',
      '发生时间',
    ]))
    expect(wrapper.text()).toContain('2.23')
    expect(wrapper.text()).toContain('64,976.20')
    expect(wrapper.text()).toContain('0.00')
    wrapper.unmount()
  })

  it('includes robot filtering only when explicitly enabled', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(LiquidationTable, { props: { request } })
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

  it('hides user type and omits it from requests when disabled', async () => {
    const request = vi.fn(async (_query: LiquidationListQuery) => ({
      rows: [{ position_id: 10117707, user_id: 9002, user_type: 1 }],
      total: 1,
    }))
    const wrapper = mount(LiquidationTable, {
      props: { request, showUserType: false },
    })
    await flushPromises()

    const fields = wrapper.findComponent(MmQueryBar).props('fields') as QueryBarField[]
    expect(fields.some(field => field.key === 'user_type')).toBe(false)
    expect(wrapper.findAll('thead th').map(header => header.text())).not.toContain('用户类型')
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('user_type')
    wrapper.unmount()
  })

  it('uses dynamic product category options supplied by the host', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(LiquidationTable, {
      props: {
        productCategoryOptions: [{ label: '大宗商品', value: 'commodity' }],
        request,
      },
    })
    await flushPromises()

    const categoryField = (wrapper.findComponent(MmQueryBar).props('fields') as QueryBarField[])
      .find(field => field.key === 'product_category') as QueryBarSegmentedField | undefined
    expect(categoryField?.options).toEqual([
      { label: '全部', value: '' },
      { label: '大宗商品', value: 'commodity' },
    ])
    wrapper.unmount()
  })

  it('supports all filters, business slots, actions, and exposed reload', async () => {
    const request = vi.fn(async () => ({
      rows: [{ position_id: 10117706, symbol: 'BNBUSDT', user_id: 5176291126 }],
      total: 1,
    }))
    const detail = vi.fn()
    const trades = vi.fn()
    const wrapper = mount(LiquidationTable, {
      props: { actions: { detail, trades }, request },
      slots: {
        'cell-symbol': ({ row }: { row: { symbol: string } }) => `PAIR:${row.symbol}`,
      },
    })
    await flushPromises()

    wrapper.findComponent(MmQueryBar).vm.$emit('query', {
      keyword: 'external-2',
      position_side: 'short',
      product_category: 'tradfi',
      symbol: 'tsla',
      time_range: ['2026-08-01', '2026-08-02'],
      user_type: 2,
    })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        end_time: '2026-08-02 23:59:59',
        keyword: 'external-2',
        position_side: 'short',
        product_category: 'tradfi',
        start_time: '2026-08-01 00:00:00',
        symbol: 'tsla',
        user_type: 2,
      }),
      expect.any(Object),
    )
    expect(wrapper.text()).toContain('PAIR:BNBUSDT')

    await wrapper.get('button[title="查看详情"]').trigger('click')
    await wrapper.get('button[title="查看成交记录"]').trigger('click')
    expect(detail).toHaveBeenCalledWith(expect.objectContaining({ position_id: 10117706 }), expect.any(Object))
    expect(trades).toHaveBeenCalledWith(expect.objectContaining({ position_id: 10117706 }), expect.any(Object))

    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })
})
