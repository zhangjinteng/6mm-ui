import { describe, expect, it } from 'vitest'

import { useNamespace } from '../namespace'

describe('useNamespace', () => {
  it('builds BEM class names and namespaced CSS variables', () => {
    const ns = useNamespace('button')

    expect(ns.b()).toBe('mm-button')
    expect(ns.e('icon')).toBe('mm-button__icon')
    expect(ns.m('primary')).toBe('mm-button--primary')
    expect(ns.bem('group', 'item', 'active')).toBe('mm-button-group__item--active')
    expect(ns.is('disabled')).toBe('is-disabled')
    expect(ns.is('disabled', false)).toBe('')
    expect(ns.cssVarName('color', 'primary')).toBe('--mm-color-primary')
    expect(ns.cssVar({ color: 'red', gap: undefined })).toEqual({ '--mm-color': 'red' })
  })
})
