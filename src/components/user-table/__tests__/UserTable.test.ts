import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import type { QueryBarField, QueryBarSegmentedField } from '../../query-bar'
import { MmSelect } from '../../select'
import UserTable from '../UserTable.vue'

describe('MmUserTable', () => {
  it('normalizes the initial query and renders returned users', async () => {
    const request = vi.fn(async () => ({
      rows: [
        {
          agent_user_id: 'user-1001',
          created_at: '2026-08-08 10:00:00',
          nice_name: 'Alice',
          user_id: 9001,
          user_type: 1,
          username: 'alice',
          vip_level: 2,
        },
      ],
      total: 1,
    }))
    const wrapper = mount(UserTable, { props: { request } })

    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        create_time_end: '',
        create_time_start: '',
        keyword: '',
        order_by: 'created_at',
        order_dir: 'desc',
        page_no: 1,
        page_size: 20,
        user_type: '',
        vip_level: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.get('[data-mm-component="pro-table"]').attributes('aria-label')).toBe('用户列表数据')
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('V2')
    wrapper.unmount()
  })

  it('supports host-owned business slots and exposes reload', async () => {
    const request = vi.fn(async () => ({ rows: [{ user_id: 9001 }], total: 1 }))
    const wrapper = mount(UserTable, {
      props: { request },
      slots: {
        'cell-user_id': ({ row }: { row: { user_id: number } }) => `UID:${row.user_id}`,
        'query-actions': () => '默认用户类型',
      },
    })

    await flushPromises()
    expect(wrapper.text()).toContain('UID:9001')
    expect(wrapper.text()).toContain('默认用户类型')

    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('prefers nice name, then username, and finally a dash', async () => {
    const request = vi.fn(async () => ({
      rows: [
        { nice_name: '昵称优先', user_id: 9001, username: 'account-one' },
        { nice_name: '', user_id: 9002, username: 'account-two' },
        { nice_name: null, user_id: 9003, username: '' },
      ],
      total: 3,
    }))
    const wrapper = mount(UserTable, { props: { request } })

    await flushPromises()

    const usernameCells = wrapper.findAll('tbody tr td:nth-child(2)')
    expect(usernameCells.map(cell => cell.text())).toEqual(['昵称优先', 'account-two', '-'])
    wrapper.unmount()
  })

  it('reactively adds the optional recommendation filter to the normalized query', async () => {
    const request = vi.fn(async () => ({ rows: [{ agent_id: 10, user_id: 9001 }], total: 1 }))
    const wrapper = mount(UserTable, {
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
    const selects = queryBar.findAllComponents(MmSelect)
    const recommendationSelect = selects.find(select =>
      select.props('options')?.some((option: { label?: unknown }) => option.label === '代理 A'),
    )
    expect(recommendationSelect).toBeDefined()
    expect(queryBar.get('[data-query-field="agent_id"] .mm-select__value').text()).toBe('推荐关系：全部')
    expect(queryBar.get('[data-query-field="vip_level"] .mm-select__value').text()).toBe('VIP 等级：全部')
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
    const wrapper = mount(UserTable, { props: { request } })
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

  it('renders and invokes optional cancel-order and close-position actions', async () => {
    const request = vi.fn(async () => ({ rows: [{ user_id: 9001 }], total: 1 }))
    const cancelAllOrders = vi.fn(async () => {})
    const closeAllPositions = vi.fn(async () => {})
    const wrapper = mount(UserTable, {
      props: {
        actions: { cancelAllOrders, closeAllPositions },
        request,
      },
    })

    await flushPromises()
    await wrapper.get('button[aria-label="全部撤单"]').trigger('click')
    await wrapper.get('button[aria-label="全部平仓"]').trigger('click')
    await flushPromises()

    expect(cancelAllOrders).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 9001 }),
      expect.objectContaining({ reload: expect.any(Function) }),
    )
    expect(closeAllPositions).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 9001 }),
      expect.objectContaining({ reload: expect.any(Function) }),
    )
    wrapper.unmount()
  })
})
