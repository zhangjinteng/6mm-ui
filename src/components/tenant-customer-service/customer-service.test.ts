import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Card from './TenantCustomerServiceCard.vue'
import Features from '../tenant-feature-settings/TenantFeatureSettings.vue'
import type { TenantCustomerServiceDetail, TenantCustomerServiceToggleInput } from './model'

const state = (extra: Partial<TenantCustomerServiceDetail> = {}): TenantCustomerServiceDetail => ({
  site_id: '10', entitlement_version: '3', enabled: false, binding_status: 'unconfigured', operation: null,
  service_ready: true, updated_at: null, can_edit: true, ...extra,
})
const pending = (extra = {}) => state({ operation: { status: 'pending', enabled: true, message: '结果待核验',
  attempts: 1, retry_after: 0, can_retry: true, ...extra } })
const options = { global: { stubs: { teleport: true } } }
const button = (wrapper: ReturnType<typeof mount>, text: string) => wrapper.findAll('button').find(item => item.text().trim() === text)!

describe('shared 6MM customer service', () => {
  it('loads without writes and immediately toggles using only server scope/version', async () => {
    const toggle = vi.fn(async (_input: TenantCustomerServiceToggleInput) => ({ changed: true, detail: state({ enabled: true, entitlement_version: '4' }) }))
    const wrapper = mount(Card, { props: { transport: { load: async () => state(), toggle } } })
    await flushPromises()
    expect(wrapper.text()).toContain('影响当前白标所有站点')
    expect(wrapper.find('p.mm-tenant-customer__hint').exists()).toBe(false)
    expect(toggle).not.toHaveBeenCalled()
    await wrapper.get('[role="switch"]').trigger('click'); await flushPromises()
    expect(toggle).toHaveBeenCalledOnce()
    expect(toggle.mock.calls[0]![0]).toEqual({ site_id: '10', expected_entitlement_version: '3', enabled: true,
      client_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' })
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('true')
    expect(wrapper.text()).not.toContain('保存配置'); wrapper.unmount()
  })

  it('blocks duplicate writes and does not optimistically enable before confirmation', async () => {
    let finish!: (value: { changed: boolean; detail: TenantCustomerServiceDetail }) => void
    const toggle = vi.fn(() => new Promise<{ changed: boolean; detail: TenantCustomerServiceDetail }>(resolve => { finish = resolve }))
    const wrapper = mount(Card, { props: { transport: { load: async () => state(), toggle } } })
    await flushPromises(); await wrapper.get('[role="switch"]').trigger('click'); await wrapper.get('[role="switch"]').trigger('click')
    expect(toggle).toHaveBeenCalledOnce()
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('false')
    expect(wrapper.text()).toContain('处理中')
    finish({ changed: true, detail: state({ enabled: true }) }); await flushPromises(); wrapper.unmount()
  })

  it('enforces host/server permission, setup and provider restrictions', async () => {
    for (const [extra, canEdit] of [[{}, false], [{ can_edit: false }, true], [{ service_ready: false }, true], [{ binding_status: 'unsupported' }, true]] as const) {
      const toggle = vi.fn()
      const wrapper = mount(Card, { props: { transport: { load: async () => state(extra), toggle }, canEdit } })
      await flushPromises(); expect(wrapper.get('[role="switch"]').attributes('disabled')).toBeDefined()
      expect(toggle).not.toHaveBeenCalled(); wrapper.unmount()
    }
  })

  it('locks reversal and only retries the original operation after an explicit verification', async () => {
    const toggle = vi.fn(async (_input: TenantCustomerServiceToggleInput) => ({ changed: true, detail: state({ enabled: true }) }))
    const wrapper = mount(Card, { props: { transport: { load: async () => pending(), toggle } } })
    await flushPromises()
    expect(wrapper.get('[role="switch"]').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('待核验')
    expect(toggle).not.toHaveBeenCalled()
    await button(wrapper, '核验').trigger('click'); await flushPromises()
    expect(toggle.mock.calls[0]![0].enabled).toBe(true); wrapper.unmount()
  })

  it('never automatically repeats a failed write and refreshes authoritative state without marking success', async () => {
    const load = vi.fn().mockResolvedValueOnce(state()).mockResolvedValue(pending({ retry_after: Date.now() / 1000 + 60 }))
    const toggle = vi.fn().mockRejectedValue(new Error('timeout'))
    const wrapper = mount(Card, { props: { transport: { load, toggle } } })
    await flushPromises(); await wrapper.get('[role="switch"]').trigger('click'); await flushPromises()
    expect(toggle).toHaveBeenCalledOnce(); expect(load).toHaveBeenCalledTimes(2)
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('false')
    expect(wrapper.get('[role="switch"]').attributes('disabled')).toBeDefined()
    expect(button(wrapper, '核验').attributes('disabled')).toBeDefined(); wrapper.unmount()
  })

  it('keeps an uncertain state locked if both the write and refresh fail, and supports explicit reload', async () => {
    const load = vi.fn().mockResolvedValueOnce(state()).mockRejectedValueOnce(new Error()).mockResolvedValue(state({ enabled: true }))
    const wrapper = mount(Card, { props: { transport: { load, toggle: vi.fn().mockRejectedValue(new Error()) } } })
    await flushPromises(); await wrapper.get('[role="switch"]').trigger('click'); await flushPromises()
    expect(wrapper.get('[role="switch"]').attributes('disabled')).toBeDefined()
    await button(wrapper, '重新加载状态').trigger('click'); await flushPromises()
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('true'); wrapper.unmount()
  })

  it('retries failed reads and aborts in-flight reads when unmounted', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValue(state())
    const wrapper = mount(Card, { props: { transport: { load, toggle: vi.fn() } } })
    await flushPromises(); expect(wrapper.text()).toContain('客服状态读取失败')
    await button(wrapper, '重新加载状态').trigger('click'); await flushPromises(); wrapper.unmount()
    let signal!: AbortSignal
    const unfinished = mount(Card, { props: { transport: { load: async value => { signal = value; return new Promise(() => {}) }, toggle: vi.fn() } } })
    await nextTick(); unfinished.unmount(); expect(signal.aborted).toBe(true)
  })

  it('renders the new group below growth and preserves the independent ranking draft after a service write', async () => {
    const rankingSave = vi.fn()
    const toggle = vi.fn(async () => ({ changed: true, detail: state({ enabled: true }) }))
    const wrapper = mount(Features, { ...options, props: {
      load: async () => ({ tenant_id: '101', tenant_name: 'Alpha', site_id: '10', site_name: 'Main',
        features: { trade_ranking: true }, expected_updated_at: null }), save: rankingSave,
      customerService: { load: async () => state(), toggle },
    } })
    await flushPromises()
    expect(wrapper.findAll('.mm-tenant-feature-settings__group').map(group => group.attributes('aria-label'))).toEqual(['运营增长', '服务与内容'])
    expect(wrapper.findAll('[role="switch"]')).toHaveLength(2)
    await wrapper.get('[aria-label="交易排行"]').trigger('click')
    await wrapper.get('[aria-label="6MM客服"]').trigger('click'); await flushPromises()
    expect(toggle).toHaveBeenCalledOnce(); expect(rankingSave).not.toHaveBeenCalled()
    expect(wrapper.get('[aria-label="交易排行"]').attributes('aria-checked')).toBe('false')
    expect(wrapper.text()).toContain('已修改 1 项配置，待保存'); wrapper.unmount()
  })
})
