import { createApp, defineComponent, h } from 'vue'
import type { App } from 'vue'

import { MmMessageBox } from '../components/message-box'
import type { MessageBoxAction, MessageBoxProps, MessageBoxType } from '../components/message-box'
import { getGlobalMmLocaleContext, mmLocaleKey } from '../composables/use-locale'

export interface MessageBoxOptions extends Omit<MessageBoxProps, 'message' | 'modelValue'> {
  message: string
}

export interface MessageBoxResult {
  action: 'confirm'
  value: string
}

export type MessageBoxPromise = Promise<MessageBoxResult> & { close: () => void }

export interface MessageBoxService {
  (options: MessageBoxOptions | string): MessageBoxPromise
  alert: (message: string, title?: string, options?: Partial<MessageBoxOptions>) => MessageBoxPromise
  confirm: (message: string, title?: string, options?: Partial<MessageBoxOptions>) => MessageBoxPromise
  prompt: (message: string, title?: string, options?: Partial<MessageBoxOptions>) => MessageBoxPromise
}

export class MessageBoxCancelError extends Error {
  action: Exclude<MessageBoxAction, 'confirm'>

  constructor(action: Exclude<MessageBoxAction, 'confirm'>) {
    super(action === 'cancel' ? 'Message box cancelled' : 'Message box closed')
    this.name = 'MessageBoxCancelError'
    this.action = action
  }
}

function normalize(options: MessageBoxOptions | string, type?: MessageBoxType): MessageBoxOptions {
  const value = typeof options === 'string' ? { message: options } : options
  return { ...value, type: type ?? value.type ?? 'alert' }
}

function open(options: MessageBoxOptions | string, type?: MessageBoxType): MessageBoxPromise {
  const normalized = normalize(options, type)
  let app: App | undefined
  let container: HTMLElement | undefined
  let settled = false
  let settle: (action: MessageBoxAction, value?: string) => void = () => undefined

  const promise = new Promise<MessageBoxResult>((resolve, reject) => {
    const cleanup = (): void => {
      app?.unmount()
      container?.remove()
      app = undefined
      container = undefined
    }
    settle = (action, value = '') => {
      if (settled) return
      settled = true
      if (action === 'confirm') resolve({ action, value })
      else reject(new MessageBoxCancelError(action))
      queueMicrotask(cleanup)
    }

    if (typeof document === 'undefined' || !document.body) {
      settle('close')
      return
    }

    container = document.createElement('div')
    container.dataset.mmMessageBoxHost = ''
    document.body.append(container)
    const host = defineComponent({
      name: 'MmMessageBoxServiceHost',
      setup: () => () => h(MmMessageBox, {
        ...normalized,
        modelValue: true,
        onAction: (action: MessageBoxAction, value: string) => settle(action, value),
      }),
    })
    app = createApp(host)
    app.provide(mmLocaleKey, getGlobalMmLocaleContext())
    app.mount(container)
  }) as MessageBoxPromise

  promise.close = () => settle('close')
  return promise
}

function withType(type: MessageBoxType) {
  return (message: string, title?: string, options: Partial<MessageBoxOptions> = {}): MessageBoxPromise =>
    open({ ...options, message, title: title ?? options.title, type }, type)
}

const service = ((options: MessageBoxOptions | string) => open(options)) as MessageBoxService
service.alert = withType('alert')
service.confirm = withType('confirm')
service.prompt = withType('prompt')

export const messageBox = service
