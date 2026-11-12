import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from './TranslationSettingsButton.vue'

describe('shared translation settings button', () => {
  it('uses the dot, label and settings-2 icon in a centered small default button', async () => {
    const w = mount(Button)
    expect(w.classes()).toEqual(expect.arrayContaining(['mm-button--default', 'mm-button--sm']))
    expect(w.text()).toBe('翻译设置')
    expect(w.get('.mm-button__icon .mm-translation-settings-button__provider-dot').attributes('aria-hidden')).toBe('true')
    expect(w.get('svg path').attributes('d')).toBe('M20 7h-9M14 17H5')
    expect(w.get('svg').element.style.height).toBe('15px')
    expect(getComputedStyle(w.get('.mm-button__label').element).alignItems).toBe('center')
    expect(getComputedStyle(w.get('.mm-button__label').element).display).toBe('inline-flex')
    await w.trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
    await w.setProps({ disabled: true })
    await w.trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
    expect(w.attributes('disabled')).toBeDefined()
    await w.setProps({ locale: 'en' })
    expect(w.text()).toBe('Translation settings')
    w.unmount()
  })
})
