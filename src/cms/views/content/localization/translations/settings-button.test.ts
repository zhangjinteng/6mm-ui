import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { cmsRuntimeKey } from '../../../../runtime'
import Page from './index.vue'

const api = vi.hoisted(() => ({
  getTranslationMetadata: vi.fn(async () => ({ spaces: [{ id: '7', label: 'Test', is_enabled: true }],
    space_id: '7', space_revision: '1', space_enabled: true, source_locale: 'zh-CN', target_locales: ['en'],
    locales: [{ code: 'en', label: 'English', native: 'English', flag: '', done: 0, total: 0 }],
    modules: [], done: 0, total: 0 })),
  getTranslationList: vi.fn(async () => ({ lists: [], count: 0 })),
  getTranslationJob: vi.fn(async () => ({ job: null })),
  getTranslationSettings: vi.fn(async () => ({ space_id: '7', space_revision: '1', target_locales: ['en'],
    provider: 'google', api_version: 'v2', credential_ref: 'database', credential_configured: false,
    supported: true, is_enabled: false, concurrency_limit: 3, request_timeout_seconds: 30, max_attempts: 3 })),
  getTranslationDetail: vi.fn(), saveTranslations: vi.fn(), saveTranslationSettings: vi.fn(),
  testTranslationConnection: vi.fn(), createTranslationJob: vi.fn(), cancelTranslationJob: vi.fn(),
}))
vi.mock('../../../../api/content/translations', () => ({ useTranslationsApi: () => api }))

describe('CMS translation settings entry (Agent and Platform)', () => {
  it.each(['platform', 'white_label'] as const)('keeps the shared button and configuration action in %s', async mode => {
    api.getTranslationSettings.mockClear()
    const w = mount(Page, { global: { stubs: { teleport: true }, provide: {
      [cmsRuntimeKey as symbol]: { mode, hasPermission: () => true },
    } } })
    await flushPromises()
    const button = w.get('.translation-toolbar__actions .mm-translation-settings-button')
    expect(button.text()).toBe('翻译设置')
    expect(button.get('svg path').attributes('d')).toBe('M20 7h-9M14 17H5')
    expect(button.find('.mm-translation-settings-button__provider-dot').exists()).toBe(true)
    expect(button.attributes('disabled')).toBeUndefined()
    await button.trigger('click'); await flushPromises()
    expect(api.getTranslationSettings).toHaveBeenCalledWith('7', expect.any(AbortSignal))
    expect(w.text()).toContain('保存翻译配置')
    w.unmount()
  })
  it('does not expose the configuration button without its existing permission', async () => {
    const w = mount(Page, { global: { stubs: { teleport: true }, provide: {
      [cmsRuntimeKey as symbol]: { mode: 'white_label', hasPermission: (permissions: string[]) => !permissions.includes('cms_translation:config') },
    } } })
    await flushPromises()
    expect(w.find('.translation-toolbar__actions .mm-translation-settings-button').exists()).toBe(false)
    w.unmount()
  })
})
