import { createApp, defineComponent, h, reactive } from 'vue'
import type { App } from 'vue'

import { MmMessage } from '../components/message'
import type { MessageProps, MessageType } from '../components/message'
import { getGlobalMmLocaleContext, mmLocaleKey } from '../composables/use-locale'

export interface MessageOptions extends Omit<MessageProps, 'message'> {
  message: string
}

export interface MessageHandler {
  close: () => void
  id: string
}

export interface MessageService {
  (options: MessageOptions | string): MessageHandler
  closeAll: () => void
  error: (options: MessageOptions | string) => MessageHandler
  info: (options: MessageOptions | string) => MessageHandler
  success: (options: MessageOptions | string) => MessageHandler
  warning: (options: MessageOptions | string) => MessageHandler
}

interface MessageRecord extends Required<MessageOptions> {
  id: string
}

const records = reactive<MessageRecord[]>([])
let hostApp: App | undefined
let hostContainer: HTMLElement | undefined
let nextMessageId = 0

function normalize(options: MessageOptions | string, type?: MessageType): Required<MessageOptions> {
  const value = typeof options === 'string' ? { message: options } : options
  return {
    closable: value.closable ?? true,
    duration: value.duration ?? 3000,
    message: value.message,
    showIcon: value.showIcon ?? true,
    type: type ?? value.type ?? 'info',
  }
}

function destroyHost(): void {
  if (records.length > 0) return
  hostApp?.unmount()
  hostContainer?.remove()
  hostApp = undefined
  hostContainer = undefined
}

function remove(id: string): void {
  const index = records.findIndex((record) => record.id === id)
  if (index < 0) return
  records.splice(index, 1)
  if (records.length === 0) queueMicrotask(destroyHost)
}

function ensureHost(): boolean {
  if (hostApp) return true
  if (typeof document === 'undefined' || !document.body) return false
  const container = document.createElement('div')
  container.dataset.mmMessageHost = ''
  document.body.append(container)
  const localeContext = getGlobalMmLocaleContext()
  const host = defineComponent({
    name: 'MmMessageServiceHost',
    setup: () => () => h(
      'div',
      {
        'aria-label': localeContext.messages.value.message.notifications,
        class: 'mm-message-stack',
      },
      records.map((record) =>
        h(MmMessage, { ...record, key: record.id, onClose: () => remove(record.id) }),
      ),
    ),
  })
  hostContainer = container
  hostApp = createApp(host)
  hostApp.provide(mmLocaleKey, localeContext)
  hostApp.mount(container)
  return true
}

function open(options: MessageOptions | string, type?: MessageType): MessageHandler {
  const id = `mm-message-${++nextMessageId}`
  let closed = false
  if (ensureHost()) records.push({ ...normalize(options, type), id })
  return {
    close: () => {
      if (closed) return
      closed = true
      remove(id)
    },
    id,
  }
}

const service = ((options: MessageOptions | string) => open(options)) as MessageService
service.info = (options) => open(options, 'info')
service.success = (options) => open(options, 'success')
service.warning = (options) => open(options, 'warning')
service.error = (options) => open(options, 'error')
service.closeAll = () => {
  records.splice(0)
  destroyHost()
}

export const message = service
