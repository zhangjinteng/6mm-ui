import type { App } from 'vue'

import { components } from './components'
import {
  createMmLocaleContext,
  mmLocaleKey,
  setGlobalMmLocaleContext,
  type MmUILocaleSource,
} from './composables/use-locale'
import { vMmLoading } from './directives/loading'

export interface MmUIThemeColors {
  danger?: string
  dangerSoft?: string
  info?: string
  infoSoft?: string
  onPrimary?: string
  primary?: string
  primaryHover?: string
  primarySoft?: string
  success?: string
  successSoft?: string
  warning?: string
  warningSoft?: string
}

export interface MmUITheme extends MmUIThemeColors {
  dark?: MmUIThemeColors
  light?: MmUIThemeColors
}

export interface MmUIOptions {
  locale?: MmUILocaleSource
  theme?: MmUITheme
}

export interface MmUIPlugin {
  install: (app: App, options?: MmUIOptions) => void
}

const themeVariables: Record<keyof MmUIThemeColors, string> = {
  danger: '--mm-color-danger',
  dangerSoft: '--mm-color-danger-soft',
  info: '--mm-color-info',
  infoSoft: '--mm-color-info-soft',
  onPrimary: '--mm-color-on-primary',
  primary: '--mm-color-primary',
  primaryHover: '--mm-color-primary-hover',
  primarySoft: '--mm-color-primary-soft',
  success: '--mm-color-success',
  successSoft: '--mm-color-success-soft',
  warning: '--mm-color-warning',
  warningSoft: '--mm-color-warning-soft',
}

function themeValue(value: string | undefined): string | undefined {
  const normalized = value?.trim()
  return normalized || undefined
}

function applyThemeColors(style: CSSStyleDeclaration, theme: MmUIThemeColors | undefined): void {
  if (!theme) return

  for (const [key, variable] of Object.entries(themeVariables) as Array<[keyof MmUIThemeColors, string]>) {
    const value = themeValue(theme[key])
    if (value) style.setProperty(variable, value)
  }

  const primary = themeValue(theme.primary)
  if (primary && !themeValue(theme.primaryHover)) {
    style.setProperty('--mm-color-primary-hover', 'color-mix(in srgb, var(--mm-color-primary) 86%, var(--mm-color-text))')
  }
  if (primary && !themeValue(theme.primarySoft)) {
    style.setProperty('--mm-color-primary-soft', 'color-mix(in srgb, var(--mm-color-primary) 12%, var(--mm-color-panel))')
  }
  if (primary) {
    style.setProperty('--mm-focus-ring', '0 0 0 1px color-mix(in srgb, var(--mm-color-primary) 38%, transparent)')
  }

  for (const key of ['danger', 'info', 'success', 'warning'] as const) {
    const softKey = `${key}Soft` as const
    if (themeValue(theme[key]) && !themeValue(theme[softKey])) {
      style.setProperty(
        themeVariables[softKey],
        `color-mix(in srgb, var(${themeVariables[key]}) 12%, var(--mm-color-panel))`,
      )
    }
  }
}

function createThemeRules(): CSSStyleRule[] {
  const selector = 'style[data-mm-ui-theme]'
  const existing = document.head.querySelector<HTMLStyleElement>(selector)
  const style = existing ?? document.createElement('style')
  style.setAttribute('data-mm-ui-theme', '')
  style.textContent = [
    ':root {}',
    ":root:not([data-mm-theme]), [data-mm-theme='light'] {}",
    "[data-mm-theme='dark'] {}",
  ].join('\n')
  if (!existing) document.head.append(style)
  return Array.from(style.sheet?.cssRules ?? []).filter(
    (rule): rule is CSSStyleRule => rule instanceof CSSStyleRule,
  )
}

function applyTheme(theme: MmUITheme | undefined): void {
  if (!theme || typeof document === 'undefined') return

  const [sharedRule, lightRule, darkRule] = createThemeRules()
  if (!sharedRule || !lightRule || !darkRule) return
  applyThemeColors(sharedRule.style, theme)
  applyThemeColors(lightRule.style, theme.light)
  applyThemeColors(darkRule.style, theme.dark)
}

export function install(app: App, options: MmUIOptions = {}): void {
  applyTheme(options.theme)
  const localeContext = createMmLocaleContext(options.locale)
  app.provide(mmLocaleKey, localeContext)
  app.config.globalProperties.$mmLocale = localeContext
  setGlobalMmLocaleContext(localeContext)
  for (const component of components) {
    if (component.name) app.component(component.name, component)
  }
  app.directive('mm-loading', vMmLoading)
}

const MmUI: MmUIPlugin = {
  install,
}

export default MmUI
