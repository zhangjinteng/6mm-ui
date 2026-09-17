import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import SidebarNav from '../SidebarNav.vue'
import type { SidebarNavItem } from '../types'

const items: SidebarNavItem[] = [
  {
    children: [
      { icon: 'layout-dashboard', key: 'user-data', label: '用户数据' },
      { icon: 'wallet-cards', key: 'funds-data', label: '资金数据' },
    ],
    icon: 'layout-dashboard',
    key: 'overview',
    label: '经营总览',
  },
  {
    children: [
      { icon: 'users-round', key: 'online-accounts', label: '在线账户' },
      { icon: 'users', key: 'trading-accounts', label: '用户列表' },
    ],
    icon: 'users',
    key: 'users',
    label: '用户管理',
  },
  {
    children: [{ icon: 'plug-zap', key: 'integration', label: '接入概览' }],
    icon: 'settings-2',
    key: 'config',
    label: '接入配置',
  },
]

describe('MmSidebarNav', () => {
  it('renders brand and footer slots while highlighting the active child and parent', async () => {
    const wrapper = mount(SidebarNav, {
      props: {
        items,
        modelValue: 'online-accounts',
        openKeys: ['users'],
      },
      slots: {
        brand: '<strong data-brand>管理后台</strong>',
        footer: '<span data-footer>在线用户 7,320</span>',
      },
    })

    expect(wrapper.get('[data-mm-component="sidebar-nav"]').classes()).not.toContain('is-collapsed')
    expect(wrapper.get('[data-brand]').text()).toBe('管理后台')
    expect(wrapper.get('[data-footer]').text()).toContain('7,320')
    expect(wrapper.get('[data-sidebar-group="users"]').classes()).toContain('is-active-path')
    expect(wrapper.get('[data-sidebar-item="online-accounts"]').attributes('aria-current')).toBe('page')

    await wrapper.get('[data-sidebar-item="trading-accounts"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['trading-accounts'])
    expect(wrapper.emitted('select')?.at(-1)?.[0]).toMatchObject({ key: 'trading-accounts', label: '用户列表' })
  })

  it('normalizes open groups to the latest key in accordion mode', async () => {
    const wrapper = mount(SidebarNav, {
      props: { accordion: true, items, openKeys: ['users'] },
    })

    await wrapper.get('[data-sidebar-group="config"] .mm-sub-menu__trigger').trigger('click')
    expect(wrapper.emitted('update:openKeys')?.at(-1)).toEqual([['config']])
    expect(wrapper.emitted('open-change')?.at(-1)).toEqual([['config']])
  })

  it('shows icon-only triggers and an accessible child flyout when collapsed', async () => {
    const wrapper = mount(SidebarNav, {
      attachTo: document.body,
      props: { collapsed: true, items, modelValue: 'online-accounts' },
    })

    expect(wrapper.get('[data-mm-component="sidebar-nav"]').classes()).toContain('is-collapsed')
    expect(wrapper.find('.mm-sidebar-nav__expanded-menu').exists()).toBe(false)
    const usersTrigger = wrapper.get('[data-sidebar-collapsed-group="users"]')
    expect(usersTrigger.attributes('aria-label')).toBe('用户管理')

    await usersTrigger.trigger('focusin')
    await nextTick()
    const flyout = document.body.querySelector<HTMLElement>('.mm-sidebar-nav__flyout')
    expect(flyout).not.toBeNull()
    expect(flyout?.textContent).toContain('在线账户')
    expect(flyout?.querySelector('[aria-current="page"]')?.textContent).toContain('在线账户')
  })

  it('renders in a drawer on mobile and closes it after selecting a page', async () => {
    const wrapper = mount(SidebarNav, {
      attachTo: document.body,
      props: {
        items,
        display: 'mobile',
        mobileOpen: true,
        modelValue: 'online-accounts',
        openKeys: ['users'],
      },
      slots: { brand: '<strong>管理后台</strong>' },
    })
    await nextTick()

    const drawer = document.body.querySelector<HTMLElement>('.mm-sidebar-nav__drawer')
    expect(drawer).not.toBeNull()
    const target = drawer?.querySelector<HTMLButtonElement>('[data-sidebar-item="trading-accounts"]')
    target?.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['trading-accounts'])
    expect(wrapper.emitted('update:mobileOpen')?.at(-1)).toEqual([false])
  })
})
