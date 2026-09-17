import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Avatar from '../Avatar.vue'

describe('MmAvatar', () => {
  it('renders an image with size, shape, and load events', async () => {
    const wrapper = mount(Avatar, {
      props: { alt: 'Ada Lovelace', shape: 'square', size: 48, src: '/ada.png' },
    })

    expect(wrapper.classes()).toContain('mm-avatar--square')
    expect(wrapper.attributes('style')).toContain('--mm-avatar-size: 48px')
    expect(wrapper.get('img').attributes('alt')).toBe('Ada Lovelace')
    await wrapper.get('img').trigger('load')
    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  it('falls back to text or icon when the image fails', async () => {
    const wrapper = mount(Avatar, {
      props: { fallback: 'AL', src: '/broken.png' },
      slots: { icon: '<span data-icon>operator</span>' },
    })

    await wrapper.get('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.text()).toContain('AL')
    expect(wrapper.find('[data-icon]').exists()).toBe(false)

    await wrapper.setProps({ fallback: undefined, src: undefined })
    expect(wrapper.get('[data-icon]').text()).toBe('operator')
  })
})
