import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Layout from '../Layout.vue'

describe('MmLayout', () => {
  it('maps flex layout props to namespaced classes and gap tokens', () => {
    const wrapper = mount(Layout, {
      props: {
        align: 'center',
        as: 'section',
        direction: 'column',
        gap: 12,
        justify: 'between',
        wrap: true,
      },
      slots: { default: '<div>A</div><div>B</div>' },
    })

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mm-layout--column',
        'is-align-center',
        'is-justify-between',
        'is-wrap',
      ]),
    )
    expect(wrapper.attributes('style')).toContain('--mm-layout-gap: 12px')
  })
})
