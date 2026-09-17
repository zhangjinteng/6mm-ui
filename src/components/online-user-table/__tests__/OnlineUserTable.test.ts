import { flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import type { ProTableColumn } from '../../pro-table'
import { MmQueryBar } from '../../query-bar'
import type { QueryBarField, QueryBarSegmentedField } from '../../query-bar'
import { MmSelect } from '../../select'
import OnlineUserTable from '../OnlineUserTable.vue'
import type { OnlineUserRow } from '../types'

describe('MmOnlineUserTable', () => {
  it('normalizes the initial online-user query and renders returned rows', async () => {
    const request = vi.fn(async () => ({
      rows: [
        {
          agent_user_id: 'external-1',
          last_login_at: '2026-08-08 10:00:00',
          user_id: 9001,
          user_type: 1,
          username: 'alice',
          vip_level: 2,
        },
      ],
      total: 1,
    }))
    const wrapper = mount(OnlineUserTable, { props: { request } })

    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        create_time_end: '',
        create_time_start: '',
        keyword: '',
        order_by: 'last_login_at',
        order_dir: 'desc',
        page_no: 1,
        page_size: 20,
        user_type: '',
        vip_level: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.get('[data-mm-component="pro-table"]').attributes('aria-label')).toBe('在线用户数据')
    expect(wrapper.text()).toContain('alice')
    expect(wrapper.text()).toContain('V2')
    wrapper.unmount()
  })

  it('maps the login-time column key to the backend last-login field when sorting', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(OnlineUserTable, { props: { request } })

    await flushPromises()
    wrapper.findComponent({ name: 'MmProTable' }).vm.$emit('update:sort', {
      key: 'login_time',
      order: 'asc',
    })
    await flushPromises()

    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        order_by: 'last_login_at',
        order_dir: 'asc',
      }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    wrapper.unmount()
  })

  it('supports application-owned business cell slots', async () => {
    const wrapper = mount(OnlineUserTable, {
      props: {
        request: async () => ({ rows: [{ user_id: 9001 }], total: 1 }),
      },
      slots: {
        'cell-user_id': ({ row }: { row: { user_id: number } }) => `UID:${row.user_id}`,
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('UID:9001')
    wrapper.unmount()
  })

  it('supports resolving the default columns and forwards custom business cell slots', async () => {
    const forceLogout = vi.fn()
    const wrapper = mount(OnlineUserTable, {
      props: {
        columns: (defaultColumns: ProTableColumn<OnlineUserRow>[]) => [
          { key: 'id', dataIndex: 'id', title: 'ID', width: 90, hideable: false },
          ...defaultColumns.map(column => column.key === 'vip_level'
            ? { ...column, title: '用户等级(VIP)' }
            : column),
          {
            key: 'agent_relation',
            dataIndex: 'agent_name_parse',
            title: '推荐关系',
            width: 140,
          },
          {
            key: 'actions',
            title: '操作',
            width: 90,
            fixed: 'right',
            hideable: false,
          },
        ],
        request: async () => ({
          rows: [
            {
              agent_name_parse: '代理商 A',
              id: 17,
              user_id: 9001,
              vip_level: 3,
            },
          ],
          total: 1,
        }),
      },
      slots: {
        'cell-actions': ({ row }: { row: { id: number } }) => h(
          'button',
          {
            class: 'force-logout',
            type: 'button',
            onClick: () => forceLogout(row),
          },
          '强制下线',
        ),
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('ID')
    expect(wrapper.text()).toContain('推荐关系')
    expect(wrapper.text()).toContain('用户等级(VIP)')
    expect(wrapper.text()).toContain('代理商 A')
    await wrapper.get('.force-logout').trigger('click')
    expect(forceLogout).toHaveBeenCalledWith(expect.objectContaining({ id: 17 }))
    wrapper.unmount()
  })

  it('reactively adds the optional recommendation filter to the normalized query', async () => {
    const request = vi.fn(async () => ({ rows: [{ agent_id: 10, user_id: 9001 }], total: 1 }))
    const wrapper = mount(OnlineUserTable, {
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
    expect(recommendationSelect?.props('options')?.[0]).toEqual({
      label: '全部推荐关系',
      value: '',
    })

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
    const wrapper = mount(OnlineUserTable, { props: { request } })
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

  it('exposes reload so row actions can refresh the online list', async () => {
    const request = vi.fn(async () => ({ rows: [{ user_id: 9001 }], total: 1 }))
    const wrapper = mount(OnlineUserTable, { props: { request } })

    await flushPromises()
    expect(request).toHaveBeenCalledTimes(1)

    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })
})
