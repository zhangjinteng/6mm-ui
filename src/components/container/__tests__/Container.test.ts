import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Container from '../Container.vue'

describe('MmContainer', () => {
  it('renders a centered, padded semantic container', () => {
    const wrapper = mount(Container, {
      attrs: { 'aria-label': 'Page content' },
      props: { as: 'main', gutter: 24, size: 'lg' },
      slots: { default: '<article>Content</article>' },
    })

    expect(wrapper.element.tagName).toBe('MAIN')
    expect(wrapper.attributes('aria-label')).toBe('Page content')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mm-container', 'mm-container--lg', 'is-centered', 'is-padded']),
    )
    expect(wrapper.attributes('style')).toContain('--mm-container-gutter: 24px')
  })

  it('supports fluid layouts', () => {
    const wrapper = mount(Container, { props: { fluid: true } })
    expect(wrapper.classes()).toContain('is-fluid')
  })
})
