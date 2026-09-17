import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import AppHeader from '../AppHeader.vue'
import type { AppHeaderAction, AppHeaderMetric, AppHeaderProfileItem } from '../types'

const metrics: AppHeaderMetric[] = [
  { key: 'available', label: '可用', value: '9,787,646.35' },
  { key: 'occupied', label: '占用', value: '162,124.99' },
  { key: 'total', label: '总保证金', tone: 'primary', value: '9,949,771.34' },
]

const contextActions: AppHeaderAction[] = [
  { icon: 'triangle-alert', key: 'guarantee', label: '保证金不足', tone: 'warning' },
  { icon: 'arrow-up-to-line', key: 'deposit', label: '充值', tone: 'primary' },
]

const profileItems: AppHeaderProfileItem[] = [
  { icon: 'user', key: 'personal-center', label: '个人中心' },
  { icon: 'key-round', key: 'change-password', label: '修改密码' },
  { icon: 'logout', key: 'logout', label: '退出登录', tone: 'danger' },
]

const brand = {
  alt: '6MM',
  logo: '/logo.svg',
  title: '管理后台',
}

describe('MmAppHeader', () => {
  it('opens the account dropdown from the native avatar trigger and emits profile selections', async () => {
    const wrapper = mount(AppHeader, {
      attachTo: document.body,
      props: {
        display: 'desktop',
        profile: {
          alt: '管理员',
          email: 'ops@alphaembed.com',
          fallback: '管',
          items: profileItems,
        },
      },
    })

    const trigger = wrapper.get<HTMLButtonElement>('[data-app-header-profile]')
    expect(trigger.classes()).not.toContain('mm-button')
    expect(trigger.get('.mm-avatar').element.parentElement).toBe(trigger.element)

    await trigger.trigger('click')
    await nextTick()

    const menu = document.body.querySelector<HTMLElement>('.mm-app-header__profile-popover')!
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(menu.textContent).toContain('管理员')
    expect(menu.textContent).toContain('ops@alphaembed.com')
    expect(menu.querySelectorAll('[role="menuitem"]')).toHaveLength(3)
    expect(menu.querySelector('[data-app-header-profile-item="logout"]')?.classList).toContain('is-danger')

    menu.querySelector<HTMLButtonElement>('[data-app-header-profile-item="personal-center"]')!.click()
    await nextTick()

    expect(wrapper.emitted('profile-select')?.at(-1)?.[0]).toEqual(profileItems[0])
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.body.querySelector('.mm-app-header__profile-popover')).toBeNull()
    wrapper.unmount()
  })

  it('renders the desktop console summary and emits business actions without owning them', async () => {
    const wrapper = mount(AppHeader, {
      props: {
        brand,
        contextActions,
        display: 'desktop',
        identity: { label: '商户', tone: 'merchant' },
        metrics,
        pageTitle: '在线账户',
        profile: { alt: '管理员', fallback: '管' },
        summaryLabel: '商户保证金数据',
      },
    })

    expect(wrapper.get('[data-mm-component="app-header"]').attributes('data-app-header-mode')).toBe('desktop')
    expect(wrapper.get('[aria-label="商户保证金数据"]').text()).toContain('9,949,771.34')
    expect(wrapper.get('[data-app-header-metric="total"]').classes()).toContain('is-primary')
    expect(wrapper.get('[data-app-header-action="guarantee"]').text()).toContain('保证金不足')
    expect(wrapper.get('[data-app-header-action="deposit"]').text()).toContain('充值')

    await wrapper.get('[data-app-header-action="deposit"]').trigger('click')
    expect(wrapper.emitted('action')?.at(-1)?.[0]).toMatchObject({ key: 'deposit', tone: 'primary' })

    await wrapper.get('[data-app-header-identity]').trigger('click')
    const profileButton = wrapper.get('[data-app-header-profile]')
    expect(profileButton.classes()).not.toContain('mm-button')
    expect(profileButton.get('.mm-avatar').element.parentElement).toBe(profileButton.element)
    await profileButton.trigger('click')
    expect(wrapper.emitted('identity-click')).toHaveLength(1)
    expect(wrapper.emitted('profile-click')).toHaveLength(1)
  })

  it('provides uncontrolled sidebar and theme state while emitting model updates', async () => {
    const wrapper = mount(AppHeader, { props: { display: 'desktop' } })
    const sidebarToggle = wrapper.get('[data-app-header-toggle="sidebar"]')

    expect(sidebarToggle.attributes('aria-label')).toBe('收起菜单')
    expect(wrapper.get('[data-mm-component="app-header"]').attributes('data-app-header-theme')).toBe('light')

    await sidebarToggle.trigger('click')
    expect(sidebarToggle.attributes('aria-label')).toBe('展开菜单')
    expect(wrapper.emitted('update:sidebarCollapsed')?.at(-1)).toEqual([true])
    expect(wrapper.emitted('toggle-sidebar')?.at(-1)).toEqual([true])

    await wrapper.get('[data-app-header-toggle="theme"]').trigger('click')
    expect(wrapper.get('[data-mm-component="app-header"]').attributes('data-app-header-theme')).toBe('dark')
    expect(wrapper.emitted('update:theme')?.at(-1)).toEqual(['dark'])
    expect(wrapper.emitted('theme-change')?.at(-1)).toEqual(['dark'])
  })

  it('keeps controlled state stable until the parent sends the next value', async () => {
    const wrapper = mount(AppHeader, {
      props: {
        display: 'desktop',
        sidebarCollapsed: false,
        theme: 'light',
      },
    })

    await wrapper.get('[data-app-header-toggle="sidebar"]').trigger('click')
    await wrapper.get('[data-app-header-toggle="theme"]').trigger('click')
    expect(wrapper.get('[data-app-header-toggle="sidebar"]').attributes('aria-label')).toBe('收起菜单')
    expect(wrapper.get('[data-mm-component="app-header"]').attributes('data-app-header-theme')).toBe('light')

    await wrapper.setProps({ sidebarCollapsed: true, theme: 'dark' })
    expect(wrapper.get('[data-app-header-toggle="sidebar"]').attributes('aria-label')).toBe('展开菜单')
    expect(wrapper.get('[data-mm-component="app-header"]').attributes('data-app-header-theme')).toBe('dark')
  })

  it('renders the compact mobile brand and controls mobile navigation state', async () => {
    const wrapper = mount(AppHeader, {
      props: {
        brand,
        display: 'mobile',
        identity: { label: '商户', tone: 'merchant' },
        pageTitle: '在线账户',
        profile: { fallback: '管' },
      },
    })

    expect(wrapper.get('[data-mm-component="app-header"]').attributes('data-app-header-mode')).toBe('mobile')
    expect(wrapper.get('[data-app-header-brand]').text()).toContain('管理后台')
    expect(wrapper.get('[data-app-header-brand]').text()).toContain('在线账户')
    expect(wrapper.find('[data-app-header-center]').exists()).toBe(false)
    expect(wrapper.get('[data-app-header-identity]').attributes('aria-label')).toBe('身份菜单：商户')
    expect(wrapper.find('[data-app-header-identity-icon]').exists()).toBe(true)
    expect(wrapper.find('.mm-app-header__identity-dot').exists()).toBe(false)

    const mobileToggle = wrapper.get('[data-app-header-toggle="mobile"]')
    expect(mobileToggle.attributes('aria-expanded')).toBe('false')
    await mobileToggle.trigger('click')
    expect(mobileToggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('update:mobileOpen')?.at(-1)).toEqual([true])
    expect(wrapper.emitted('toggle-mobile')?.at(-1)).toEqual([true])
  })

  it('allows applications to replace layout regions with named slots', () => {
    const desktop = mount(AppHeader, {
      props: { display: 'desktop', identity: { label: '商户' }, profile: { fallback: '管' } },
      slots: {
        actions: '<div data-slot-actions>自定义动作区</div>',
        center: '<div data-slot-center>自定义中心区</div>',
      },
    })
    expect(desktop.get('[data-slot-center]').text()).toBe('自定义中心区')
    expect(desktop.get('[data-slot-actions]').text()).toBe('自定义动作区')

    const identityAndProfile = mount(AppHeader, {
      props: { display: 'desktop', identity: { label: '商户' }, profile: { fallback: '管' } },
      slots: {
        identity: '<button data-slot-identity>自定义身份</button>',
        profile: '<button data-slot-profile>自定义账号</button>',
        utilities: '<button data-slot-utilities>语言切换</button>',
      },
    })
    expect(identityAndProfile.find('[data-slot-identity]').exists()).toBe(true)
    expect(identityAndProfile.find('[data-slot-profile]').exists()).toBe(true)
    expect(identityAndProfile.get('[data-slot-utilities]').text()).toBe('语言切换')

    const actionChildren = Array.from(
      identityAndProfile.get('.mm-app-header__actions').element.children,
    )
    expect(actionChildren.indexOf(identityAndProfile.get('[data-app-header-toggle="theme"]').element))
      .toBeLessThan(actionChildren.indexOf(identityAndProfile.get('[data-slot-utilities]').element))
    expect(actionChildren.indexOf(identityAndProfile.get('[data-slot-utilities]').element))
      .toBeLessThan(actionChildren.indexOf(identityAndProfile.get('[data-slot-profile]').element))

    const mobile = mount(AppHeader, {
      props: { display: 'mobile' },
      slots: { brand: '<div data-slot-brand>自定义品牌</div>' },
    })
    expect(mobile.get('[data-slot-brand]').text()).toBe('自定义品牌')
  })

  it('uses the configured media query when display is automatic', async () => {
    const originalMatchMedia = window.matchMedia
    let viewportListener: ((event: MediaQueryListEvent) => void) | undefined
    const matchMedia = vi.fn().mockImplementation((media: string) => ({
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => { viewportListener = listener },
      matches: true,
      media,
      onchange: null,
      removeEventListener: vi.fn(),
    }))
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: matchMedia })

    const wrapper = mount(AppHeader, { props: { display: 'auto', mobileBreakpoint: 720 } })
    await nextTick()
    expect(matchMedia).toHaveBeenCalledWith('(max-width: 720px)')
    expect(wrapper.get('[data-mm-component="app-header"]').attributes('data-app-header-mode')).toBe('mobile')

    viewportListener?.({ matches: false } as MediaQueryListEvent)
    await nextTick()
    expect(wrapper.get('[data-mm-component="app-header"]').attributes('data-app-header-mode')).toBe('desktop')

    wrapper.unmount()
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: originalMatchMedia })
  })
})
