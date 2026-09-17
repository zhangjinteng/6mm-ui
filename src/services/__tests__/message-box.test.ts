import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import { MessageBoxCancelError, messageBox } from '../message-box'

afterEach(() => {
  document.body.style.overflow = ''
  document.querySelectorAll('[data-mm-message-box-host]').forEach((element) => element.remove())
})

describe('message box service', () => {
  it('resolves confirm and prompt results', async () => {
    const confirmation = messageBox.confirm('确认发布？', '发布策略')
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.click()
    await expect(confirmation).resolves.toEqual({ action: 'confirm', value: '' })

    const prompt = messageBox.prompt('输入变更单号', '审计信息', { inputValue: 'CR-2048' })
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.click()
    await expect(prompt).resolves.toEqual({ action: 'confirm', value: 'CR-2048' })
  })

  it('rejects cancellation and exposes an idempotent close method', async () => {
    const cancellation = messageBox.confirm('确认撤销？')
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('[data-message-box-cancel]')?.click()
    await expect(cancellation).rejects.toMatchObject({ action: 'cancel' })

    const external = messageBox.alert('外部关闭')
    external.close()
    external.close()
    await expect(external).rejects.toBeInstanceOf(MessageBoxCancelError)
  })
})
