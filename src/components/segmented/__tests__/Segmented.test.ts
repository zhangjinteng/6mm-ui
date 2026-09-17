import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import Segmented from '../Segmented.vue'

describe('MmSegmented', () => {
  it('updates value and respects disabled options', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'day',
        options: ['day', { disabled: true, label: '周', value: 'week' }, { label: '月', value: 'month' }],
      },
    })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.find('[role="radio"][aria-checked="true"]').text()).toContain('day')
    expect(wrapper.findAll('button')[1]!.attributes('disabled')).toBeDefined()

    await wrapper.findAll('button')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['month'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['month'])
  })

  it('moves and selects with arrow keys', async () => {
    const Host = defineComponent({
      components: { Segmented },
      setup: () => ({ value: ref('a') }),
      template: '<Segmented v-model="value" :options="[\'a\', \'b\', \'c\']" aria-label="周期" />',
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const buttons = wrapper.findAll<HTMLButtonElement>('[role="radio"]')
    buttons[0]!.element.focus()
    await buttons[0]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(buttons[2]!.element)
    expect(buttons[2]!.attributes('aria-checked')).toBe('true')
  })
})
