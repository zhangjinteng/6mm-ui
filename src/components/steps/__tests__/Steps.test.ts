import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Steps from '../Steps.vue'

const items = [
  { description: '参数已保存', title: '配置策略' },
  { description: '等待风险确认', title: '风险复核' },
  { description: '尚未提交', title: '执行上线' },
]

describe('MmSteps', () => {
  it('derives finish, process and wait states with accessible current step', () => {
    const wrapper = mount(Steps, { props: { current: 1, items } })
    const steps = wrapper.findAll('.mm-step')
    expect(wrapper.attributes('role')).toBe('list')
    expect(steps[0]!.attributes('data-status')).toBe('finish')
    expect(steps[1]!.attributes('data-status')).toBe('process')
    expect(steps[1]!.attributes('aria-current')).toBe('step')
    expect(steps[2]!.attributes('data-status')).toBe('wait')
  })

  it('renders error and per-item states in vertical mode', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        direction: 'vertical',
        items: [items[0]!, { ...items[1]!, status: 'error' }, { ...items[2]!, status: 'finish' }],
      },
    })
    expect(wrapper.classes()).toContain('mm-steps--vertical')
    expect(wrapper.findAll('.mm-step')[1]!.classes()).toContain('is-error')
    expect(wrapper.findAll('.mm-step')[2]!.attributes('data-status')).toBe('finish')
  })

  it('supports scoped content slots and optional step changes', async () => {
    const wrapper = mount(Steps, {
      props: { clickable: true, current: 0, items },
      slots: {
        icon: '<template #icon="{ index }"><span class="custom-icon">{{ index + 1 }}</span></template>',
        title: '<template #title="{ item }">步骤：{{ item.title }}</template>',
      },
    })
    expect(wrapper.find('.custom-icon').text()).toBe('1')
    expect(wrapper.find('.mm-step__title').text()).toContain('步骤：配置策略')
    await wrapper.findAll<HTMLButtonElement>('.mm-step__body')[2]!.trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([2, items[2]])
  })
})
