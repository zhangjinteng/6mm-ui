import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Drawer from '../Drawer.vue'

afterEach(() => {
  document.body.style.overflow = ''
  document.querySelectorAll('[data-mm-component="drawer"]').forEach((element) => element.remove())
})

describe('MmDrawer', () => {
  it.each(['left', 'right', 'top', 'bottom'] as const)('supports %s placement', async (placement) => {
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { modelValue: true, placement, size: 360, title: '审计详情' },
      slots: { default: '内容' },
    })
    await nextTick()

    const overlay = document.body.querySelector<HTMLElement>('[data-mm-component="drawer"]')
    const panel = overlay?.querySelector<HTMLElement>('.mm-dialog__panel')
    expect(overlay?.classList.contains(`mm-drawer--${placement}`)).toBe(true)
    expect(placement === 'left' || placement === 'right' ? panel?.style.width : panel?.style.height).toBe('360px')
    expect(panel?.getAttribute('role')).toBe('dialog')
    wrapper.unmount()
  })

  it('shares mask closing, focus return, and scroll locking with Dialog', async () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { modelValue: true, title: '运行记录' },
      slots: { footer: '<button data-ok>知道了</button>' },
    })
    await nextTick()

    expect(document.body.style.overflow).toBe('hidden')
    document.body.querySelector<HTMLElement>('[data-mm-component="drawer"]')?.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })
})
