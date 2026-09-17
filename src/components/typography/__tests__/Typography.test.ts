import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Typography from '../Typography.vue'

describe('MmTypography', () => {
  it('renders semantic titles and controls collapsed content', async () => {
    const wrapper = mount(Typography, {
      props: { collapsedLines: 2, collapsible: true, level: 2, title: '资金说明' },
      slots: { default: '保证金用于覆盖交易风险。' },
    })

    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.find('h2').text()).toBe('资金说明')
    expect(wrapper.find('.mm-typography__body').classes()).toContain('is-collapsed')
    expect(wrapper.find('.mm-typography__body').attributes('style')).toContain('--mm-typography-lines: 2')

    await wrapper.get('[data-action="toggle"]').trigger('click')
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([true])
    expect(wrapper.find('.mm-typography__body').classes()).not.toContain('is-collapsed')
  })

  it('copies explicit text and emits the copied value', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    const wrapper = mount(Typography, {
      props: { copyText: 'API-KEY', copyable: true },
      slots: { default: 'Visible value' },
    })

    await wrapper.get('[data-action="copy"]').trigger('click')

    expect(writeText).toHaveBeenCalledWith('API-KEY')
    expect(wrapper.emitted('copy')?.[0]).toEqual(['API-KEY'])
  })
})
