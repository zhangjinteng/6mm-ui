import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Toggle from './TranslationEnabledToggle.vue'

describe('shared translation enable control', () => {
  it('labels the switch and emits boolean changes without saving', async () => {
    const w = mount(Toggle, { props: { modelValue: false, credentialReady: true } })
    const control = w.get('[role="switch"]')
    expect(control.attributes('aria-checked')).toBe('false')
    expect(w.get(`#${control.attributes('aria-labelledby')}`).text()).toBe('开启自动翻译')
    expect(w.text()).toContain('保存配置后生效')
    await control.trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[true]])
    await w.setProps({ modelValue: true })
    expect(control.attributes('aria-checked')).toBe('true')
    await control.trigger('click')
    expect(w.emitted('update:modelValue')?.[1]).toEqual([false])
    w.unmount()
  })
  it('blocks changes without credentials and while busy', async () => {
    const w = mount(Toggle, { props: { modelValue: false, credentialReady: false } })
    const control = w.get('button')
    expect(control.attributes('disabled')).toBeDefined()
    expect(w.text()).toContain('请先配置 Google API Key')
    await control.trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    await w.setProps({ credentialReady: true, disabled: true })
    await control.trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    await w.setProps({ disabled: false })
    expect(control.attributes('disabled')).toBeUndefined()
    w.unmount()
  })
})
