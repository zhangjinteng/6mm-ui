import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import FilterDrawer from '../FilterDrawer.vue'

describe('MmFilterDrawer accessibility', () => {
  it('has no automated accessibility violations while open', async () => {
    const wrapper = mount(FilterDrawer, {
      attachTo: document.body,
      props: {
        fields: [
          { key: 'keyword', label: '关键词', type: 'keyword' },
          {
            defaultValue: 'all',
            key: 'userType',
            label: '用户类型',
            options: [{ label: '全部', value: 'all' }, { label: '在线', value: 'online' }],
            type: 'segmented',
          },
        ],
        modelValue: { keyword: 'alice', userType: 'all' },
        open: true,
        subtitle: '在线账户',
      },
    })
    await nextTick()

    const result = await axe.run(document.body, {
      rules: {
        'color-contrast': { enabled: false },
        region: { enabled: false },
      },
    })
    expect(result.violations).toEqual([])
    wrapper.unmount()
  })
})
