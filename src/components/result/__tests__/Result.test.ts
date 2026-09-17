import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Result from '../Result.vue'

describe('MmResult', () => {
  it('renders status, copy, and action slots', () => {
    const wrapper = mount(Result, {
      props: { status: 'success', subtitle: '策略将在下一周期生效', title: '发布成功' },
      slots: { default: '<p>流水号 TX-42</p>', extra: '<button>返回列表</button>' },
    })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.classes()).toContain('mm-result--success')
    expect(wrapper.get('h2').text()).toBe('发布成功')
    expect(wrapper.text()).toContain('TX-42')
    expect(wrapper.get('button').text()).toBe('返回列表')
  })

  it('supports a custom icon slot', () => {
    const wrapper = mount(Result, { slots: { icon: '<span data-custom-icon>!</span>' } })
    expect(wrapper.get('[data-custom-icon]').text()).toBe('!')
  })
})
