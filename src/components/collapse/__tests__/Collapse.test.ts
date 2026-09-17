import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import Collapse from '../Collapse.vue'
import CollapseItem from '../CollapseItem.vue'

const Host = defineComponent({
  components: { Collapse, CollapseItem },
  props: { accordion: Boolean },
  setup: () => ({ active: ref<Array<string> | string>(['risk']) }),
  template: `
    <Collapse v-model="active" :accordion="accordion">
      <CollapseItem name="risk" title="风险设置">风险内容</CollapseItem>
      <CollapseItem name="notice" title="通知设置">通知内容</CollapseItem>
      <CollapseItem name="locked" title="锁定项" disabled>锁定内容</CollapseItem>
    </Collapse>
  `,
})

describe('MmCollapse', () => {
  it('controls multiple panels with accessible relationships', async () => {
    const wrapper = mount(Host)
    const triggers = wrapper.findAll('.mm-collapse-item__trigger')
    expect(triggers[0]!.attributes('aria-expanded')).toBe('true')
    expect(wrapper.text()).toContain('风险内容')

    await triggers[1]!.trigger('click')
    expect(triggers[1]!.attributes('aria-expanded')).toBe('true')
    expect(triggers[2]!.attributes('disabled')).toBeDefined()
  })

  it('renders centered decorative vector arrows without font glyphs', () => {
    const wrapper = mount(Host)
    const arrows = wrapper.findAll('.mm-collapse-item__arrow')

    expect(arrows).toHaveLength(3)
    expect(arrows.every(arrow => arrow.text() === '')).toBe(true)
    expect(arrows.every(arrow => arrow.find('svg').attributes('focusable') === 'false')).toBe(true)
  })

  it('supports accordion values and arrow-key focus', async () => {
    const wrapper = mount(Host, { attachTo: document.body, props: { accordion: true } })
    const triggers = wrapper.findAll<HTMLButtonElement>('.mm-collapse-item__trigger')
    triggers[0]!.element.focus()
    await triggers[0]!.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(triggers[1]!.element)
    await triggers[1]!.trigger('click')
    expect(triggers[0]!.attributes('aria-expanded')).toBe('false')
    expect(triggers[1]!.attributes('aria-expanded')).toBe('true')
  })
})
