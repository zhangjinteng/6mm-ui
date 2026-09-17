import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import type { QueryBarField, QueryBarSegmentedField } from '../../query-bar'
import { MmSelect } from '../../select'
import UserAssetTable from '../UserAssetTable.vue'
import {
  calculateUserAssetPositionAmount,
  calculateUserAssetUnrealizedPnl,
} from '../formatters'

describe('MmUserAssetTable', () => {
  it('normalizes the initial query and renders asset identity fallbacks', async () => {
    const request = vi.fn(async () => ({
      rows: [
        {
          agent_user_id: 'external-1001',
          available_balance: '875.5',
          nice_name: 'Alice',
          platform_user_id: 101,
          total_margin: '125',
          ua_id: 11,
          user_id: 9001,
          user_type: 1,
          username: 'alice-account',
          wallet_balance: '1000',
        },
        {
          available_balance: 0,
          total_margin: 0,
          ua_id: 12,
          user: { username: 'nested-account', user_type: 2 },
          user_id: 9002,
          wallet_balance: 0,
        },
      ],
      total: 2,
    }))
    const wrapper = mount(UserAssetTable, { props: { request } })

    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        keyword: '',
        order_by: 'ua_id',
        order_dir: 'desc',
        page_no: 1,
        page_size: 20,
        user_type: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.get('[data-mm-component="pro-table"]').attributes('aria-label')).toBe('用户资产数据')
    expect(wrapper.findAll('thead th').map(header => header.text())).toContain('ID')
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('nested-account')
    expect(wrapper.text()).toContain('external-1001')
    expect(wrapper.text()).toContain('1000.00')
    wrapper.unmount()
  })

  it('calculates position value and PnL from host-owned market prices', async () => {
    const row = {
      positions: [
        { entry_price: 100, quantity: 2, side: 'long', symbol: 'BTCUSDT' },
        { entry_price: 200, quantity: 1, position_side: 'short', symbol: 'ETHUSDT' },
        { quantity: 1, symbol: 'SOLUSDT', unrealized_pnl: -5 },
      ],
      total_quantity: { BTCUSDT: 2, ETHUSDT: 1 },
      user_id: 9001,
    }
    const prices = { BTCUSDT: 110, ETHUSDT: 180, SOLUSDT: 20 }

    expect(calculateUserAssetPositionAmount(row, prices)).toBe(400)
    expect(calculateUserAssetUnrealizedPnl(row, prices)).toBe(35)

    const request = vi.fn(async () => ({ rows: [row], total: 1 }))
    const wrapper = mount(UserAssetTable, { props: { marketPrices: prices, request } })
    await flushPromises()

    expect(wrapper.text()).toContain('400.00')
    expect(wrapper.text()).toContain('+35.00')

    await wrapper.setProps({ marketPrices: { ...prices, BTCUSDT: 120 } })
    await flushPromises()
    expect(wrapper.text()).toContain('420.00')
    expect(wrapper.text()).toContain('+55.00')
    wrapper.unmount()
  })

  it('honors explicit aggregate values before calculated fallbacks', () => {
    const row = {
      position_amount: '123.45',
      position_pnl: '-8.5',
      positions: [{ entry_price: 1, quantity: 100, side: 'long', symbol: 'BTCUSDT' }],
      user_id: 9001,
    }

    expect(calculateUserAssetPositionAmount(row, { BTCUSDT: 999 })).toBe(123.45)
    expect(calculateUserAssetUnrealizedPnl(row, { BTCUSDT: 999 })).toBe(-8.5)
    expect(calculateUserAssetPositionAmount({ ...row, position_amount: null, total_quantity: {} }, { BTCUSDT: 2 })).toBe(200)
  })

  it('supports business slots and exposes reload', async () => {
    const request = vi.fn(async () => ({ rows: [{ platform_user_id: 101, user_id: 9001 }], total: 1 }))
    const wrapper = mount(UserAssetTable, {
      props: { request },
      slots: {
        'cell-platform_user_id': ({ row }: { row: { platform_user_id: number } }) => `ID:${row.platform_user_id}`,
        'cell-user_id': ({ row }: { row: { user_id: number } }) => `UID:${row.user_id}`,
        'cell-position_amount': ({ value }: { value: string }) => `AMOUNT:${value}`,
      },
    })

    await flushPromises()
    expect(wrapper.text()).toContain('ID:101')
    expect(wrapper.text()).toContain('UID:9001')
    expect(wrapper.text()).toContain('AMOUNT:0.00')

    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('adds recommendation filtering and the recommendation column when options are supplied', async () => {
    const request = vi.fn(async () => ({
      rows: [{ agent_id: 10, platform_user_id: 101, user_id: 9001 }],
      total: 1,
    }))
    const wrapper = mount(UserAssetTable, {
      props: {
        recommendationOptions: [],
        request,
      },
    })

    await flushPromises()
    expect(wrapper.findAllComponents(MmSelect).some(select =>
      select.props('options')?.some((option: { label?: unknown }) => option.label === '代理 A'),
    )).toBe(false)

    await wrapper.setProps({
      recommendationOptions: [
        { label: '平台用户', value: 0 },
        { label: '代理 A', value: 10 },
      ],
    })
    await flushPromises()

    const queryBar = wrapper.findComponent(MmQueryBar)
    const recommendationSelect = queryBar.findAllComponents(MmSelect).find(select =>
      select.props('options')?.some((option: { label?: unknown }) => option.label === '代理 A'),
    )
    expect(recommendationSelect).toBeDefined()
    expect(wrapper.findAll('thead th').map(header => header.text())).toContain('推荐关系')
    expect(wrapper.text()).toContain('代理 A')

    queryBar.vm.$emit('query', { agent_id: 10 })
    await flushPromises()

    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ agent_id: 10 }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    wrapper.unmount()
  })

  it('includes robot filtering only when explicitly enabled', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(UserAssetTable, { props: { request } })
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

  it('renders and invokes optional deposit and deduct actions', async () => {
    const request = vi.fn(async () => ({
      rows: [{ platform_user_id: 101, user_id: 9001 }],
      total: 1,
    }))
    const deposit = vi.fn(async () => {})
    const deduct = vi.fn(async () => {})
    const wrapper = mount(UserAssetTable, {
      props: {
        actions: { deduct, deposit },
        request,
      },
    })

    await flushPromises()
    await wrapper.get('button[aria-label="充值"]').trigger('click')
    await wrapper.get('button[aria-label="扣减"]').trigger('click')
    await flushPromises()

    expect(deposit).toHaveBeenCalledWith(
      expect.objectContaining({ platform_user_id: 101, user_id: 9001 }),
      expect.objectContaining({ reload: expect.any(Function) }),
    )
    expect(deduct).toHaveBeenCalledWith(
      expect.objectContaining({ platform_user_id: 101, user_id: 9001 }),
      expect.objectContaining({ reload: expect.any(Function) }),
    )
    wrapper.unmount()
  })
})
