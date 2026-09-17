import { createApp, defineComponent, h, reactive } from 'vue'
import type { App, Directive, ObjectDirective } from 'vue'

import { MmLoading } from '../components/loading'
import type { LoadingProps } from '../components/loading'
import {
  getGlobalMmLocaleContext,
  mmLocaleKey,
  type MmUILocaleContext,
} from '../composables/use-locale'

export type LoadingDirectiveValue = boolean | (LoadingProps & { visible?: boolean })

interface LoadingElement extends HTMLElement {
  __mmLoading?: LoadingDirectiveInstance
}

interface LoadingDirectiveInstance {
  app: App
  container: HTMLElement
  originalPosition: string
  state: Required<Pick<LoadingProps, 'backdrop' | 'fullscreen' | 'size' | 'visible'>>
    & Pick<LoadingProps, 'text'>
  destroyed: boolean
}

function normalize(value: LoadingDirectiveValue | undefined): LoadingDirectiveInstance['state'] {
  const options = typeof value === 'boolean' ? { visible: value } : value ?? {}
  return {
    backdrop: options.backdrop ?? true,
    fullscreen: options.fullscreen ?? false,
    size: options.size ?? 'md',
    text: options.text,
    visible: options.visible ?? true,
  }
}

function applyValue(instance: LoadingDirectiveInstance, value: LoadingDirectiveValue | undefined): void {
  Object.assign(instance.state, normalize(value))
}

function destroy(element: LoadingElement): void {
  const instance = element.__mmLoading
  if (!instance || instance.destroyed) return
  instance.destroyed = true
  instance.app.unmount()
  instance.container.remove()
  element.style.position = instance.originalPosition
  delete element.__mmLoading
}

export const vMmLoading: ObjectDirective<LoadingElement, LoadingDirectiveValue> = {
  mounted(element, binding) {
    if (typeof document === 'undefined') return
    const state = reactive(normalize(binding.value)) as LoadingDirectiveInstance['state']
    const host = defineComponent({
      name: 'MmLoadingDirectiveHost',
      setup: () => () => h(MmLoading, state),
    })
    const container = document.createElement('div')
    container.dataset.mmLoadingHost = ''
    const originalPosition = element.style.position
    if (getComputedStyle(element).position === 'static') element.style.position = 'relative'
    element.append(container)
    const app = createApp(host)
    const localeContext = (binding.instance as { $mmLocale?: MmUILocaleContext } | null)?.$mmLocale
      ?? getGlobalMmLocaleContext()
    app.provide(mmLocaleKey, localeContext)
    const instance: LoadingDirectiveInstance = { app, container, destroyed: false, originalPosition, state }
    element.__mmLoading = instance
    app.mount(container)
  },
  updated(element, binding) {
    if (element.__mmLoading) applyValue(element.__mmLoading, binding.value)
  },
  beforeUnmount: destroy,
  unmounted: destroy,
}

export const loadingDirective: Directive<HTMLElement, LoadingDirectiveValue> = vMmLoading
