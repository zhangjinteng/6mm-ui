import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import DatePicker from '../DatePicker.vue'

describe('MmDatePicker', () => {
  it('opens the panel and commits a selected date', async () => {
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: { modelValue: '2026-07-16', name: 'settlementDate' },
    })
    const input = wrapper.get('input')

    expect(input.attributes('name')).toBe('settlementDate')
    expect(input.attributes('aria-haspopup')).toBe('grid')
    await input.trigger('click')
    await nextTick()
    const date = document.body.querySelector<HTMLButtonElement>('[data-date="2026-07-18"]')
    date?.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-07-18'])
    expect(document.body.querySelector('[role="grid"]')).toBeNull()
  })

  it('rejects invalid manual input and parses custom display formats', async () => {
    const wrapper = mount(DatePicker, {
      props: { format: 'DD/MM/YYYY', modelValue: '2026-07-16' },
    })
    const input = wrapper.get('input')
    expect((input.element as HTMLInputElement).value).toBe('16/07/2026')

    await input.setValue('31/02/2026')
    await input.trigger('blur')
    expect(wrapper.emitted('invalid')?.at(-1)).toEqual(['31/02/2026'])
    expect(wrapper.get('.mm-input').classes()).toContain('is-error')

    await input.setValue('18/07/2026')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-07-18'])
  })

  it('completes range values and supports clearing', async () => {
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: { clearable: true, modelValue: ['2026-07-10', ''], type: 'daterange' },
    })
    await wrapper.get('input').trigger('click')
    document.body.querySelector<HTMLButtonElement>('[data-date="2026-07-20"]')?.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['2026-07-10', '2026-07-20']])

    await wrapper.get('.mm-input__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })

  it('supports controlled visibility and composable panel regions', async () => {
    const Host = defineComponent({
      components: { DatePicker },
      setup: () => ({
        open: ref(false),
        value: ref<[string, string]>(['2026-07-10', '']),
      }),
      template: `
        <DatePicker
          v-model="value"
          v-model:open="open"
          type="daterange"
          :close-on-select="false"
          :panel-compact="true"
          panel-floating-class="composable-date-floating"
          :panel-width="312"
          panel-class="composable-date-panel"
        >
          <template #panel-before><p data-testid="panel-before">快捷范围</p></template>
          <template #panel-after><p data-testid="panel-after">确认范围</p></template>
        </DatePicker>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })

    await wrapper.get('input').trigger('click')
    await nextTick()

    expect((wrapper.vm as unknown as { open: boolean }).open).toBe(true)
    expect(document.body.querySelector('[data-testid="panel-before"]')?.textContent).toBe('快捷范围')
    expect(document.body.querySelector('[data-testid="panel-after"]')?.textContent).toBe('确认范围')
    expect(document.body.querySelector<HTMLElement>('.mm-popover__floating')?.style.width).toBe('312px')
    expect(document.body.querySelector('.mm-date-picker__floating')).not.toBeNull()
    expect(document.body.querySelector('.composable-date-floating')).not.toBeNull()
    expect(document.body.querySelector('.composable-date-panel')).not.toBeNull()
    expect(document.body.querySelector('.mm-date-panel--compact')).not.toBeNull()

    document.body.querySelector<HTMLButtonElement>('[data-date="2026-07-20"]')?.click()
    await nextTick()
    expect((wrapper.vm as unknown as { open: boolean }).open).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await nextTick()
    expect((wrapper.vm as unknown as { open: boolean }).open).toBe(false)
  })
})
