import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import type { QueryBarField, QueryBarSegmentedField } from '../../query-bar'
import TradeFillTable from '../TradeFillTable.vue'
import type { TradeFillListQuery } from '../types'

describe('MmTradeFillTable', () => {
  it('normalizes filters and renders the default trade-fill columns', async () => {
    const request = vi.fn(async (_query: TradeFillListQuery) => ({
      rows: [{
        agent_user_id: 'user-1001',
        fill_id: 192990,
        handling_fee: '72.448463',
        order_id: 101331223,
        position: { margin_mode: 2 },
        position_id: 10019033,
        price: '64976.2',
        product_category: 'crypto',
        quantity: '2.23',
        realized_pnl: '-70.022',
        role_type: 'taker',
        side: 'buy',
        symbol: 'BTCUSDT',
        trade_time: '2026-08-10 06:14:26',
        trade_value: '144896.926',
        user_id: 9117305547,
        user_type: 1,
      }],
      total: 1,
    }))
    const wrapper = mount(TradeFillTable, { props: { initialKeyword: '101331223', request } })
    await flushPromises()

    expect(request).toHaveBeenCalledWith({
      end_time: '',
      keyword: '101331223',
      margin_mode: '',
      order_by: 'trade_time',
      order_dir: 'desc',
      page_no: 1,
      page_size: 20,
      role_type: '',
      side: '',
      start_time: '',
      symbol: '',
      user_type: '',
    }, expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(wrapper.findAll('thead th').map(header => header.text())).toEqual(expect.arrayContaining([
      '订单号', '用户 UID', '外部用户 ID', '仓位编号', '合约', '成交数量', '手续费(U)', '已实现盈利(U)', '成交时间',
    ]))
    expect(wrapper.text()).toContain('2.23')
    expect(wrapper.text()).toContain('Taker')
    expect(wrapper.text()).toContain('-70.02200000')
    wrapper.unmount()
  })

  it('includes robot filtering only when explicitly enabled', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(TradeFillTable, { props: { request } })
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
    const request = vi.fn(async (_query: TradeFillListQuery) => ({
      rows: [{ fill_id: 11, user_id: 9002, user_type: 1 }],
      total: 1,
    }))
    const wrapper = mount(TradeFillTable, {
      props: { request, showUserType: false },
    })
    await flushPromises()

    const fields = wrapper.findComponent(MmQueryBar).props('fields') as QueryBarField[]
    expect(fields.some(field => field.key === 'user_type')).toBe(false)
    expect(wrapper.findAll('thead th').map(header => header.text())).not.toContain('用户类型')
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('user_type')
    wrapper.unmount()
  })

  it('supports all filters, business slots, detail action, and reload', async () => {
    const request = vi.fn(async () => ({ rows: [{ fill_id: 10, symbol: 'BNBUSDT' }], total: 1 }))
    const detail = vi.fn()
    const wrapper = mount(TradeFillTable, {
      props: { actions: { detail }, request },
      slots: { 'cell-symbol': ({ row }: { row: { symbol: string } }) => `PAIR:${row.symbol}` },
    })
    await flushPromises()

    wrapper.findComponent(MmQueryBar).vm.$emit('query', {
      keyword: 'external-2',
      margin_mode: 2,
      role_type: 'maker',
      side: 'sell',
      symbol: 'tsla',
      time_range: ['2026-08-01', '2026-08-02'],
      user_type: 2,
    })
    await flushPromises()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({
      end_time: '2026-08-02 23:59:59',
      keyword: 'external-2',
      margin_mode: 2,
      role_type: 'maker',
      side: 'sell',
      start_time: '2026-08-01 00:00:00',
      symbol: 'tsla',
      user_type: 2,
    }), expect.any(Object))
    expect(wrapper.text()).toContain('PAIR:BNBUSDT')

    await wrapper.get('button[title="查看详情"]').trigger('click')
    expect(detail).toHaveBeenCalledWith(expect.objectContaining({ fill_id: 10 }), expect.any(Object))
    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })

  it('shows only the spinner while the detail action is loading', async () => {
    let resolveDetail!: () => void
    const detail = vi.fn(() => new Promise<void>((resolve) => {
      resolveDetail = resolve
    }))
    const request = vi.fn(async () => ({ rows: [{ fill_id: 10, symbol: 'BNBUSDT' }], total: 1 }))
    const wrapper = mount(TradeFillTable, {
      props: { actions: { detail }, request },
    })
    await flushPromises()

    const detailButton = wrapper.get('button[title="查看详情"]')
    await detailButton.trigger('click')

    expect(detailButton.attributes('aria-busy')).toBe('true')
    expect(detailButton.find('.mm-button__spinner').exists()).toBe(true)
    expect(detailButton.find('.mm-icon').exists()).toBe(false)
    expect(detailButton.find('.mm-button__label').exists()).toBe(false)

    resolveDetail()
    await flushPromises()

    expect(detailButton.attributes('aria-busy')).toBeUndefined()
    expect(detailButton.find('.mm-button__spinner').exists()).toBe(false)
    expect(detailButton.find('.mm-icon').exists()).toBe(true)
    wrapper.unmount()
  })
})
