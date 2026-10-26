import { computed, inject, provide, type Component, type InjectionKey } from 'vue'
import { useLocale, mmLocaleKey, createMmLocaleContext } from '../../composables/use-locale'
export interface PresentationContext { symbolComponent?: Component; showSources: boolean; locale?: string }
const key: InjectionKey<() => PresentationContext> = Symbol('prediction-presentation')
export const providePresentation = (value: () => PresentationContext) => {
    const fallback = useLocale()
    provide(key, value)
    provide(mmLocaleKey, createMmLocaleContext(computed(() => value().locale === 'en-US' ? 'en-US' : value().locale === 'zh-CN' ? 'zh-CN' : fallback.locale.value)))
}
export const usePresentation = () => inject(key, () => ({ showSources: true }))
