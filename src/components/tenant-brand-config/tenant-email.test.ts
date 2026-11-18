import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import TenantEmailSettings from './TenantEmailSettings.vue'
import TenantBrandSettings from './TenantBrandSettings.vue'
import type { TenantEmailAdapter, TenantEmailConfig } from './model'

const fixture = (): TenantEmailConfig => ({ site_id: '10', version: '4', publication_version: '153', site_name: 'Mail Brand',
  logo_url: 'https://cdn.example/old.png', default_locale: 'zh-CN', source: 'rows', resource_hosts: ['cdn.example'], can_publish: true })
const button = (wrapper: ReturnType<typeof mount>, label: string) => wrapper.findAll('button').find(b => b.text().trim() === label)!

describe('email brand editor', () => {
  it('exposes only three fields and sends a Logo-only versioned patch, then rereads both versions', async () => {
    let current = fixture()
    const load = vi.fn(async () => ({ ...current }))
    const save = vi.fn<TenantEmailAdapter['save']>(async input => { current = { ...current, logo_url: input.logo_url ?? current.logo_url, version: '5', publication_version: '180' }; return { changed: true, detail: current } })
    const wrapper = mount(TenantEmailSettings, { props: { siteId: '10', adapter: { load, save } } })
    await flushPromises()
    expect(wrapper.findAll('input')).toHaveLength(3)
    expect(wrapper.text()).toContain('邮件版本：4')
    expect(wrapper.text()).toContain('站点发布版本：153')
    await wrapper.get('input[aria-label="邮件 Logo 地址"]').setValue('https://cdn.example/new.png')
    await button(wrapper, '保存并发布').trigger('click'); await flushPromises()
    expect(save).toHaveBeenCalledExactlyOnceWith({ site_id: '10', expected_version: '4', logo_url: 'https://cdn.example/new.png' })
    expect(load).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('邮件版本：5')
    expect(wrapper.text()).toContain('站点发布版本：180')
    expect(wrapper.text()).not.toContain('SMTP')
    wrapper.unmount()
  })
  it('sends an empty string to clear Logo, and never sends templates/policy/operator identity', async () => {
    const initial = fixture()
    const save = vi.fn<TenantEmailAdapter['save']>(async () => ({ changed: true, detail: { ...initial, logo_url: '', version: '5' } }))
    const wrapper = mount(TenantEmailSettings, { props: { siteId: '10', adapter: { load: async () => initial, save } } })
    await flushPromises(); await wrapper.get('input[aria-label="邮件 Logo 地址"]').setValue('')
    await button(wrapper, '保存并发布').trigger('click'); await flushPromises()
    expect(save.mock.calls[0][0]).toEqual({ site_id: '10', expected_version: '4', logo_url: '' })
    wrapper.unmount()
  })
  it('preserves draft and original expected version on conflict without automatic retry', async () => {
    const save = vi.fn<TenantEmailAdapter['save']>().mockRejectedValue(new Error('配置已被修改，请刷新后重试'))
    const wrapper = mount(TenantEmailSettings, { props: { siteId: '10', adapter: { load: async () => fixture(), save } } })
    await flushPromises(); await wrapper.get('input[aria-label="邮件品牌名称"]').setValue('Keep this draft')
    await button(wrapper, '保存并发布').trigger('click'); await flushPromises()
    expect(save).toHaveBeenCalledTimes(1)
    expect((wrapper.get('input[aria-label="邮件品牌名称"]').element as HTMLInputElement).value).toBe('Keep this draft')
    expect(wrapper.text()).toContain('配置已被修改')
    expect(wrapper.text()).toContain('邮件版本：4')
    wrapper.unmount()
  })
  it.each([false, true])('does not permit invalid hosts or unready publication (ready=%s)', async ready => {
    const save = vi.fn<TenantEmailAdapter['save']>()
    const wrapper = mount(TenantEmailSettings, { props: { siteId: '10', adapter: { load: async () => ({ ...fixture(), can_publish: ready }), save } } })
    await flushPromises(); await wrapper.get('input[aria-label="邮件 Logo 地址"]').setValue('https://evil.example/logo.png')
    expect(button(wrapper, '保存并发布').attributes('disabled')).toBeDefined()
    expect(save).not.toHaveBeenCalled()
    wrapper.unmount()
  })
  it('makes legacy initialization explicit without submitting empty template arrays', async () => {
    const save = vi.fn<TenantEmailAdapter['save']>(async () => ({ changed: true, detail: fixture() }))
    const wrapper = mount(TenantEmailSettings, { props: { siteId: '10', adapter: { load: async () => ({ ...fixture(), source: 'legacy' }), save } } })
    await flushPromises(); await button(wrapper, '保存并发布').trigger('click'); await flushPromises()
    expect(save).toHaveBeenCalledExactlyOnceWith({ site_id: '10', expected_version: '4' })
    wrapper.unmount()
  })
  it('integrates as an optional fourth tab and updates the next domain-save publication token', async () => {
    const save = vi.fn(async () => ({ changed: true }))
    const emailSave = vi.fn<TenantEmailAdapter['save']>(async () => ({ changed: true, detail: { ...fixture(), site_name: 'Updated', version: '5', publication_version: '180' } }))
    let reads = 0
    const wrapper = mount(TenantBrandSettings, { global: { stubs: { teleport: true } }, props: {
      load: async () => ({ tenant_id: '1', tenant_name: 'Alpha', sites: [{ site_id: '10', site_name: 'Site', domains: [{ domain: 'one.example', is_primary: true }], revision: 'a'.repeat(64), config_version: '153' }] }), save,
      email: { load: async () => ++reads > 1 ? { ...fixture(), site_name: 'Updated', version: '5', publication_version: '180' } : fixture(), save: emailSave }
    } })
    await flushPromises(); await button(wrapper, '邮件品牌').trigger('click'); await flushPromises()
    await wrapper.get('input[aria-label="邮件品牌名称"]').setValue('Updated')
    expect((wrapper.vm as unknown as { hasUnsavedChanges: boolean }).hasUnsavedChanges).toBe(true)
    await button(wrapper, '保存并发布').trigger('click'); await flushPromises()
    await wrapper.findAll('[role="tab"]')[0].trigger('click')
    await wrapper.get('input[aria-label="访问域名 1"]').setValue('updated.example')
    await button(wrapper, '保存配置').trigger('click'); await button(wrapper, '确认保存').trigger('click'); await flushPromises()
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ expected_config_version: '180' }))
    wrapper.unmount()
  })
})
