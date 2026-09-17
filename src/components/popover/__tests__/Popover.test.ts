import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import { MmDialog } from '../../dialog'
import Popover from '../Popover.vue'

describe('MmPopover', () => {
  it('teleports content, emits visibility, and closes on outside pointerdown', async () => {
    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: { placement: 'bottom-start' },
      slots: {
        content: '<button data-content-action>操作</button>',
        default: '<button data-trigger>打开</button>',
      },
    })

    await wrapper.get('[data-trigger]').trigger('click')
    await nextTick()
    const floating = document.body.querySelector<HTMLElement>('.mm-popover__floating')
    expect(floating).not.toBeNull()
    expect(floating?.dataset.placement).toBe('bottom-start')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await nextTick()
    expect(document.body.querySelector('.mm-popover__floating')).toBeNull()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const wrapper = mount(Popover, {
      attachTo: document.body,
      slots: {
        content: '<button data-inside>内部操作</button>',
        default: '<button data-trigger>打开</button>',
      },
    })
    const trigger = wrapper.get<HTMLButtonElement>('[data-trigger]')
    trigger.element.focus()
    await trigger.trigger('click')
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('[data-inside]')?.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await nextTick()

    expect(document.body.querySelector('.mm-popover__floating')).toBeNull()
    expect(document.activeElement).toBe(trigger.element)
  })

  it('supports manual controlled visibility and persistent mounting', async () => {
    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: { modelValue: false, persistent: true, trigger: 'manual' },
      slots: { content: '详情', default: '<span>引用</span>' },
    })

    expect(document.body.querySelector('.mm-popover__floating')).not.toBeNull()
    expect(document.body.querySelector<HTMLElement>('.mm-popover__floating')?.style.display).toBe('none')
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(document.body.querySelector<HTMLElement>('.mm-popover__floating')?.style.display).not.toBe('none')
  })

  it('forwards a custom class to the teleported floating surface', async () => {
    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: { floatingClass: 'catalog-preview-popover' },
      slots: { content: '详情', default: '<button data-trigger>打开</button>' },
    })

    await wrapper.get('[data-trigger]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.mm-popover__floating.catalog-preview-popover')).not.toBeNull()
  })

  it('renders above the dialog that owns the popover', async () => {
    const Host = defineComponent({
      components: { MmDialog, Popover },
      template: `
        <MmDialog :model-value="true" title="筛选">
          <Popover placement="bottom-start">
            <button data-nested-trigger type="button">状态</button>
            <template #content><button type="button">在线</button></template>
          </Popover>
        </MmDialog>
      `,
    })
    mount(Host, { attachTo: document.body })
    await nextTick()

    const trigger = document.body.querySelector<HTMLButtonElement>('[data-nested-trigger]')!
    const overlay = document.body.querySelector<HTMLElement>('[data-mm-component="dialog"]')!
    expect(trigger.closest('.mm-dialog__overlay')).toBe(overlay)
    trigger.click()
    await nextTick()
    await nextTick()

    const floating = document.body.querySelector<HTMLElement>('.mm-popover__floating')!
    expect(Number(floating.style.zIndex)).toBeGreaterThan(Number(overlay.style.zIndex))
  })
})
