import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Message from '../Message.vue'

afterEach(() => vi.useRealTimers())

describe('MmMessage', () => {
  it('announces semantic status and closes from its button once', async () => {
    const wrapper = mount(Message, {
      props: { closable: true, duration: 0, message: '发布失败', type: 'error' },
    })

    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.attributes('aria-live')).toBe('assertive')
    await wrapper.get('button[aria-label="关闭消息"]').trigger('click')
    await wrapper.get('button[aria-label="关闭消息"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('auto closes after duration and pauses while hovered', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Message, { props: { duration: 100, message: '已保存' } })
    vi.advanceTimersByTime(60)
    await wrapper.trigger('mouseenter')
    vi.advanceTimersByTime(100)
    expect(wrapper.emitted('close')).toBeUndefined()
    await wrapper.trigger('mouseleave')
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
