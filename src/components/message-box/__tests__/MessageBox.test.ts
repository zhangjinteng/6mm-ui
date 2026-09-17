import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import MessageBox from '../MessageBox.vue'

afterEach(() => {
  document.body.style.overflow = ''
  document.querySelectorAll('[data-mm-component="dialog"]').forEach((element) => element.remove())
})

describe('MmMessageBox', () => {
  it('validates prompt input before confirming', async () => {
    const wrapper = mount(MessageBox, {
      attachTo: document.body,
      props: {
        inputValidator: (value: string) => value.length >= 3 || '至少输入 3 个字符',
        message: '请输入审批备注',
        modelValue: true,
        title: '审批确认',
        type: 'prompt',
      },
    })
    await nextTick()

    document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.click()
    await flushPromises()
    await nextTick()
    expect(document.body.textContent).toContain('至少输入 3 个字符')
    expect(wrapper.emitted('action')).toBeUndefined()

    const input = document.body.querySelector<HTMLInputElement>('[data-message-box-input]')!
    expect(document.activeElement).toBe(input)
    expect(input.getAttribute('aria-describedby')).toMatch(/^mm-message-box-error-/)
    input.value = '审批通过'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.click()
    await flushPromises()
    await nextTick()
    expect(wrapper.emitted('action')?.at(-1)).toEqual(['confirm', '审批通过'])
  })

  it('emits cancel from the secondary action', async () => {
    const wrapper = mount(MessageBox, {
      attachTo: document.body,
      props: { message: '确认撤销？', modelValue: true, type: 'confirm' },
    })
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('[data-message-box-cancel]')?.click()
    await nextTick()
    expect(wrapper.emitted('action')?.at(-1)).toEqual(['cancel', ''])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })
})
