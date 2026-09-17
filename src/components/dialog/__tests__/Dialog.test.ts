import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Dialog from '../Dialog.vue'

afterEach(() => {
  document.body.style.overflow = ''
  document.querySelectorAll('[data-mm-component="dialog"]').forEach((element) => element.remove())
})

describe('MmDialog', () => {
  it('teleports, traps focus, closes on Escape, and restores focus', async () => {
    const outside = document.createElement('button')
    outside.textContent = '打开'
    document.body.append(outside)
    outside.focus()
    const wrapper = mount(Dialog, {
      attachTo: document.body,
      props: { modelValue: true, title: '发布确认' },
      slots: {
        default: '<p>确认发布策略？</p>',
        footer: '<button data-cancel>取消</button><button data-confirm>确认</button>',
      },
    })
    await nextTick()

    const overlay = document.body.querySelector<HTMLElement>('[data-mm-component="dialog"]')
    expect(overlay).not.toBeNull()
    expect(overlay?.getAttribute('role')).toBeNull()
    expect(overlay?.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true')
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement).toBe(overlay?.querySelector('[aria-label="关闭对话框"]'))

    const last = overlay?.querySelector<HTMLButtonElement>('[data-confirm]')
    last?.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }))
    expect(document.activeElement).toBe(overlay?.querySelector('[aria-label="关闭对话框"]'))

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(document.body.querySelector('[data-mm-component="dialog"]')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })

  it('honors mask settings and an asynchronous before-close hook', async () => {
    const beforeClose = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true)
    const wrapper = mount(Dialog, {
      attachTo: document.body,
      props: { beforeClose, modelValue: true, title: '敏感操作' },
    })
    await nextTick()
    const overlay = document.body.querySelector<HTMLElement>('[data-mm-component="dialog"]')!

    overlay.click()
    await nextTick()
    expect(beforeClose).toHaveBeenCalledTimes(1)
    expect(document.body.querySelector('[data-mm-component="dialog"]')).not.toBeNull()

    overlay.click()
    await nextTick()
    await nextTick()
    expect(beforeClose).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('close')?.at(-1)).toEqual(['mask'])
    expect(document.body.querySelector('[data-mm-component="dialog"]')).toBeNull()
  })

  it('renders header actions outside the accessible dialog title', async () => {
    const wrapper = mount(Dialog, {
      attachTo: document.body,
      props: { modelValue: true },
      slots: {
        header: '<span>用户详情</span>',
        'header-actions': '<button>切换类型</button>',
      },
    })
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('[role="dialog"]')!
    const title = document.getElementById(panel.getAttribute('aria-labelledby')!)
    expect(title?.textContent).toBe('用户详情')
    expect(panel.querySelector('.mm-dialog__header-actions')?.textContent).toContain('切换类型')
    wrapper.unmount()
  })

  it('only lets the topmost nested dialog consume Escape', async () => {
    const first = mount(Dialog, { attachTo: document.body, props: { modelValue: true, title: '第一层' } })
    const second = mount(Dialog, { attachTo: document.body, props: { modelValue: true, title: '第二层' } })
    await nextTick()
    const overlays = Array.from(document.body.querySelectorAll<HTMLElement>('[data-mm-component="dialog"]'))
    expect(Number(overlays[1]?.style.zIndex)).toBeGreaterThan(Number(overlays[0]?.style.zIndex))

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await nextTick()
    expect(second.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(first.emitted('update:modelValue')).toBeUndefined()
    expect(document.body.style.overflow).toBe('hidden')

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await nextTick()
    expect(first.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(document.body.style.overflow).toBe('')
  })
})
