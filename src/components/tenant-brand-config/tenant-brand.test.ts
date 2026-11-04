import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { MmSelect } from '../select'
import TenantBrandSettings from './TenantBrandSettings.vue'
import { brandDomainError, brandDomainsEqual, normalizeBrandDomains, type TenantBrandDetail } from './model'

const fixture = (): TenantBrandDetail => ({ tenant_id: '101', tenant_name: 'Alpha', can_edit: true, sites: [
  { site_id: '10', site_name: 'Main', domains: [{ domain: 'one.example', is_primary: true }], revision: 'a'.repeat(64) },
  { site_id: '11', site_name: 'Other site', domains: [], revision: 'b'.repeat(64) },
] })
const button = (wrapper: ReturnType<typeof mount>, text: string) => wrapper.findAll('button').find(item => item.text().trim() === text)!
const options = { global: { stubs: { teleport: true } } }

describe('brand domain model', () => {
  it('normalizes canonical names and validates primary uniqueness, duplicate names and syntax', () => {
    expect(normalizeBrandDomains([{ domain: ' ONE.Example. ', is_primary: true }])).toEqual([{ domain: 'one.example', is_primary: true }])
    expect(brandDomainsEqual([{ domain: 'one.example', is_primary: true }], [{ domain: 'ONE.example.', is_primary: true }])).toBe(true)
    expect(brandDomainError([])).toBe('')
    expect(brandDomainError([{ domain: 'one.example', is_primary: false }])).toContain('主域名')
    expect(brandDomainError([{ domain: 'one.example', is_primary: true }, { domain: 'ONE.example', is_primary: false }])).toContain('重复')
    for (const name of ['http://a.test', '*.test', 'a.test:443', 'a.test/path', '127.0.0.1', 'localhost', 'a..test']) {
      expect(brandDomainError([{ domain: name, is_primary: true }])).not.toBe('')
    }
  })
})

describe('shared tenant brand settings', () => {
  it('loads, adds a domain and requires confirmation before saving the site-scoped revision', async () => {
    const save = vi.fn(async () => ({ changed: true, revision: 'c'.repeat(64), snapshot_version: '9' }))
    const wrapper = mount(TenantBrandSettings, { ...options, props: { load: async () => fixture(), save } })
    await flushPromises()
    expect(button(wrapper, '添加域名').get('.mm-button__icon .mm-icon').attributes('stroke')).toBe('currentColor')
    expect(wrapper.get('input[aria-label="访问域名 1"]').attributes('readonly')).toBeUndefined()
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
    await button(wrapper, '添加域名').trigger('click')
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
    await wrapper.get('input[aria-label="访问域名 2"]').setValue(' BACKUP.Example. ')
    await button(wrapper, '保存配置').trigger('click')
    expect(save).not.toHaveBeenCalled()
    await button(wrapper, '确认保存').trigger('click'); await flushPromises()
    expect(save).toHaveBeenCalledExactlyOnceWith({ site_id: '10', expected_revision: 'a'.repeat(64), domains: [
      { domain: 'one.example', is_primary: true }, { domain: 'backup.example', is_primary: false },
    ] })
    expect(wrapper.emitted('saved')).toHaveLength(1)
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('edits an existing domain, supports discard, and confirms replacement before saving', async () => {
    const save = vi.fn(async () => ({ changed: true, revision: 'c'.repeat(64) }))
    const wrapper = mount(TenantBrandSettings, { ...options, props: { load: async () => fixture(), save } })
    await flushPromises()
    const input = wrapper.get('input[aria-label="访问域名 1"]')
    await input.setValue('renamed.example')
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeUndefined()
    await button(wrapper, '放弃修改').trigger('click')
    expect((wrapper.get('input[aria-label="访问域名 1"]').element as HTMLInputElement).value).toBe('one.example')
    await wrapper.get('input[aria-label="访问域名 1"]').setValue('renamed.example')
    await button(wrapper, '保存配置').trigger('click')
    expect(save).not.toHaveBeenCalled()
    expect(wrapper.get('.mm-tenant-brand-settings__removed').text()).toContain('one.example')
    await button(wrapper, '确认保存').trigger('click'); await flushPromises()
    expect(save).toHaveBeenCalledExactlyOnceWith({ site_id: '10', expected_revision: 'a'.repeat(64), domains: [{ domain: 'renamed.example', is_primary: true }] })
    expect((wrapper.get('input[aria-label="访问域名 1"]').element as HTMLInputElement).value).toBe('renamed.example')
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('requires a new primary when removing the old one, and supports discarding changes', async () => {
    const wrapper = mount(TenantBrandSettings, { ...options, props: { load: async () => fixture(), save: vi.fn() } })
    await flushPromises()
    await button(wrapper, '添加域名').trigger('click')
    await wrapper.get('input[aria-label="访问域名 2"]').setValue('two.example')
    await wrapper.get('button[aria-label="删除域名 one.example"]').trigger('click')
    expect(wrapper.text()).toContain('请指定一个主域名')
    await wrapper.get('[aria-label="设为主域名 two.example"] input').setValue(true)
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeUndefined()
    await button(wrapper, '放弃修改').trigger('click')
    expect((wrapper.get('input[aria-label="访问域名 1"]').element as HTMLInputElement).value).toBe('one.example')
    wrapper.unmount()
  })

  it('protects unsaved changes when switching sites', async () => {
    const wrapper = mount(TenantBrandSettings, { ...options, props: { load: async () => fixture(), save: vi.fn() } })
    await flushPromises(); await button(wrapper, '添加域名').trigger('click')
    wrapper.findComponent(MmSelect).vm.$emit('update:modelValue', '11'); await nextTick()
    expect(wrapper.text()).toContain('放弃未保存的域名修改？')
    expect(wrapper.findAll('input[aria-label^="访问域名 "]')).toHaveLength(2)
    await button(wrapper, '切换站点').trigger('click')
    expect(wrapper.text()).toContain('暂无访问域名')
    wrapper.unmount()
  })

  it('enforces host and server read-only flags', async () => {
    for (const props of [{ canEdit: false, load: async () => fixture() }, { canEdit: true, load: async () => ({ ...fixture(), can_edit: false }) }]) {
      const save = vi.fn()
      const wrapper = mount(TenantBrandSettings, { ...options, props: { ...props, save } })
      await flushPromises()
      expect(wrapper.get('input[aria-label="访问域名 1"]').attributes('disabled')).toBeDefined()
      expect(button(wrapper, '添加域名')).toBeUndefined()
      expect(button(wrapper, '保存配置')).toBeUndefined()
      expect(save).not.toHaveBeenCalled(); wrapper.unmount()
    }
  })

  it('retries failed loads and preserves drafts after save failure', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error()).mockImplementation(async () => fixture())
    const save = vi.fn().mockRejectedValue(new Error('conflict'))
    const wrapper = mount(TenantBrandSettings, { ...options, props: { load, save } })
    await flushPromises(); expect(wrapper.text()).toContain('域名配置读取失败')
    await button(wrapper, '重新加载').trigger('click'); await flushPromises()
    await button(wrapper, '添加域名').trigger('click'); await wrapper.get('input[aria-label="访问域名 2"]').setValue('draft.example')
    await button(wrapper, '保存配置').trigger('click'); await button(wrapper, '确认保存').trigger('click'); await flushPromises()
    expect(wrapper.text()).toContain('保存失败')
    expect((wrapper.get('input[aria-label="访问域名 2"]').element as HTMLInputElement).value).toBe('draft.example')
    await button(wrapper, '放弃并重新加载').trigger('click'); await flushPromises()
    expect(wrapper.findAll('input[aria-label^="访问域名 "]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('aborts pending reads on unmount', async () => {
    let signal: AbortSignal | undefined
    const wrapper = mount(TenantBrandSettings, { ...options, props: { load: async value => { signal = value; return new Promise(() => {}) }, save: vi.fn() } })
    await nextTick(); expect(wrapper.find('[data-mm-component="loading"]').exists()).toBe(true)
    wrapper.unmount(); expect(signal?.aborted).toBe(true)
  })
})
