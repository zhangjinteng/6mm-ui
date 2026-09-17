import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Scrollbar from '../Scrollbar.vue'

describe('MmScrollbar', () => {
  it('applies viewport sizing, emits scroll positions, and exposes controls', async () => {
    const wrapper = mount(Scrollbar, {
      props: { always: true, height: 120, maxHeight: 240 },
      slots: { default: '<div style="height:400px">Scrollable</div>' },
    })
    const viewport = wrapper.find('.mm-scrollbar__wrap')
    const scrollTo = vi.fn()
    Object.defineProperty(viewport.element, 'scrollTo', { configurable: true, value: scrollTo })

    expect(wrapper.classes()).toContain('is-always')
    expect(viewport.attributes('style')).toContain('height: 120px')
    expect(viewport.attributes('style')).toContain('max-height: 240px')

    wrapper.vm.scrollTo({ top: 80 })
    expect(scrollTo).toHaveBeenCalledWith({ top: 80 })

    wrapper.vm.setScrollTop(42)
    await viewport.trigger('scroll')
    expect(wrapper.emitted('scroll')?.[0]).toEqual([{ scrollLeft: 0, scrollTop: 42 }])
  })
})
