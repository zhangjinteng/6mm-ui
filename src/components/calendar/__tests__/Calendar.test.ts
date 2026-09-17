import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import Calendar from '../Calendar.vue'

describe('MmCalendar', () => {
  it('selects dates and exposes controlled month changes', async () => {
    const Host = defineComponent({
      components: { Calendar },
      setup: () => ({ date: ref('2026-07-16'), month: ref('2026-07') }),
      template: '<Calendar v-model="date" v-model:displayed-month="month" />',
    })
    const wrapper = mount(Host)
    expect(wrapper.get('[data-date="2026-07-20"]').text()).toBe('20')
    await wrapper.get('[aria-label="下一月"]').trigger('click')
    expect(wrapper.text()).toContain('2026 年 8 月')
    await wrapper.get('[data-date="2026-08-20"]').trigger('click')
    expect(wrapper.get('[data-date="2026-08-20"]').attributes('aria-selected')).toBe('true')
  })

  it('forwards disabled dates and date cell slots', () => {
    const wrapper = mount(Calendar, {
      props: { disabledDate: (date: string) => date.endsWith('-18'), displayedMonth: '2026-07' },
      slots: { date: ({ cell }: { cell: { day: number } }) => `D${cell.day}` },
    })
    expect(wrapper.get('[data-date="2026-07-18"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-date="2026-07-20"]').text()).toBe('D20')
    expect(wrapper.get('[role="grid"]').attributes('aria-label')).toContain('2026 年 7 月')
  })
})
