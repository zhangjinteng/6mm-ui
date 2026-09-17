import {
  computed,
  inject,
  isRef,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'

import { enUS, zhCN, type MmUILocale, type MmUILocaleMessages, type MmUILocaleName } from '../locales'

export type MmUILocaleSource = MmUILocaleName | Readonly<Ref<MmUILocaleName>>

export interface MmUILocaleContext {
  locale: ComputedRef<MmUILocaleName>
  messages: ComputedRef<MmUILocaleMessages>
}

const locales: Record<MmUILocaleName, MmUILocale> = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

export const mmLocaleKey: InjectionKey<MmUILocaleContext> = Symbol('mm-ui-locale')

export function createMmLocaleContext(source: MmUILocaleSource = 'zh-CN'): MmUILocaleContext {
  const locale = computed<MmUILocaleName>(() => {
    const value = isRef(source) ? source.value : source
    return locales[value] ? value : 'zh-CN'
  })
  const messages = computed(() => locales[locale.value].messages)
  return { locale, messages }
}

const fallbackLocale = createMmLocaleContext()
let globalLocale = fallbackLocale

export function getGlobalMmLocaleContext(): MmUILocaleContext {
  return globalLocale
}

export function setGlobalMmLocaleContext(context: MmUILocaleContext): void {
  globalLocale = context
}

export function useLocale(): MmUILocaleContext {
  return inject(mmLocaleKey, fallbackLocale)
}
