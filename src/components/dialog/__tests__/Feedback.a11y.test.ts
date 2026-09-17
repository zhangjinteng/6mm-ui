import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import { MmAlert } from '../../alert'
import { MmLoading } from '../../loading'
import { MmMessage } from '../../message'
import { MmMessageBox } from '../../message-box'
import { MmTooltip } from '../../tooltip'
import Dialog from '../Dialog.vue'

afterEach(() => {
  document.body.style.overflow = ''
  document.body.innerHTML = ''
})

describe('feedback accessibility', () => {
  it('has no automated violations across live regions, tooltip, and dialog', async () => {
    const Host = defineComponent({
      components: { Dialog, MmAlert, MmLoading, MmMessage, MmTooltip },
      setup: () => ({ dialogOpen: ref(true) }),
      template: `
        <main>
          <MmAlert title="连接已恢复" type="success" />
          <MmMessage :duration="0" message="配置已保存" />
          <section aria-label="加载区域" style="position:relative;min-height:80px"><MmLoading text="加载审计记录" /></section>
          <MmTooltip content="查看风险详情" :open-delay="0" :teleport="false">
            <template #default="{ triggerAttrs }"><button v-bind="triggerAttrs" data-tooltip-trigger>详情</button></template>
          </MmTooltip>
          <Dialog v-model="dialogOpen" title="发布确认"><p>确认发布当前策略？</p><template #footer><button>确认发布</button></template></Dialog>
        </main>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await wrapper.get('[data-tooltip-trigger]').trigger('focusin')
    await nextTick()
    const result = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } })
    expect(result.violations).toEqual([])
    wrapper.unmount()
  })

  it('has no automated violations in prompt state', async () => {
    const wrapper = mount(MmMessageBox, {
      attachTo: document.body,
      props: { message: '输入审批备注', modelValue: true, title: '审批确认', type: 'prompt' },
    })
    await nextTick()
    const result = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } })
    expect(result.violations).toEqual([])
    wrapper.unmount()
  })
})
