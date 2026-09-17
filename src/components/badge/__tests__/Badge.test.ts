import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Badge from '../Badge.vue'

describe('MmBadge', () => {
  it('caps numeric values and exposes an accessible label', () => {
    const wrapper = mount(Badge, {
      props: { max: 99, type: 'danger', value: 120 },
      slots: { default: '<button type="button">通知</button>' },
    })

    expect(wrapper.get('.mm-badge__content').text()).toBe('99+')
    expect(wrapper.get('.mm-badge__content').attributes('aria-label')).toBe('120 条通知')
    expect(wrapper.get('.mm-badge__content').attributes('role')).toBe('status')
    expect(wrapper.classes()).toContain('mm-badge--danger')
  })

  it('supports dot, hidden, and zero states', async () => {
    const wrapper = mount(Badge, { props: { dot: true, value: 0 } })
    expect(wrapper.get('.mm-badge__content').classes()).toContain('is-dot')

    await wrapper.setProps({ dot: false, hidden: true })
    expect(wrapper.find('.mm-badge__content').exists()).toBe(false)

    await wrapper.setProps({ hidden: false, showZero: false })
    expect(wrapper.find('.mm-badge__content').exists()).toBe(false)
  })
})
