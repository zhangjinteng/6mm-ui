import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Color from '../Color.vue'

describe('MmColor', () => {
  it('renders a selectable color swatch with automatic contrast', async () => {
    const wrapper = mount(Color, {
      props: { label: 'Primary', selectable: true, showValue: true, size: 'lg', value: '#0accaa' },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('style')).toContain('--mm-color-value: #0accaa')
    expect(wrapper.text()).toContain('Primary')
    expect(wrapper.text()).toContain('#0accaa')

    await wrapper.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['#0accaa'])
  })

  it('renders as a non-interactive swatch by default', () => {
    const wrapper = mount(Color, { props: { value: '#ffffff' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.attributes('style')).toContain('--mm-color-contrast: #172033')
  })
})
