import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import { MmDateRangePicker } from '../../date-range-picker'
import QueryBar from '../QueryBar.vue'
import type { QueryBarField, QueryBarValue } from '../types'
import { createQueryBarValue, materializeQueryBarValue } from '../value'

const fields: QueryBarField[] = [
  { key: 'keyword', label: '关键词', placeholder: '账号 / UID', type: 'keyword' },
  {
    key: 'level',
    label: '用户等级',
    options: [{ label: '普通', value: 'normal' }, { label: 'VIP', value: 'vip' }],
    type: 'select',
  },
  { key: 'coin', label: '币种', options: ['USDT', 'BTC'], type: 'coin' },
  { key: 'createdAt', label: '创建日期', type: 'date-range' },
  {
    defaultValue: 'all',
    key: 'status',
    label: '状态',
    options: [{ label: '全部', value: 'all' }, { label: '在线', value: 'online' }],
    type: 'segmented',
  },
]

describe('MmQueryBar', () => {
  it('creates fresh schema defaults and materializes missing fields', () => {
    const schema: QueryBarField[] = [
      { key: 'keyword', label: '关键词', type: 'keyword' },
      { defaultValue: ['2026-07-01', '2026-07-17'], key: 'range', label: '日期', type: 'date-range' },
      {
        defaultValue: 'all',
        key: 'status',
        label: '状态',
        options: ['all', 'online'],
        type: 'segmented',
      },
    ]
    const first = createQueryBarValue(schema)
    const second = createQueryBarValue(schema)

    expect(first).toEqual({ keyword: '', range: ['2026-07-01', '2026-07-17'], status: 'all' })
    ;(first.range as [string, string])[0] = 'changed-outside'
    expect(second.range).toEqual(['2026-07-01', '2026-07-17'])
    expect(materializeQueryBarValue({ keyword: 'alice', pageScope: 'online' }, schema)).toEqual({
      keyword: 'alice',
      pageScope: 'online',
      range: ['2026-07-01', '2026-07-17'],
      status: 'all',
    })
  })

  it('renders the supported query controls with accessible names', () => {
    const wrapper = mount(QueryBar, { props: { fields } })

    expect(wrapper.get('form').attributes('role')).toBe('search')
    expect(wrapper.findAll('[data-query-field]')).toHaveLength(5)
    expect(wrapper.get('[data-query-field="keyword"] input').attributes('id')).toBeTruthy()
    expect(wrapper.get('[data-query-field="coin"] input').attributes('id')).toBeTruthy()
    expect(wrapper.get('[data-query-field="createdAt"] input').attributes('id')).toBeTruthy()
    expect(wrapper.get('[data-query-field="level"] [role="combobox"]').attributes('aria-labelledby')).toBeTruthy()
    expect(wrapper.get('[data-query-field="status"] [role="radiogroup"]').attributes('aria-labelledby')).toBeTruthy()
    expect(wrapper.findAll('[data-query-label]').map((item) => item.text())).toEqual([
      '关键词',
      '用户等级',
      '币种',
      '创建日期',
      '状态',
    ])
  })

  it('updates draft fields, normalizes coin input, and emits an immutable query snapshot', async () => {
    const wrapper = mount(QueryBar, { props: { fields } })

    await wrapper.get('[data-query-field="keyword"] input').setValue('alice')
    await wrapper.get('[data-query-field="coin"] input').setValue('usdt')
    wrapper.findComponent(MmDateRangePicker).vm.$emit('update:modelValue', ['2026-07-01', '2026-07-17'])
    await nextTick()
    await wrapper.get('[data-query-field="status"] [role="radio"]:last-child').trigger('click')
    await wrapper.get('form').trigger('submit')

    expect((wrapper.get('[data-query-field="coin"] input').element as HTMLInputElement).value).toBe('USDT')
    const snapshot = wrapper.emitted('query')?.at(-1)?.[0] as Record<string, unknown>
    expect(snapshot).toEqual({
      coin: 'USDT',
      createdAt: ['2026-07-01', '2026-07-17'],
      keyword: 'alice',
      level: '',
      status: 'online',
    })

    ;(snapshot.createdAt as string[])[0] = 'changed-outside'
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('query')?.at(-1)?.[0]).toMatchObject({ createdAt: ['2026-07-01', '2026-07-17'] })
  })

  it('resets to fresh schema defaults and reports field changes', async () => {
    const defaults: QueryBarField[] = [
      { defaultValue: 'seed', key: 'keyword', label: '关键词', type: 'keyword' },
      { key: 'range', label: '日期', type: 'date-range' },
      {
        defaultValue: 'enabled',
        key: 'status',
        label: '状态',
        options: ['enabled', 'disabled'],
        type: 'segmented',
      },
    ]
    const wrapper = mount(QueryBar, { props: { fields: defaults } })

    await wrapper.get('[data-query-field="keyword"] input').setValue('changed')
    expect(wrapper.emitted('change')?.at(-1)?.slice(1)).toEqual([
      expect.objectContaining({ key: 'keyword' }),
      'changed',
    ])

    await wrapper.get('[data-query-action="reset"]').trigger('click')
    expect(wrapper.emitted('reset')?.at(-1)?.[0]).toEqual({
      keyword: 'seed',
      range: null,
      status: 'enabled',
    })
    expect((wrapper.get('[data-query-field="keyword"] input').element as HTMLInputElement).value).toBe('seed')
  })

  it('supports controlled values while preserving page-owned keys', async () => {
    const wrapper = mount(QueryBar, {
      props: {
        fields: [{ key: 'keyword', label: '关键词', type: 'keyword' }],
        modelValue: { keyword: 'seed', pageScope: 'online-accounts' },
      },
    })

    await wrapper.get('input').setValue('alice')
    const nextValue = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as QueryBarValue
    expect(nextValue).toEqual({ keyword: 'alice', pageScope: 'online-accounts' })

    await wrapper.setProps({ modelValue: nextValue })
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('alice')
  })

  it('supports per-field and trailing action slots', () => {
    const wrapper = mount(QueryBar, {
      props: {
        fields: [{ key: 'custom', label: '自定义', type: 'keyword' }],
      },
      slots: {
        actions: '<button data-extra-action type="button">导出</button>',
        'field-custom': '<span data-custom-field>自定义筛选</span>',
      },
    })

    expect(wrapper.get('[data-custom-field]').text()).toBe('自定义筛选')
    expect(wrapper.get('[data-extra-action]').text()).toBe('导出')
  })

  it('removes fields right-to-left before removing actions left-to-right', async () => {
    const wrapper = mount(QueryBar, {
      props: {
        fields: [
          { key: 'keyword', label: '关键词', type: 'keyword' },
          {
            key: 'status',
            label: '状态',
            options: [{ label: '全部', value: 'all' }, { label: '在线', value: 'online' }],
            type: 'select',
          },
        ],
        returnContext: { label: '123', route: '/orders' },
        singleLine: true,
      },
      slots: {
        buttons: `
          <button data-query-action="query" type="submit">查询</button>
          <button data-query-action="reset" type="button">重置</button>
          <button data-low-priority-action type="button">低频操作</button>
        `,
      },
    })
    const root = wrapper.get('.mm-query-bar').element
    const fieldsElement = wrapper.get('.mm-query-bar__fields').element
    const track = wrapper.get('.mm-query-bar__action-track').element
    let availableWidth = 310
    Object.defineProperty(root, 'clientWidth', { configurable: true, get: () => availableWidth })
    Object.defineProperty(fieldsElement, 'scrollWidth', {
      configurable: true,
      get: () => 40 + wrapper.findAll('[data-query-field]')
        .filter((item) => !(item.element as HTMLElement).hidden)
        .length * 60,
    })
    Object.defineProperty(track, 'scrollWidth', {
      configurable: true,
      get: () => wrapper.findAll('.mm-query-bar__action-track > button')
        .filter((item) => !(item.element as HTMLElement).hidden)
        .length * 60,
    })

    await wrapper.setProps({ loading: true })
    await nextTick()

    expect((wrapper.get('[data-action="return-context"]').element as HTMLElement).hidden).toBe(false)
    expect((wrapper.get('[data-query-field="keyword"]').element as HTMLElement).hidden).toBe(false)
    expect((wrapper.get('[data-query-field="status"]').element as HTMLElement).hidden).toBe(true)
    expect((wrapper.get('[data-query-action="query"]').element as HTMLElement).hidden).toBe(false)
    expect((wrapper.get('[data-query-action="reset"]').element as HTMLElement).hidden).toBe(false)
    expect((wrapper.get('[data-low-priority-action]').element as HTMLElement).hidden).toBe(false)

    availableWidth = 190
    await wrapper.setProps({ loading: false })
    await nextTick()

    expect((wrapper.get('[data-action="return-context"]').element as HTMLElement).hidden).toBe(false)
    expect((wrapper.get('[data-query-field="keyword"]').element as HTMLElement).hidden).toBe(true)
    expect((wrapper.get('[data-query-field="status"]').element as HTMLElement).hidden).toBe(true)
    expect((wrapper.get('[data-query-action="query"]').element as HTMLElement).hidden).toBe(true)
    expect((wrapper.get('[data-query-action="reset"]').element as HTMLElement).hidden).toBe(false)
    expect((wrapper.get('[data-low-priority-action]').element as HTMLElement).hidden).toBe(false)
  })

  it('renders and emits an optional return context', async () => {
    const returnContext = {
      label: '合约成交',
      route: '/admin/positionManage/tradeFills?keyword=1001',
    }
    const wrapper = mount(QueryBar, {
      props: {
        fields: [{ key: 'keyword', label: '关键词', type: 'keyword' }],
        returnContext,
      },
    })

    const button = wrapper.get('[data-action="return-context"]')
    expect(button.text()).toBe('返回合约成交')
    expect(button.attributes('aria-label')).toBe('返回合约成交')
    expect(button.attributes('title')).toBe('返回合约成交，恢复原筛选、分页和浏览位置')

    await button.trigger('click')
    expect(wrapper.emitted('return-context')?.at(-1)).toEqual([returnContext])

    await wrapper.setProps({ returnContext: undefined })
    expect(wrapper.find('[data-action="return-context"]').exists()).toBe(false)
  })

  it('propagates disabled and loading states to controls and actions', () => {
    const wrapper = mount(QueryBar, {
      props: {
        disabled: true,
        fields,
        loading: true,
      },
    })

    expect(wrapper.get('form').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[data-query-field="keyword"] input').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-query-field="level"] [role="combobox"]').attributes('aria-disabled')).toBe('true')
    expect(wrapper.get('[data-query-field="status"] [role="radio"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-query-action="reset"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-query-action="query"]').attributes('disabled')).toBeDefined()
  })
})
