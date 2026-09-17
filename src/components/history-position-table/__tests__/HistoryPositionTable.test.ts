import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import type { QueryBarField, QueryBarSegmentedField } from '../../query-bar'
import HistoryPositionTable from '../HistoryPositionTable.vue'
import type { HistoryPositionListQuery } from '../types'

describe('MmHistoryPositionTable', () => {
  it('normalizes the initial request and renders the history-position columns', async () => {
    const request = vi.fn(async (_query: HistoryPositionListQuery) => ({
      rows: [{
        closed_at: '2026-08-10 08:00:00',
        entry_price: '100',
        id: 701,
        leverage: 10,
        margin_mode: 1,
        max_quantity: '2',
        pnl: '12.5',
        position_side: 'long',
        product_category: 'crypto',
        symbol: 'BTCUSDT',
        trigger_mode: 1,
        user_id: 9001,
        user_type: 1,
      }],
      total: 1,
    }))
    const wrapper = mount(HistoryPositionTable, {
      props: { initialKeyword: '9001', request },
    })
    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        end_time: '',
        keyword: '9001',
        leverage: '',
        margin_mode: '',
        order_by: 'closed_at',
        order_dir: 'desc',
        page_no: 1,
        page_size: 20,
        position_side: '',
        start_time: '',
        status: '',
        symbol: '',
        trigger_mode: '',
        user_type: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.findAll('thead th').map(header => header.text())).toEqual(expect.arrayContaining([
      '用户 UID',
      '仓位 ID',
      '最大持仓数量',
      '开仓成本(U)',
      '平仓价格',
      '已实现盈亏(U)',
      '触发状态',
      '平仓时间',
    ]))
    expect(wrapper.text()).toContain('200.00')
    expect(wrapper.text()).toContain('+12.50')
    wrapper.unmount()
  })

  it('includes robot filtering only when explicitly enabled', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(HistoryPositionTable, { props: { request } })
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
    const request = vi.fn(async (_query: HistoryPositionListQuery) => ({
      rows: [{ id: 703, user_id: 9003, user_type: 1 }],
      total: 1,
    }))
    const wrapper = mount(HistoryPositionTable, {
      props: { request, showUserType: false },
    })
    await flushPromises()

    const fields = wrapper.findComponent(MmQueryBar).props('fields') as QueryBarField[]
    expect(fields.some(field => field.key === 'user_type')).toBe(false)
    expect(wrapper.findAll('thead th').map(header => header.text())).not.toContain('用户类型')
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty('user_type')
    wrapper.unmount()
  })

  it('supports all filters, business slots, detail actions, and exposed reload', async () => {
    const request = vi.fn(async () => ({
      rows: [{ id: 702, symbol: 'ETHUSDT', user_id: 9002 }],
      total: 1,
    }))
    const detail = vi.fn()
    const wrapper = mount(HistoryPositionTable, {
      props: { actions: { detail }, request },
      slots: {
        'cell-symbol': ({ row }: { row: { symbol: string } }) => `PAIR:${row.symbol}`,
      },
    })
    await flushPromises()

    wrapper.findComponent(MmQueryBar).vm.$emit('query', {
      keyword: 'external-2',
      leverage: '20',
      margin_mode: 2,
      position_side: 'short',
      status: 4,
      symbol: 'eth',
      time_range: ['2026-08-01', '2026-08-02'],
      trigger_mode: 3,
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
        status: 4,
        symbol: 'eth',
        trigger_mode: 3,
        user_type: 2,
      }),
      expect.any(Object),
    )
    expect(wrapper.text()).toContain('PAIR:ETHUSDT')

    await wrapper.get('button[aria-label="查看详情"]').trigger('click')
    expect(detail).toHaveBeenCalledWith(expect.objectContaining({ id: 702 }), expect.any(Object))

    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })
})
