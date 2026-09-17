import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Progress from '../Progress.vue'

describe('MmProgress', () => {
  it('clamps line progress and exposes progressbar semantics', () => {
    const wrapper = mount(Progress, { props: { percentage: 128, status: 'success' } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-label')).toBe('进度')
    expect(wrapper.attributes('aria-valuenow')).toBe('100')
    expect(wrapper.classes()).toContain('is-success')
    expect(wrapper.get('.mm-progress__bar').attributes('style')).toContain('--mm-progress-value: 100%')
    expect(wrapper.text()).toContain('100%')
  })

  it('renders circular progress with custom formatting and color', () => {
    const wrapper = mount(Progress, {
      props: { ariaLabel: '部署进度', color: '#0accaa', format: (value: number) => `${value}/100`, percentage: 42, type: 'circle' },
    })
    expect(wrapper.attributes('aria-label')).toBe('部署进度')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.get('.mm-progress__circle-value').attributes('style')).toContain('stroke-dashoffset')
    expect(wrapper.text()).toContain('42/100')
  })
})
