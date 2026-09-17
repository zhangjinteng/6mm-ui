import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Button from '../Button.vue'

describe('MmButton', () => {
  it('renders variants, slots, native attributes, and click events', async () => {
    const wrapper = mount(Button, {
      attrs: { 'data-track': 'save' },
      props: { nativeType: 'submit', size: 'lg', variant: 'primary' },
      slots: { default: '保存', icon: '<span data-icon>+</span>' },
    })

    expect(wrapper.attributes()).toMatchObject({ 'data-track': 'save', type: 'submit' })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mm-button', 'mm-button--primary', 'mm-button--lg']),
    )
    expect(wrapper.find('[data-icon]').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('exposes loading semantics and blocks interaction', async () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: '提交' },
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.mm-button__spinner').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('renders the semantic plain style without changing the variant', () => {
    const wrapper = mount(Button, {
      props: { plain: true, variant: 'success' },
      slots: { default: '成功' },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mm-button--success', 'is-plain']),
    )
  })
})
