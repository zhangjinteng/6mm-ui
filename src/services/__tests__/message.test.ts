import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { message } from '../message'

afterEach(() => {
  message.closeAll()
  vi.useRealTimers()
})

describe('message service', () => {
  it('queues messages and returns idempotent close handles', async () => {
    const first = message.info({ duration: 0, message: '队列第一项' })
    message.success({ duration: 0, message: '队列第二项' })
    await nextTick()

    const items = Array.from(document.body.querySelectorAll('.mm-message'))
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining('队列第一项'),
      expect.stringContaining('队列第二项'),
    ])
    expect(document.body.querySelector('.mm-message-stack')?.getAttribute('aria-label')).toBe('消息通知')

    first.close()
    first.close()
    await nextTick()
    expect(document.body.textContent).not.toContain('队列第一项')
    expect(document.body.textContent).toContain('队列第二项')
  })

  it('removes timed messages and tears down an empty host', async () => {
    vi.useFakeTimers()
    message({ duration: 80, message: '短消息' })
    await nextTick()
    vi.advanceTimersByTime(80)
    await nextTick()
    await Promise.resolve()
    expect(document.body.querySelector('.mm-message-stack')).toBeNull()
  })
})
