import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import { useId } from '../use-id'

describe('useId', () => {
  it('creates stable, unique ids with the requested prefix', () => {
    const host = defineComponent({
      setup() {
        const first = useId('field')
        const second = useId('field')

        return () => h('div', { 'data-first': first, 'data-second': second })
      },
    })
    const wrapper = mount(host)
    const first = wrapper.attributes('data-first')
    const second = wrapper.attributes('data-second')

    expect(first).toMatch(/^field-/)
    expect(second).toMatch(/^field-/)
    expect(first).not.toBe(second)
  })
})
