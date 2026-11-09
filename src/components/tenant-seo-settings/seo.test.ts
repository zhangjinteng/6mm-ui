import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { MmSelect } from '../select'
import Seo from './TenantSeoSettings.vue'
import SeoTranslations from './TenantSeoTranslations.vue'
import type { TenantSeoDetail, TenantSeoSettingsProps } from './model'
const detail = (site_id = '10'): TenantSeoDetail => ({ tenant_id: '1', tenant_name: 'Alpha', site_id, site_name: 'Main', primary_domain: 'site.example',
  indexing_enabled: false, effective_indexing_enabled: false, blocking_reason: null, configured_locales: 1, total_locales: 20, updated_at: null,
  default_locale: 'zh-CN', translations: { 'zh-CN': { title: 'Title', description: 'Description' } }, version: 0,
  og_image_url: null, google_verification_token: null, verification_domain: null, verification_domain_matches: false,
  locales: [{ value: 'zh-CN', label: '简体中文' }, { value: 'en', label: 'English' }],
  sites: [{ site_id: '10', site_name: 'Main' }, { site_id: '11', site_name: 'Second' }], can_edit: true })
const callbacks = { loadContext: vi.fn(async () => ({ available: false, reason: '尚未开启', settings: null })), translate: vi.fn() }
const button = (w: ReturnType<typeof mount>, text: string) => w.findAll('button').find(b => b.text().trim() === text)!
function setup(extra: Partial<TenantSeoSettingsProps> = {}) {
  const save = vi.fn(async input => ({ changed: true, version: 1, detail: { ...detail(), ...input, version: 1 } }))
  const load = vi.fn(async (_signal, siteId) => detail(siteId))
  const w = mount(Seo, { props: { load, save, translation: callbacks, ...extra }, global: { stubs: { teleport: true } } })
  return { w, save, load }
}
describe('shared SEO page behavior', () => {
  it('previews and clears the same site image in both layouts', async () => {
    const url = 'https://cdn.example.test/share.png'
    for (const fullPage of [true, false]) {
      const { w, save } = setup({ fullPage, load: async () => ({ ...detail(), og_image_url: url }) })
      await flushPromises()
      expect(w.get('.seo-share-preview').attributes('src')).toBe(url)
      const field = w.get('input[aria-label="分享预览图"]')
      await field.setValue('javascript:alert(1)')
      await button(w, '保存配置').trigger('click')
      expect(save).not.toHaveBeenCalled()
      expect(w.find('.seo-share-preview').exists()).toBe(false)
      await field.setValue('')
      await button(w, '保存配置').trigger('click'); await flushPromises()
      expect(save.mock.calls[0][0].og_image_url).toBeNull()
      w.unmount()
    }
  })
  it('opens own-space translation settings from the header and refreshes targets without losing the SEO draft', async () => {
    const settings = { space_id: '55', space_revision: '1', target_locales: ['en'], provider: 'google', api_version: 'v2',
      credential_ref: 'database', credential_configured: true, credential_source: 'database' as const, api_key_mask: '••••1234',
      supported: true, is_enabled: true, concurrency_limit: 3, request_timeout_seconds: 30, max_attempts: 3 }
    const testConnection = vi.fn(async () => ({ connected: true }))
    const saveSettings = vi.fn(async (input, _apiKey: string) => ({ ...input, space_revision: '2', target_locales: ['en', 'ja'] }))
    const w = mount(SeoTranslations, { props: {
      siteId: '10', readonly: false, editingLocale: 'zh-CN',
      locales: [...detail().locales, { value: 'ja', label: '日本語' }], translations: detail().translations,
      callbacks: { loadContext: async () => ({ available: true, reason: null, source_locale: 'zh-CN', settings }),
        translate: vi.fn(), saveSettings, testConnection },
    }, global: { stubs: { teleport: true } } })
    await flushPromises()
    expect(w.find('.mm-dialog__header-actions').text()).toContain('翻译配置')
    await w.get('input[aria-label="zh-CN 首页标题"]').setValue('Unsaved SEO draft')
    await button(w, '翻译配置').trigger('click'); await flushPromises()
    expect(w.text()).toContain('当前内容空间共用')
    expect(w.text()).toContain('••••1234')
    const toggle = w.get('.mm-translation-enabled [role="switch"]')
    expect(toggle.attributes('aria-checked')).toBe('true')
    expect(toggle.attributes('disabled')).toBeUndefined()
    await toggle.trigger('click')
    await flushPromises()
    expect(w.get('.mm-translation-enabled [role="switch"]').attributes('aria-checked')).toBe('false')
    expect(saveSettings).not.toHaveBeenCalled()
    const key = w.get('input[aria-label="Google API Key"]')
    expect(key.attributes('type')).toBe('password')
    await key.setValue('FAKE_SEO_CANDIDATE')
    await button(w, '测试连接').trigger('click'); await flushPromises()
    expect(testConnection).toHaveBeenCalledWith('55', '1', 'FAKE_SEO_CANDIDATE')
    await button(w, '保存翻译配置').trigger('click'); await flushPromises()
    expect(saveSettings.mock.calls[0][1]).toBe('FAKE_SEO_CANDIDATE')
    expect(saveSettings.mock.calls[0][0].is_enabled).toBe(false)
    expect(w.find('input[aria-label="ja 首页标题"]').exists()).toBe(true)
    expect(w.get<HTMLInputElement>('input[aria-label="zh-CN 首页标题"]').element.value).toBe('Unsaved SEO draft')
    await button(w, '翻译配置').trigger('click'); await flushPromises()
    expect(w.get<HTMLInputElement>('input[aria-label="Google API Key"]').element.value).toBe('')
    w.unmount()
  })
  it('loads server values without inserting or autosaving', async () => {
    const { w, save } = setup(); await flushPromises()
    expect(w.find<HTMLInputElement>('input[aria-label="首页标题"]').element.value).toBe('Title')
    expect(button(w, '多语言文案').get('.mm-button__icon .mm-icon').attributes('stroke')).toBe('currentColor')
    expect(button(w, '保存配置').attributes('disabled')).toBeDefined()
    expect(save).not.toHaveBeenCalled(); w.unmount()
  })
  it('sends only the selected server site, version and SEO draft', async () => {
    const { w, save } = setup(); await flushPromises()
    await w.get('input[aria-label="首页标题"]').setValue('Updated')
    expect(save).not.toHaveBeenCalled()
    await button(w, '保存配置').trigger('click'); await flushPromises()
    expect(save).toHaveBeenCalledTimes(1)
    expect(save.mock.calls[0][0]).toEqual({ site_id: '10', expected_version: 0, indexing_enabled: false, default_locale: 'zh-CN', translations: { 'zh-CN': { title: 'Updated', description: 'Description' } }, og_image_url: null, google_verification_token: null, verification_domain: null })
    expect(button(w, '保存配置').attributes('disabled')).toBeDefined()
    await w.get('input[aria-label="首页标题"]').setValue('Again')
    await button(w, '保存配置').trigger('click'); await flushPromises()
    expect(save.mock.calls[1][0].expected_version).toBe(1); w.unmount()
  })
  it('keeps failed drafts and suppresses concurrent saves', async () => {
    let reject!: (e: Error) => void
    const save = vi.fn(() => new Promise((_, fail) => { reject = fail }))
    const { w } = setup({ save: save as TenantSeoSettingsProps['save'] }); await flushPromises()
    await w.get('input[aria-label="首页标题"]').setValue('Keep')
    await button(w, '保存配置').trigger('click'); await button(w, '保存配置').trigger('click')
    expect(save).toHaveBeenCalledTimes(1)
    expect(w.get('input[aria-label="首页标题"]').attributes('disabled')).toBeDefined()
    reject(new Error('conflict')); await flushPromises()
    expect(w.text()).toContain('保存失败，修改已保留')
    expect(w.get<HTMLInputElement>('input[aria-label="首页标题"]').element.value).toBe('Keep'); w.unmount()
  })
  it('enforces both host and server read-only permissions', async () => {
    for (const extra of [{ canEdit: false }, { load: async () => ({ ...detail(), can_edit: false }) }]) {
      const { w, save } = setup(extra); await flushPromises()
      expect(w.get('input[aria-label="首页标题"]').attributes('disabled')).toBeDefined()
      expect(button(w, '保存配置')).toBeUndefined()
      expect(save).not.toHaveBeenCalled(); w.unmount()
    }
  })
  it('only switches to owned sites and confirms dirty changes', async () => {
    const { w, load } = setup(); await flushPromises()
    await w.get('input[aria-label="首页标题"]').setValue('Draft')
    w.findComponent(MmSelect).vm.$emit('update:modelValue', '99'); await nextTick()
    expect(load).toHaveBeenCalledTimes(1)
    w.findComponent(MmSelect).vm.$emit('update:modelValue', '11'); await nextTick()
    expect(w.text()).toContain('放弃未保存的修改')
    await button(w, '继续编辑').trigger('click')
    await button(w, '放弃修改').trigger('click'); await flushPromises()
    expect(load.mock.calls.at(-1)?.[1]).toBe('10')
    w.findComponent(MmSelect).vm.$emit('update:modelValue', '11'); await flushPromises()
    expect(load.mock.calls.at(-1)?.[1]).toBe('11'); w.unmount()
  })
  it('retries a failed load and aborts pending reads on unmount', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValue(detail())
    const { w } = setup({ load }); await flushPromises()
    await button(w, '重新加载').trigger('click'); await flushPromises()
    expect(w.get<HTMLInputElement>('input[aria-label="首页标题"]').element.value).toBe('Title'); w.unmount()
    let signal: AbortSignal | undefined
    const pending = setup({ load: async s => { signal = s; return new Promise(() => {}) } }).w
    await nextTick(); pending.unmount(); expect(signal?.aborted).toBe(true)
  })
})
