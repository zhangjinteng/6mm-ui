import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DatePickerPanel from '../DatePickerPanel.vue'

describe('MmDatePickerPanel', () => {
  it('renders a six-week grid and selects an enabled date', async () => {
    const wrapper = mount(DatePickerPanel, {
      props: {
        displayedMonth: '2026-07',
        disabledDate: (date: string) => date === '2026-07-20',
        modelValue: '2026-07-16',
      },
    })

    expect(wrapper.findAll('[role="gridcell"]')).toHaveLength(42)
    expect(wrapper.get('[data-date="2026-07-16"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.get('[data-date="2026-07-20"]').attributes('disabled')).toBeDefined()
    await wrapper.get('[data-date="2026-07-18"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-07-18'])
  })

  it('selects ordered ranges and navigates months and years', async () => {
    const wrapper = mount(DatePickerPanel, {
      props: { displayedMonth: '2026-07', modelValue: ['2026-07-18', ''], selectionMode: 'range' },
    })
    await wrapper.get('[data-date="2026-07-10"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['2026-07-10', '2026-07-18']])

    await wrapper.get('[aria-label="下一月"]').trigger('click')
    expect(wrapper.emitted('update:displayedMonth')?.at(-1)).toEqual(['2026-08'])
    await wrapper.get('[aria-label="上一年"]').trigger('click')
    expect(wrapper.emitted('update:displayedMonth')?.at(-1)).toEqual(['2025-08'])
  })

  it('uses month-only navigation in compact mode without changing the default mode', async () => {
    const wrapper = mount(DatePickerPanel, {
      props: { compact: true, displayedMonth: '2026-07' },
    })

    expect(wrapper.classes()).toContain('mm-date-panel--compact')
    expect(wrapper.get('.mm-date-panel__header strong').text()).toBe('2026年7月')
    expect(wrapper.find('[aria-label="上一年"]').exists()).toBe(false)
    expect(wrapper.find('[aria-label="下一年"]').exists()).toBe(false)
    expect(wrapper.find('[aria-label="上一月"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="下一月"]').exists()).toBe(true)
  })

  it('supports arrow-key focus and Enter selection', async () => {
    const wrapper = mount(DatePickerPanel, {
      attachTo: document.body,
      props: { displayedMonth: '2026-07', modelValue: '2026-07-16' },
    })
    await wrapper.get('[data-date="2026-07-16"]').trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-07-17')
    await wrapper.get('[data-date="2026-07-17"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-07-17'])
  })
})
