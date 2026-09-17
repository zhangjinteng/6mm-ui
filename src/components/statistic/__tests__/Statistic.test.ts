import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Statistic from '../Statistic.vue'

describe('MmStatistic', () => {
  it('formats precision, separators, affixes, and trend state', () => {
    const wrapper = mount(Statistic, {
      props: { precision: 2, prefix: '¥', suffix: 'CNY', title: '账户净值', trend: 'up', value: 82430.5 },
    })
    expect(wrapper.classes()).toContain('is-trend-up')
    expect(wrapper.get('.mm-statistic__title').text()).toBe('账户净值')
    expect(wrapper.get('.mm-statistic__value').text()).toContain('¥82,430.50CNY')
    expect(wrapper.get('.mm-statistic__number').attributes('title')).toBe('82,430.50')
  })

  it('uses formatter and named slots when provided', () => {
    const wrapper = mount(Statistic, {
      props: { formatter: (value: number | string) => `≈ ${value}`, value: 42 },
      slots: { prefix: '<i>~</i>', suffix: '<b>ms</b>', title: '<span>延迟</span>' },
    })
    expect(wrapper.get('.mm-statistic__number').text()).toBe('≈ 42')
    expect(wrapper.get('.mm-statistic__number').attributes('title')).toBe('≈ 42')
    expect(wrapper.get('i').text()).toBe('~')
    expect(wrapper.get('b').text()).toBe('ms')
  })
})
