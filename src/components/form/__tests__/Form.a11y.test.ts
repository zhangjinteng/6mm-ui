import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { MmCheckbox, MmCheckboxGroup } from '../../checkbox'
import { MmInput } from '../../input'
import { MmRadio, MmRadioGroup } from '../../radio'
import Form from '../Form.vue'
import FormItem from '../FormItem.vue'

describe('MmForm accessibility', () => {
  it('has no automated accessibility violations', async () => {
    const Host = defineComponent({
      components: { Form, FormItem, MmCheckbox, MmCheckboxGroup, MmInput, MmRadio, MmRadioGroup },
      setup: () => ({
        model: ref({ account: '', channels: ['api'], mode: 'maker' }),
      }),
      template: `
        <Form :model="model">
          <FormItem label="操作员账号" prop="account"><MmInput v-model="model.account" /></FormItem>
          <FormItem label="通知通道" prop="channels">
            <MmCheckboxGroup v-model="model.channels">
              <MmCheckbox value="api">API</MmCheckbox>
              <MmCheckbox value="email">邮件</MmCheckbox>
            </MmCheckboxGroup>
          </FormItem>
          <FormItem label="费率模式" prop="mode">
            <MmRadioGroup v-model="model.mode">
              <MmRadio value="maker">Maker</MmRadio>
              <MmRadio value="taker">Taker</MmRadio>
            </MmRadioGroup>
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const result = await axe.run(wrapper.element, {
      rules: { 'color-contrast': { enabled: false } },
    })

    expect(result.violations).toEqual([])
    expect(wrapper.get('[role="group"]').attributes('aria-labelledby')).toBeTruthy()
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-labelledby')).toBeTruthy()
  })
})
