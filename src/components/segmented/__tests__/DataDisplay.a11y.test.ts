import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { MmCollapse, MmCollapseItem } from '../../collapse'
import { MmDescriptions, MmDescriptionsItem } from '../../descriptions'
import { MmProgress } from '../../progress'
import Segmented from '../Segmented.vue'

describe('lightweight data display accessibility', () => {
  it('has no automated violations in the interactive composition', async () => {
    const Host = defineComponent({
      components: { MmCollapse, MmCollapseItem, MmDescriptions, MmDescriptionsItem, MmProgress, Segmented },
      setup: () => ({ active: ref(['risk']), period: ref('day') }),
      template: `
        <main>
          <Segmented v-model="period" aria-label="统计周期" :options="['day', 'week', 'month']" />
          <MmProgress :percentage="72" aria-label="部署进度" />
          <MmDescriptions title="策略详情"><MmDescriptionsItem label="状态">运行中</MmDescriptionsItem></MmDescriptions>
          <MmCollapse v-model="active"><MmCollapseItem name="risk" title="风险约束">回撤 8%</MmCollapseItem></MmCollapse>
        </main>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const result = await axe.run(wrapper.element, { rules: { 'color-contrast': { enabled: false } } })
    expect(result.violations).toEqual([])
  })
})
