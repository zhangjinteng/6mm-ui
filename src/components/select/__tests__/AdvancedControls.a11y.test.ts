import { flushPromises, mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { MmAutocomplete } from '../../autocomplete'
import { MmDatePicker } from '../../date-picker'
import { MmForm, MmFormItem } from '../../form'
import { MmUpload } from '../../upload'
import Select from '../Select.vue'

describe('advanced form controls accessibility', () => {
  it('forwards accessible naming attributes to the combobox control', () => {
    const wrapper = mount(Select, {
      attrs: {
        'aria-label': '结算币种',
        'data-testid': 'currency-select',
      },
      props: {
        options: [{ label: '人民币', value: 'cny' }],
      },
    })

    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.attributes('data-testid')).toBe('currency-select')
    expect(wrapper.get('[role="combobox"]').attributes('aria-label')).toBe('结算币种')
  })

  it('has no automated violations with interactive layers open', async () => {
    const Host = defineComponent({
      components: { MmAutocomplete, MmDatePicker, MmForm, MmFormItem, MmUpload, Select },
      setup: () => ({
        model: ref({ date: '2026-07-16', market: '', strategy: 'grid', uploads: [] }),
        options: [{ label: '网格策略', value: 'grid' }, { label: '趋势跟随', value: 'trend' }],
        suggestions: ['BTC-USDT', 'ETH-USDT'],
      }),
      template: `
        <MmForm :model="model">
          <MmFormItem label="市场" prop="market"><MmAutocomplete v-model="model.market" :debounce="0" :suggestions="suggestions" /></MmFormItem>
          <MmFormItem label="策略" prop="strategy"><Select v-model="model.strategy" :options="options" /></MmFormItem>
          <MmFormItem label="日期" prop="date"><MmDatePicker v-model="model.date" /></MmFormItem>
          <MmFormItem label="文件" prop="uploads"><MmUpload v-model="model.uploads" /></MmFormItem>
        </MmForm>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await wrapper.get('.mm-autocomplete input').setValue('BTC')
    await wrapper.get('.mm-select__control').trigger('click')
    await wrapper.get('.mm-date-picker input').trigger('click')
    await flushPromises()

    const result = await axe.run(document.body, {
      rules: {
        'color-contrast': { enabled: false },
        region: { enabled: false },
      },
    })
    expect(result.violations).toEqual([])
  })
})
