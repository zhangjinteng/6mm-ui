import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Dialog from './TranslationSettingsDialog.vue'
import type { TranslationSettings } from './types'

const base = (): TranslationSettings => ({ space_id: '41', space_revision: '7', source_locale: 'zh-CN',
  target_locales: ['en'], provider: 'google', api_version: 'v2', credential_ref: 'database',
  credential_configured: true, credential_source: 'database', api_key_mask: '••••1234', supported: true,
  is_enabled: true, concurrency_limit: 3, request_timeout_seconds: 30, max_attempts: 3 })
function fixture(extra = {}) {
  const value = { ...base(), ...extra }
  const actions = { load: vi.fn(async () => value), save: vi.fn(async (s, _key) => ({ ...s, space_revision: '8' })),
    testConnection: vi.fn(async () => ({ connected: true })) }
  const w = mount(Dialog, { props: { modelValue: true, actions,
    locales: [{ value: 'zh-CN', label: '简体中文' }, { value: 'en', label: '英语' }, { value: 'ja', label: '日语' }] },
    global: { stubs: { teleport: true } } })
  return { w, actions, value }
}
const button = (w: VueWrapper, label: string) => w.findAll('button').find(b => b.text() === label)!

describe('shared translation settings (CMS, SEO, tags)', () => {
  it('uses the screen-2 fields and never binds the saved mask as the key', async () => {
    const { w } = fixture(); await flushPromises()
    for (const label of ['目标语言', '开启自动翻译', 'Google API Key', '并发上限', '请求超时（秒）', '最大尝试次数']) expect(w.text()).toContain(label)
    expect((w.get('input[type="password"]').element as HTMLInputElement).value).toBe('')
    expect(w.text()).toContain('••••1234')
    expect(w.text()).toContain('密钥原样存入数据库')
    expect(w.text()).not.toContain('加密保存'); w.unmount()
  })
  it('explains that historical ciphertext needs explicit conversion', async () => {
    const { w } = fixture({ credential_configured: false, credential_error: 'GOOGLE_CREDENTIAL_MIGRATION_REQUIRED' })
    await flushPromises()
    expect(w.text()).toContain('旧密钥尚未转换')
    w.unmount()
  })
  it('tests a candidate without saving and keeps drafts isolated', async () => {
    const { w, actions, value } = fixture(); await flushPromises()
    await w.get('input[type="password"]').setValue('  FAKE-CANDIDATE  ')
    await button(w, '测试连接').trigger('click'); await flushPromises()
    expect(actions.testConnection).toHaveBeenCalledWith(expect.objectContaining({ space_id: '41', space_revision: '7' }), 'FAKE-CANDIDATE')
    expect(actions.save).not.toHaveBeenCalled(); expect(value).not.toHaveProperty('api_key'); w.unmount()
  })
  it('preserves saved credentials with an empty key and closes only after successful save', async () => {
    const { w, actions } = fixture(); await flushPromises()
    await button(w, '保存翻译配置').trigger('click'); await flushPromises()
    expect(actions.save).toHaveBeenCalledWith(expect.objectContaining({ max_attempts: 3, target_locales: ['en'] }), '')
    expect(w.emitted('saved')?.[0]?.[0]).toMatchObject({ space_revision: '8' })
    expect(w.emitted('update:modelValue')).toEqual([[false]]); w.unmount()
  })
  it('keeps the candidate for retry after failure, discards it on cancel/reopen', async () => {
    const { w, actions } = fixture(); await flushPromises()
    actions.save.mockRejectedValueOnce(new Error('failure'))
    await w.get('input[type="password"]').setValue('FAKE-RETRY')
    await button(w, '保存翻译配置').trigger('click'); await flushPromises()
    expect(w.emitted('saved')).toBeUndefined()
    expect((w.get('input[type="password"]').element as HTMLInputElement).value).toBe('FAKE-RETRY')
    await w.setProps({ modelValue: false }); await w.setProps({ modelValue: true }); await flushPromises()
    expect((w.get('input[type="password"]').element as HTMLInputElement).value).toBe(''); w.unmount()
  })
  it('disables writes for read-only settings', async () => {
    const { w, actions } = fixture({ can_edit: false }); await flushPromises()
    expect(w.get('input[type="password"]').attributes('disabled')).toBeDefined()
    await button(w, '保存翻译配置').trigger('click'); await button(w, '测试连接').trigger('click')
    expect(actions.save).not.toHaveBeenCalled(); expect(actions.testConnection).not.toHaveBeenCalled(); w.unmount()
  })
  it('ignores late loads after close and reopen', async () => {
    const { w, actions } = fixture(); await flushPromises()
    let resolve!: (s: TranslationSettings) => void
    actions.load.mockImplementationOnce(() => new Promise(r => { resolve = r }))
    await w.setProps({ modelValue: false }); await w.setProps({ modelValue: true })
    await w.setProps({ modelValue: false }); await w.setProps({ modelValue: true }); await flushPromises()
    resolve({ ...base(), api_key_mask: 'STALE' }); await flushPromises()
    expect(w.text()).not.toContain('STALE'); w.unmount()
  })
  it.each([['merchant', '当前主商户独立配置'], ['platform', '平台统一配置'], ['site', '当前内容空间共用']])('labels %s ownership', async (scope, label) => {
    const { w } = fixture({ configuration_scope: scope }); await flushPromises(); expect(w.text()).toContain(label); w.unmount()
  })
})
