import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import Radio from '../Radio.vue'
import RadioGroup from '../RadioGroup.vue'

describe('MmRadio', () => {
  it('coordinates group state, names, button styles, and arrow keys', async () => {
    const Host = defineComponent({
      components: { Radio, RadioGroup },
      setup() {
        const value = ref('maker')
        return { value }
      },
      template: `
        <RadioGroup v-model="value" name="feeMode" aria-label="费率模式">
          <Radio button value="maker">Maker</Radio>
          <Radio button value="taker">Taker</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Host)
    const radios = wrapper.findAll('input')

    expect(radios[0]!.attributes('name')).toBe('feeMode')
    expect(radios[0]!.element).toHaveProperty('checked', true)
    expect(wrapper.findAll('.mm-radio--button')).toHaveLength(2)

    await radios[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect((wrapper.vm as unknown as { value: string }).value).toBe('taker')
    expect(radios[1]!.element).toHaveProperty('checked', true)
  })

  it('supports a standalone disabled radio', () => {
    const wrapper = mount(Radio, { props: { disabled: true, label: '只读', modelValue: 'a', value: 'a' } })
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('inherits readonly and status state from its group', async () => {
    const Host = defineComponent({
      components: { Radio, RadioGroup },
      setup: () => ({ value: ref('maker') }),
      template: '<RadioGroup v-model="value" readonly status="error"><Radio value="maker">Maker</Radio><Radio value="taker">Taker</Radio></RadioGroup>',
    })
    const wrapper = mount(Host)

    expect(wrapper.get('.mm-radio-group').classes()).toContain('is-error')
    expect(wrapper.findAll('.mm-radio')[1]!.classes()).toContain('is-readonly')
    await wrapper.findAll('input')[1]!.setValue(true)
    expect((wrapper.vm as unknown as { value: string }).value).toBe('maker')
  })
})
