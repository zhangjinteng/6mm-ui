import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { MmDropdown } from '../../dropdown'
import { MmMenu, MmMenuItem, MmSubMenu } from '../../menu'
import { MmPageHeader } from '../../page-header'
import { MmSteps } from '../../steps'
import { MmTabPane } from '../index'
import Tabs from '../Tabs.vue'

describe('navigation accessibility', () => {
  it('has no automated violations in the interactive composition', async () => {
    const Host = defineComponent({
      components: { MmDropdown, MmMenu, MmMenuItem, MmPageHeader, MmSteps, MmSubMenu, MmTabPane, Tabs },
      setup: () => ({ active: ref<string | number>('summary'), selected: ref<string | number>('overview') }),
      template: `
        <main>
          <MmPageHeader title="策略详情" show-back />
          <MmSteps aria-label="发布进度" :current="1" :items="[{ title: '配置' }, { title: '复核' }, { title: '上线' }]" />
          <MmMenu v-model="selected" aria-label="控制台导航">
            <MmMenuItem value="overview">概览</MmMenuItem>
            <MmSubMenu value="settings" label="设置"><MmMenuItem value="account">账户</MmMenuItem></MmSubMenu>
          </MmMenu>
          <MmDropdown label="更多操作" :teleport="false" :items="[{ label: '导出', value: 'export' }]" />
          <Tabs v-model="active" aria-label="详情视图">
            <MmTabPane name="summary" label="摘要">摘要内容</MmTabPane>
            <MmTabPane name="audit" label="审计">审计内容</MmTabPane>
          </Tabs>
        </main>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const result = await axe.run(wrapper.element, { rules: { 'color-contrast': { enabled: false } } })
    expect(result.violations).toEqual([])
    wrapper.unmount()
  })
})
