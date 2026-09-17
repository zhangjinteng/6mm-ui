import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Input from '../Input.vue'

describe('MmInput', () => {
  it('supports v-model, native attributes, slots, count, and clear', async () => {
    const wrapper = mount(Input, {
      attrs: { 'aria-label': 'API key', name: 'apiKey' },
      props: { clearable: true, maxlength: 12, modelValue: 'secret', showCount: true },
      slots: { prefix: '<span data-prefix>#</span>', suffix: '<span data-suffix>USD</span>' },
    })
    const input = wrapper.get('input')

    expect(input.attributes()).toMatchObject({ 'aria-label': 'API key', maxlength: '12', name: 'apiKey' })
    expect(wrapper.find('[data-prefix]').exists()).toBe(true)
    expect(wrapper.find('[data-suffix]').exists()).toBe(true)
    expect(wrapper.get('.mm-input__count').text()).toBe('6 / 12')

    await input.setValue('rotated')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['rotated'])
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toBeInstanceOf(Event)

    await wrapper.get('.mm-input__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('toggles passwords and exposes disabled, readonly, and status semantics', async () => {
    const password = mount(Input, { props: { modelValue: 'six-mm', showPassword: true, type: 'password' } })
    expect(password.get('input').attributes('type')).toBe('password')
    await password.get('.mm-input__password').trigger('click')
    expect(password.get('input').attributes('type')).toBe('text')

    const wrapper = mount(Input, {
      props: { disabled: true, modelValue: 'locked', readonly: true, status: 'error' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['is-disabled', 'is-readonly', 'is-error']))
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.get('input').attributes('readonly')).toBeDefined()
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })
})
