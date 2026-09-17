import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Border from '../Border.vue'

describe('MmBorder', () => {
  it('renders a semantic border surface with tokenized custom styles', () => {
    const wrapper = mount(Border, {
      attrs: { id: 'risk-panel' },
      props: {
        as: 'section',
        color: 'var(--mm-color-primary)',
        interactive: true,
        padding: 12,
        radius: 'lg',
        styleType: 'dashed',
        width: 2,
      },
      slots: { default: '风险信息' },
    })

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes('id')).toBe('risk-panel')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['mm-border', 'is-interactive']))
    expect(wrapper.attributes('style')).toContain('--mm-border-width: 2px')
    expect(wrapper.attributes('style')).toContain('--mm-border-radius: var(--mm-radius-lg)')
    expect(wrapper.text()).toBe('风险信息')
  })
})
