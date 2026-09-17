import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Text from '../Text.vue'

describe('MmText', () => {
  it('renders semantic text variants and forwards attributes', () => {
    const wrapper = mount(Text, {
      attrs: { id: 'summary' },
      props: { as: 'p', size: 'lg', tone: 'muted', weight: 'semibold' },
      slots: { default: '账户资产汇总' },
    })

    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.attributes('id')).toBe('summary')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mm-text', 'mm-text--lg', 'mm-text--muted', 'is-semibold']),
    )
    expect(wrapper.text()).toBe('账户资产汇总')
  })

  it('supports single-line truncation and line clamping', async () => {
    const wrapper = mount(Text, { props: { lineClamp: 3 }, slots: { default: 'Content' } })
    expect(wrapper.classes()).toContain('is-clamped')
    expect(wrapper.attributes('style')).toContain('--mm-text-lines: 3')

    await wrapper.setProps({ lineClamp: undefined, truncate: true })
    expect(wrapper.classes()).toContain('is-truncated')
  })
})
