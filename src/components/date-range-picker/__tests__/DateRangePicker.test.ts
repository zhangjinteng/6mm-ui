import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import DateRangePicker from '../DateRangePicker.vue'

function bodyButton(label: string): HTMLButtonElement {
  const button = Array.from(document.body.querySelectorAll<HTMLButtonElement>('button'))
    .find((item) => item.textContent?.trim() === label)
  if (!button) throw new Error(`Button not found: ${label}`)
  return button
}

describe('MmDateRangePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-16T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('keeps shortcut selection as a draft until confirmation', async () => {
    const wrapper = mount(DateRangePicker, {
      attachTo: document.body,
      props: { modelValue: null },
    })

    expect(wrapper.get('.mm-date-picker').classes()).toContain('mm-date-picker--filter')
    expect(wrapper.find('.mm-date-picker__calendar-icon').exists()).toBe(true)
    await wrapper.get('input').trigger('click')
    expect(wrapper.get('.mm-date-picker').classes()).toContain('is-open')
    expect(wrapper.find('.mm-date-picker__toggle-icon').exists()).toBe(true)
    expect(document.body.querySelector('.mm-date-panel--compact')).not.toBeNull()
    expect(document.body.querySelector('[aria-label="上一年"]')).toBeNull()
    expect(document.body.querySelector('[aria-label="下一年"]')).toBeNull()
    bodyButton('近7日').click()
    await nextTick()

    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2026-07-10 → 2026-07-16')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    bodyButton('确定').click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['2026-07-10', '2026-07-16']])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['2026-07-10', '2026-07-16']])
    expect(document.body.querySelector('.mm-date-range-picker__panel')).toBeNull()
  })

  it('resolves last month and discards an unconfirmed draft on Escape', async () => {
    const wrapper = mount(DateRangePicker, {
      attachTo: document.body,
      props: { modelValue: ['2026-07-01', '2026-07-05'] },
    })

    await wrapper.get('input').trigger('click')
    bodyButton('上月').click()
    await nextTick()
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2026-06-01 → 2026-06-30')

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await nextTick()
    await nextTick()
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2026-07-01 → 2026-07-05')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('commits clearing and disables shortcuts outside configured limits', async () => {
    const wrapper = mount(DateRangePicker, {
      attachTo: document.body,
      props: {
        min: '2026-07-01',
        modelValue: ['2026-07-01', '2026-07-05'],
      },
    })

    await wrapper.get('input').trigger('click')
    expect(bodyButton('近30日').disabled).toBe(true)
    expect(bodyButton('上月').disabled).toBe(true)

    bodyButton('清空').click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
