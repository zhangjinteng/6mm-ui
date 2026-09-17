import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import TabPane from '../TabPane.vue'
import Tabs from '../Tabs.vue'

const Host = defineComponent({
  components: { TabPane, Tabs },
  setup: () => ({ active: ref<string | number>('summary') }),
  template: `
    <Tabs v-model="active" aria-label="策略详情">
      <TabPane name="summary" label="摘要"><p data-panel="summary">摘要内容</p></TabPane>
      <TabPane name="disabled" label="已停用" disabled><p>不可见</p></TabPane>
      <TabPane name="orders" label="订单" lazy><p data-panel="orders">订单内容</p></TabPane>
      <TabPane name="risk" label="风控"><p data-panel="risk">风控内容</p></TabPane>
    </Tabs>
  `,
})

describe('MmTabs', () => {
  it('links tabs and panels while respecting disabled tabs', async () => {
    const wrapper = mount(Host)
    await nextTick()
    const tablist = wrapper.get('[role="tablist"]')
    expect(tablist.attributes('aria-label')).toBe('策略详情')
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs[0]!.attributes('aria-selected')).toBe('true')
    expect(tabs[1]!.attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-panel="summary"]').isVisible()).toBe(true)
    expect(tabs[0]!.attributes('aria-controls')).toBe(wrapper.get('[role="tabpanel"]').attributes('id'))
  })

  it('moves and activates with arrows, Home and End while skipping disabled tabs', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const tabs = wrapper.findAll<HTMLButtonElement>('[role="tab"]')
    tabs[0]!.element.focus()
    await tabs[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tabs[2]!.element)
    expect(tabs[2]!.attributes('aria-selected')).toBe('true')

    await tabs[2]!.trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(tabs[3]!.element)
    await tabs[3]!.trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(tabs[0]!.element)
    wrapper.unmount()
  })

  it('does not mount a lazy panel until first activation and preserves it afterwards', async () => {
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('[data-panel="orders"]').exists()).toBe(false)

    await wrapper.findAll('[role="tab"]')[2]!.trigger('click')
    expect(wrapper.get('[data-panel="orders"]').isVisible()).toBe(true)
    await wrapper.findAll('[role="tab"]')[0]!.trigger('click')
    expect(wrapper.find('[data-panel="orders"]').exists()).toBe(true)
    expect(wrapper.get('[data-panel="orders"]').element.closest<HTMLElement>('[role="tabpanel"]')?.style.display).toBe('none')
  })

  it('supports card styling and vertical keyboard orientation', async () => {
    const wrapper = mount(Tabs, {
      slots: {
        default: [
          '<TabPane name="a" label="A">A panel</TabPane>',
          '<TabPane name="b" label="B">B panel</TabPane>',
        ],
      },
      global: { components: { TabPane } },
      props: { direction: 'vertical', modelValue: 'a', type: 'card' },
    })
    await nextTick()
    expect(wrapper.classes()).toContain('mm-tabs--card')
    expect(wrapper.get('[role="tablist"]').attributes('aria-orientation')).toBe('vertical')
  })
})
