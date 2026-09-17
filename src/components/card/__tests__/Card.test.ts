import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Card from '../Card.vue'

describe('MmCard', () => {
  it('renders semantic sections and visual variants', () => {
    const wrapper = mount(Card, {
      props: { bordered: false, hoverable: true, shadow: 'always' },
      slots: {
        default: '<p>净值 82,430</p>',
        footer: '<button>查看详情</button>',
        header: '<h3>账户摘要</h3>',
      },
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['is-hoverable', 'is-shadow-always']))
    expect(wrapper.classes()).not.toContain('is-bordered')
    expect(wrapper.get('.mm-card__header h3').text()).toBe('账户摘要')
    expect(wrapper.get('.mm-card__body').text()).toContain('82,430')
    expect(wrapper.get('.mm-card__footer button').text()).toBe('查看详情')
  })

  it('uses title and subtitle props when no header slot is supplied', () => {
    const wrapper = mount(Card, { props: { subtitle: '最近 24 小时', title: '资金变化' } })
    expect(wrapper.get('.mm-card__title').text()).toBe('资金变化')
    expect(wrapper.get('.mm-card__subtitle').text()).toBe('最近 24 小时')
  })
})
