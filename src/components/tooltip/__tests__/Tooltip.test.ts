import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Tooltip from '../Tooltip.vue'

afterEach(() => {
  vi.useRealTimers()
  document.querySelectorAll('.mm-popover__floating').forEach((element) => element.remove())
})

describe('MmTooltip', () => {
  it('opens from keyboard focus and links the trigger with aria-describedby', async () => {
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: { content: '复制策略链接', openDelay: 0 },
      slots: {
        default: ({ triggerAttrs }: { triggerAttrs: Record<string, string | undefined> }) =>
          h('button', { ...triggerAttrs, 'data-trigger': '' }, '复制'),
      },
    })

    await wrapper.get('[data-trigger]').trigger('focusin')
    await nextTick()
    const tooltip = document.body.querySelector<HTMLElement>('[role="tooltip"]')
    const trigger = wrapper.get('[data-trigger]')
    expect(tooltip?.textContent).toContain('复制策略链接')
    expect(trigger.attributes('aria-describedby')).toBe(tooltip?.id)

    await wrapper.get('[data-trigger]').trigger('focusout', { relatedTarget: document.body })
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
  })

  it('honors hover delays and disabled state', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: { closeDelay: 20, content: '风险说明', openDelay: 30 },
      slots: { default: '<button data-trigger>详情</button>' },
    })

    await wrapper.get('.mm-popover__trigger').trigger('mouseenter')
    vi.advanceTimersByTime(29)
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).not.toBeNull()

    await wrapper.setProps({ disabled: true })
    await wrapper.get('.mm-popover__trigger').trigger('mouseleave')
    vi.advanceTimersByTime(20)
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
    await wrapper.get('.mm-popover__trigger').trigger('mouseenter')
    vi.advanceTimersByTime(30)
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
  })

  it('stays open while the pointer moves from the trigger into the tooltip', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: { closeDelay: 20, content: '查看策略详情', openDelay: 0 },
      slots: { default: '<button data-trigger>悬停或聚集</button>' },
    })

    const trigger = wrapper.get('.mm-popover__trigger')
    await trigger.trigger('mouseenter')
    await nextTick()
    const tooltip = document.body.querySelector<HTMLElement>('[role="tooltip"]')!

    await trigger.trigger('mouseleave')
    tooltip.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(20)
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).toBe(tooltip)

    tooltip.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(20)
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
  })
})
