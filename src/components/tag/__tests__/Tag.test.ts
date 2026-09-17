import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Tag from '../Tag.vue'

describe('MmTag', () => {
  it('renders type, size, effect, and close behavior', async () => {
    const wrapper = mount(Tag, {
      props: { closable: true, effect: 'outline', size: 'sm', type: 'success' },
      slots: { default: '运行中' },
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['mm-tag--success', 'mm-tag--sm', 'mm-tag--outline']))
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('blocks close interaction while disabled', async () => {
    const wrapper = mount(Tag, {
      props: { closable: true, disabled: true },
      slots: { default: '已锁定' },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
  })
})
