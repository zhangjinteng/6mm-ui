import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'

import AppHeader from '../AppHeader.vue'

describe('MmAppHeader accessibility', () => {
  it('has no automated violations in desktop and mobile compositions', async () => {
    const desktop = mount(AppHeader, {
      attachTo: document.body,
      props: {
        contextActions: [
          { icon: 'triangle-alert', key: 'warning', label: '保证金不足', tone: 'warning' },
          { icon: 'arrow-up-to-line', key: 'deposit', label: '充值', tone: 'primary' },
        ],
        display: 'desktop',
        identity: { label: '商户', tone: 'merchant' },
        metrics: [
          { key: 'available', label: '可用', value: '9,787,646.35' },
          { key: 'total', label: '总保证金', tone: 'primary', value: '9,949,771.34' },
        ],
        profile: {
          alt: '管理员',
          email: 'ops@alphaembed.com',
          fallback: '管',
          items: [
            { icon: 'user', key: 'personal-center', label: '个人中心' },
            { icon: 'key-round', key: 'change-password', label: '修改密码' },
            { icon: 'logout', key: 'logout', label: '退出登录', tone: 'danger' },
          ],
        },
        summaryLabel: '商户保证金数据',
      },
    })
    const desktopResult = await axe.run(desktop.element, { rules: { 'color-contrast': { enabled: false } } })
    expect(desktopResult.violations).toEqual([])
    await desktop.get('[data-app-header-profile]').trigger('click')
    const desktopMenuResult = await axe.run('.mm-app-header__profile-popover', { rules: { 'color-contrast': { enabled: false } } })
    expect(desktopMenuResult.violations).toEqual([])
    desktop.unmount()

    const mobile = mount(AppHeader, {
      attachTo: document.body,
      props: {
        brand: { alt: '6MM', logo: '/logo.svg', title: '管理后台' },
        display: 'mobile',
        identity: { label: '商户', tone: 'merchant' },
        pageTitle: '在线账户',
        profile: { alt: '管理员', fallback: '管' },
      },
    })
    const mobileResult = await axe.run(mobile.element, { rules: { 'color-contrast': { enabled: false } } })
    expect(mobileResult.violations).toEqual([])
    mobile.unmount()
  })
})
