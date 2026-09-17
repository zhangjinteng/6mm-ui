// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { message } from '../message'
import { MessageBoxCancelError, messageBox } from '../message-box'

describe('feedback service SSR safety', () => {
  it('returns an inert, idempotent message handle without a browser document', () => {
    const handle = message.success('服务端不会挂载消息')
    expect(handle.id).toMatch(/^mm-message-/)
    expect(() => {
      handle.close()
      handle.close()
      message.closeAll()
    }).not.toThrow()
  })

  it('rejects a message box request predictably without touching the DOM', async () => {
    const request = messageBox.alert('服务端无法打开对话框')
    request.close()
    await expect(request).rejects.toBeInstanceOf(MessageBoxCancelError)
  })
})
