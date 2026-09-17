import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Divider from '../Divider.vue'

describe('MmDivider', () => {
  it('renders a labeled horizontal separator', () => {
    const wrapper = mount(Divider, {
      props: { align: 'start', dashed: true, label: '更多信息' },
    })

    expect(wrapper.attributes()).toMatchObject({
      'aria-orientation': 'horizontal',
      role: 'separator',
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mm-divider--horizontal', 'is-align-start', 'is-dashed']),
    )
    expect(wrapper.findAll('.mm-divider__line')).toHaveLength(2)
    expect(wrapper.text()).toBe('更多信息')
  })

  it('supports a vertical orientation with custom spacing', () => {
    const wrapper = mount(Divider, {
      props: { color: 'red', direction: 'vertical', margin: 10 },
    })

    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.attributes('style')).toContain('--mm-divider-margin: 10px')
    expect(wrapper.attributes('style')).toContain('--mm-divider-color: red')
  })
})
