import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Space from '../Space.vue'

describe('MmSpace', () => {
  it('spaces slot children and inserts separators without trailing content', () => {
    const wrapper = mount(Space, {
      props: { align: 'center', separator: '/', size: 8, wrap: true },
      slots: { default: '<span>A</span><span>B</span><span>C</span>' },
    })

    expect(wrapper.findAll('.mm-space__item')).toHaveLength(3)
    expect(wrapper.findAll('.mm-space__separator')).toHaveLength(2)
    expect(wrapper.text()).toBe('A/B/C')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['is-align-center', 'is-wrap']))
    expect(wrapper.attributes('style')).toContain('--mm-space-gap: 8px')
  })
})
