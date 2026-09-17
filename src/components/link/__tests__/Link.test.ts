import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Link from '../Link.vue'

describe('MmLink', () => {
  it('adds safe external-link attributes and renders slots', () => {
    const wrapper = mount(Link, {
      props: { external: true, href: 'https://6mm.com', underline: 'hover' },
      slots: { default: '访问 6MM', suffix: '<span data-suffix>↗</span>' },
    })

    expect(wrapper.attributes()).toMatchObject({
      href: 'https://6mm.com',
      rel: 'noopener noreferrer',
      target: '_blank',
    })
    expect(wrapper.classes()).toContain('mm-link--underline-hover')
    expect(wrapper.find('[data-suffix]').exists()).toBe(true)
  })

  it('removes navigation and suppresses clicks when disabled', async () => {
    const wrapper = mount(Link, {
      props: { disabled: true, href: '/accounts' },
      slots: { default: '账户' },
    })

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
