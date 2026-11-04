import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { MmSelect } from '../select'
import TenantFeatureSettings from './TenantFeatureSettings.vue'
import { tenantFeatureCatalogue, type TenantFeatureSettingsDetail, type TenantFeatureSaveInput } from './model'

const fixture = (site_id = '10'): TenantFeatureSettingsDetail => ({ tenant_id: '101', tenant_name: 'Alpha', site_id, site_name: 'Main',
  features: { trade_ranking: true }, expected_updated_at: null, can_edit: true,
  sites: [{ site_id: '10', site_name: 'Main' }, { site_id: '11', site_name: 'Second' }],
})
const options = { global: { stubs: { teleport: true } } }
const button = (wrapper: ReturnType<typeof mount>, text: string) => wrapper.findAll('button').find(item => item.text().trim() === text)!

describe('tenant frontend-entry switches', () => {
  it('exposes only the existing ranking switch and loads without autosaving', async () => {
    expect(tenantFeatureCatalogue.map(row => row.code)).toEqual(['trade_ranking'])
    const save = vi.fn()
    const wrapper = mount(TenantFeatureSettings, { ...options, props: { load: async () => fixture(), save } })
    await flushPromises()
    expect(wrapper.findAll('[role="switch"]')).toHaveLength(1)
    expect(wrapper.get('[role="switch"]').attributes('aria-label')).toBe('交易排行')
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('true')
    expect(wrapper.text()).toContain('1 / 1 已启用')
    expect(button(wrapper, '保存配置').get('.mm-button__icon .mm-icon').attributes('stroke')).toBe('currentColor')
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
    expect(save).not.toHaveBeenCalled(); wrapper.unmount()
  })

  it('keeps toggles as draft until save and passes only the server site/version and one boolean', async () => {
    const save = vi.fn(async (input: TenantFeatureSaveInput) => ({ changed: true, detail: { ...fixture(), ...input, expected_updated_at: '2026-11-03T10:00:00Z' } }))
    const wrapper = mount(TenantFeatureSettings, { ...options, props: { load: async () => fixture(), save } })
    await flushPromises(); await wrapper.get('[role="switch"]').trigger('click')
    expect(save).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('0 / 1 已启用')
    expect(wrapper.text()).toContain('已修改 1 项配置，待保存')
    await button(wrapper, '保存配置').trigger('click'); await flushPromises()
    expect(save).toHaveBeenCalledExactlyOnceWith({ site_id: '10', expected_updated_at: null, features: { trade_ranking: false } })
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
    await wrapper.get('[role="switch"]').trigger('click'); await button(wrapper, '保存配置').trigger('click'); await flushPromises()
    expect(save.mock.calls[1][0].expected_updated_at).toBe('2026-11-03T10:00:00Z')
    wrapper.unmount()
  })

  it('discards pending toggles without requests', async () => {
    const save = vi.fn()
    const wrapper = mount(TenantFeatureSettings, { ...options, props: { load: async () => fixture(), save } })
    await flushPromises(); await wrapper.get('[role="switch"]').trigger('click'); await button(wrapper, '放弃修改').trigger('click')
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('true')
    expect(save).not.toHaveBeenCalled(); wrapper.unmount()
  })

  it('enforces host and server read-only flags', async () => {
    for (const props of [{ canEdit: false, load: async () => fixture() }, { canEdit: true, load: async () => ({ ...fixture(), can_edit: false }) }]) {
      const wrapper = mount(TenantFeatureSettings, { ...options, props: { ...props, save: vi.fn() } })
      await flushPromises()
      expect(wrapper.get('[role="switch"]').attributes('disabled')).toBeDefined()
      expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
      wrapper.unmount()
    }
  })

  it('preserves drafts after save failure and supports explicit reload', async () => {
    const wrapper = mount(TenantFeatureSettings, { ...options, props: { load: async () => fixture(), save: vi.fn().mockRejectedValue(new Error('conflict')) } })
    await flushPromises(); await wrapper.get('[role="switch"]').trigger('click'); await button(wrapper, '保存配置').trigger('click'); await flushPromises()
    expect(wrapper.text()).toContain('保存失败')
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('false')
    await button(wrapper, '放弃并重新加载').trigger('click'); await flushPromises()
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('true'); wrapper.unmount()
  })

  it('retries failed reads and aborts unfinished reads on unmount', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValue(fixture())
    const wrapper = mount(TenantFeatureSettings, { ...options, props: { load, save: vi.fn() } })
    await flushPromises(); expect(wrapper.text()).toContain('功能开关读取失败')
    await button(wrapper, '重新加载').trigger('click'); await flushPromises()
    expect(wrapper.find('[role="switch"]').exists()).toBe(true); wrapper.unmount()
    let signal: AbortSignal | undefined
    const pending = mount(TenantFeatureSettings, { ...options, props: { load: async next => { signal = next; return new Promise(() => {}) }, save: vi.fn() } })
    await nextTick(); expect(pending.find('[data-mm-component="loading"]').exists()).toBe(true)
    pending.unmount(); expect(signal?.aborted).toBe(true)
  })

  it('confirms site switching when a draft is dirty and never sends a foreign site', async () => {
    const load = vi.fn(async (_signal: AbortSignal, siteId?: string) => fixture(siteId))
    const wrapper = mount(TenantFeatureSettings, { ...options, props: { load, save: vi.fn() } })
    await flushPromises(); await wrapper.get('[role="switch"]').trigger('click')
    wrapper.findComponent(MmSelect).vm.$emit('update:modelValue', '99'); await nextTick()
    expect(load).toHaveBeenCalledTimes(1)
    wrapper.findComponent(MmSelect).vm.$emit('update:modelValue', '11'); await nextTick()
    expect(wrapper.text()).toContain('放弃未保存的开关修改？')
    expect(load).toHaveBeenCalledTimes(1)
    await button(wrapper, '切换站点').trigger('click'); await flushPromises()
    expect(load.mock.calls[1][1]).toBe('11')
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('true'); wrapper.unmount()
  })

  it('suppresses duplicate saves and locks the toggle while saving', async () => {
    let resolve!: (value: { changed: boolean; detail: TenantFeatureSettingsDetail }) => void
    const save = vi.fn(() => new Promise<{ changed: boolean; detail: TenantFeatureSettingsDetail }>(done => { resolve = done }))
    const wrapper = mount(TenantFeatureSettings, { ...options, props: { load: async () => fixture(), save } })
    await flushPromises(); await wrapper.get('[role="switch"]').trigger('click')
    await button(wrapper, '保存配置').trigger('click'); await button(wrapper, '保存配置').trigger('click')
    expect(save).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[role="switch"]').attributes('disabled')).toBeDefined()
    resolve({ changed: true, detail: { ...fixture(), features: { trade_ranking: false } } }); await flushPromises(); wrapper.unmount()
  })
})
