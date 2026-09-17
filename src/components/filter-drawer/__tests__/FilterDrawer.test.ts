import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import FilterDrawer from '../FilterDrawer.vue'
import type { QueryBarField, QueryBarValue } from '../../query-bar'

const fields: QueryBarField[] = [
  { key: 'keyword', label: '关键词', placeholder: '用户 UID / 用户名 / IP', type: 'keyword' },
  {
    defaultValue: 'all',
    key: 'status',
    label: '用户类型',
    options: [
      { label: '全部', value: 'all' },
      { label: '实盘', value: 'live' },
      { label: '内盘', value: 'internal' },
    ],
    type: 'segmented',
  },
]

afterEach(() => {
  document.body.style.overflow = ''
  document.querySelectorAll('[data-mm-component="drawer"]').forEach((element) => element.remove())
})

describe('MmFilterDrawer', () => {
  it('renders an accessible filter trigger, active count, and schema-driven drawer', async () => {
    const wrapper = mount(FilterDrawer, {
      attachTo: document.body,
      props: {
        fields,
        modelValue: { keyword: 'alice', status: 'all' },
        subtitle: '在线账户',
      },
    })

    const trigger = wrapper.get('[data-filter-drawer-trigger]')
    expect(trigger.attributes('aria-label')).toBe('更多筛选在线账户，已启用 1 项')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('.mm-badge__content').text()).toBe('1')
    expect(trigger.get('path').attributes('d')).toBe('M4 5h16M7 12h10M10 19h4')

    await trigger.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const drawer = document.body.querySelector<HTMLElement>('[data-mm-component="drawer"]')
    expect(drawer?.textContent).toContain('在线账户 · 2 个筛选项')
    expect((drawer?.querySelector('[data-query-field="keyword"] input') as HTMLInputElement).value).toBe('alice')
  })

  it('keeps edits private and discards them when the drawer closes', async () => {
    const wrapper = mount(FilterDrawer, {
      attachTo: document.body,
      props: { fields, modelValue: { keyword: 'alice', status: 'all' } },
    })

    await wrapper.get('[data-filter-drawer-trigger]').trigger('click')
    await nextTick()
    const input = document.body.querySelector<HTMLInputElement>('[data-query-field="keyword"] input')!
    input.value = 'changed'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    document.body.querySelector<HTMLElement>('.mm-dialog__close')?.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('[data-filter-drawer-trigger]').trigger('click')
    await nextTick()
    expect(document.body.querySelector<HTMLInputElement>('[data-query-field="keyword"] input')?.value).toBe('alice')
  })

  it('commits query and reset snapshots, then closes the drawer', async () => {
    const wrapper = mount(FilterDrawer, {
      attachTo: document.body,
      props: { fields, modelValue: { keyword: 'alice', status: 'live' } },
    })

    await wrapper.get('[data-filter-drawer-trigger]').trigger('click')
    await nextTick()
    const input = document.body.querySelector<HTMLInputElement>('[data-query-field="keyword"] input')!
    input.value = 'bob'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    document.body.querySelector<HTMLElement>('[data-filter-drawer-action="query"]')?.click()
    await nextTick()

    const queried = wrapper.emitted('query')?.at(-1)?.[0] as QueryBarValue
    expect(queried).toEqual({ keyword: 'bob', status: 'live' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([queried])
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    expect(document.body.querySelector('[data-mm-component="drawer"]')).toBeNull()

    await wrapper.get('[data-filter-drawer-trigger]').trigger('click')
    await nextTick()
    document.body.querySelector<HTMLElement>('[data-filter-drawer-action="reset"]')?.click()
    await nextTick()

    const reset = wrapper.emitted('reset')?.at(-1)?.[0] as QueryBarValue
    expect(reset).toEqual({ keyword: '', status: 'all' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([reset])
    expect(document.body.querySelector('[data-mm-component="drawer"]')).toBeNull()
  })

  it('supports custom trigger and query field slots', async () => {
    const wrapper = mount(FilterDrawer, {
      attachTo: document.body,
      props: { fields, modelValue: { keyword: '', status: 'all' } },
      slots: {
        trigger: ({ activeCount, open }: { activeCount: number, open: () => void }) => h(
          'button',
          { 'data-custom-trigger': '', onClick: open, type: 'button' },
          `OPEN ${activeCount}`,
        ),
        'field-keyword': ({ update }: { update: (value: string) => void }) => h(
          'button',
          { 'data-custom-field': '', onClick: () => update('custom'), type: 'button' },
          '自定义关键词',
        ),
      },
    })

    await wrapper.get('[data-custom-trigger]').trigger('click')
    await nextTick()
    document.body.querySelector<HTMLElement>('[data-custom-field]')?.click()
    await nextTick()
    document.body.querySelector<HTMLElement>('[data-filter-drawer-action="query"]')?.click()
    await nextTick()

    expect(wrapper.emitted('query')?.at(-1)?.[0]).toEqual({ keyword: 'custom', status: 'all' })
  })
})
