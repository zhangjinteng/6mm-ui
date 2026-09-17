import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Empty from '../Empty.vue'

describe('MmEmpty', () => {
  it('renders the default illustration, description, and actions', () => {
    const wrapper = mount(Empty, {
      props: { description: '暂无策略', imageSize: 96 },
      slots: { default: '<button type="button">新建策略</button>' },
    })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toContain('暂无策略')
    expect(wrapper.get('.mm-empty__image').attributes('style')).toContain('--mm-empty-image-size: 96px')
    expect(wrapper.get('button').text()).toBe('新建策略')
  })

  it('supports custom image and description slots', () => {
    const wrapper = mount(Empty, {
      props: { image: '/empty.svg' },
      slots: { description: '<strong>没有结果</strong>' },
    })

    expect(wrapper.get('img').attributes('src')).toBe('/empty.svg')
    expect(wrapper.get('img').attributes('alt')).toBe('')
    expect(wrapper.get('strong').text()).toBe('没有结果')
  })
})
