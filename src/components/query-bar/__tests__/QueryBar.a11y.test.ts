import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'

import QueryBar from '../QueryBar.vue'

describe('MmQueryBar accessibility', () => {
  it('has no automated accessibility violations', async () => {
    const wrapper = mount(QueryBar, {
      attachTo: document.body,
      props: {
        ariaLabel: '在线账户查询',
        fields: [
          { key: 'keyword', label: '关键词', type: 'keyword' },
          {
            key: 'level',
            label: '用户等级',
            options: [{ label: '普通', value: 'normal' }, { label: 'VIP', value: 'vip' }],
            type: 'select',
          },
          { key: 'coin', label: '币种', options: ['USDT', 'BTC'], type: 'coin' },
          { key: 'range', label: '日期范围', type: 'date-range' },
          { key: 'status', label: '状态', options: ['全部', '在线'], type: 'segmented' },
        ],
      },
    })

    const result = await axe.run(wrapper.element, {
      rules: {
        'color-contrast': { enabled: false },
        region: { enabled: false },
      },
    })
    expect(result.violations).toEqual([])
  })
})
