import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import Dropdown from '../Dropdown.vue'

const items = [
  { label: '查看详情', value: 'view' },
  { disabled: true, label: '已停用', value: 'disabled' },
  { label: '导出记录', value: 'export' },
]

describe('MmDropdown', () => {
  it('opens from the fallback trigger, selects an item and closes', async () => {
    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: {
        floatingClass: 'account-dropdown',
        items,
        label: '更多操作',
        teleport: false,
        width: 250,
      },
      slots: { header: '<div data-dropdown-header>账号信息</div>' },
    })
    const trigger = wrapper.get<HTMLButtonElement>('.mm-dropdown__trigger')
    expect(trigger.attributes('aria-haspopup')).toBe('menu')

    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const popover = wrapper.get('.mm-popover__floating')
    expect(popover.classes()).toContain('mm-dropdown__popup')
    expect(popover.classes()).toContain('account-dropdown')
    expect(popover.attributes('role')).toBe('presentation')
    expect(popover.attributes('style')).toContain('width: 250px')
    expect(wrapper.get('[data-dropdown-header]').text()).toBe('账号信息')
    const menu = wrapper.get('.mm-dropdown__menu')
    expect(menu.attributes('role')).toBe('menu')
    expect(window.getComputedStyle(menu.element).scrollbarGutter).toBe('auto')
    await wrapper.findAll('[role="menuitem"]')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['export'])
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ label: '导出记录', value: 'export' })
    expect(trigger.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('opens with ArrowDown and focuses the first enabled menu item', async () => {
    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: { items, label: '操作', teleport: false },
    })
    const trigger = wrapper.get<HTMLButtonElement>('.mm-dropdown__trigger')
    trigger.element.focus()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(wrapper.findAll<HTMLElement>('[role="menuitem"]')[0]!.element)
    wrapper.unmount()
  })
})
