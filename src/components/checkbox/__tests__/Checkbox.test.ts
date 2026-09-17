import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import Checkbox from '../Checkbox.vue'
import CheckboxGroup from '../CheckboxGroup.vue'

describe('MmCheckbox', () => {
  it('supports custom values and indeterminate state', async () => {
    const wrapper = mount(Checkbox, {
      props: { falseValue: 'off', indeterminate: true, label: '启用风控', modelValue: 'off', name: 'risk', trueValue: 'on' },
    })
    const input = wrapper.get('input')

    expect((input.element as HTMLInputElement).indeterminate).toBe(true)
    expect(input.attributes('name')).toBe('risk')
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['on'])
  })

  it('coordinates group values and maximum selection constraints', async () => {
    const Host = defineComponent({
      components: { Checkbox, CheckboxGroup },
      setup() {
        const value = ref<string[]>(['spot'])
        return { value }
      },
      template: `
        <CheckboxGroup v-model="value" :max="2" name="markets">
          <Checkbox value="spot">现货</Checkbox>
          <Checkbox value="margin">杠杆</Checkbox>
          <Checkbox value="futures">合约</Checkbox>
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Host)
    const inputs = wrapper.findAll('input')

    await inputs[1]!.setValue(true)
    expect((wrapper.vm as unknown as { value: string[] }).value).toEqual(['spot', 'margin'])
    expect(inputs[2]!.attributes('disabled')).toBeDefined()
  })

  it('inherits readonly and status state from its group', async () => {
    const Host = defineComponent({
      components: { Checkbox, CheckboxGroup },
      setup: () => ({ value: ref<string[]>(['api']) }),
      template: '<CheckboxGroup v-model="value" readonly status="error"><Checkbox value="api">API</Checkbox></CheckboxGroup>',
    })
    const wrapper = mount(Host)

    expect(wrapper.get('.mm-checkbox-group').classes()).toContain('is-error')
    expect(wrapper.get('.mm-checkbox').classes()).toContain('is-readonly')
    await wrapper.get('input').setValue(false)
    expect((wrapper.vm as unknown as { value: string[] }).value).toEqual(['api'])
  })
})
