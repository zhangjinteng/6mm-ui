import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MmPredictionGameConfig from './MmPredictionGameConfig.vue'
import type { AgentConfigAdapter, PlatformConfigAdapter, PredictionConfigContext } from './runtime'

const symbolComponent = defineComponent({ props: ['symbol'], setup: props => () => h('span', String(props.symbol)) })
const context = (extra: Partial<PredictionConfigContext> = {}): PredictionConfigContext => ({ operatorId: '100', identityKey: 'session-1', permissions: ['*'], canManagePredictionConfig: true, ...extra })
const grid = () => ({ gridConfigSymbols: vi.fn(), gridConfigCatalog: vi.fn(), gridConfigSite: vi.fn(), saveGridConfig: vi.fn(), gridConfigReceipt: vi.fn() })
function platform(): PlatformConfigAdapter {
  return { role: 'platform', api: { symbols: vi.fn(async () => []), predictionConfigurationList: vi.fn(async () => ({ configurations: [] })), predictionConfigurationDetail: vi.fn(), predictionConfigurationSave: vi.fn() }, grid: { ...grid(), gridConfigCreation: vi.fn() } }
}
function agent(): AgentConfigAdapter {
  return { role: 'agent', api: {
    ownerConfigurationModel: vi.fn(async () => ({ config_model: 'OWNER_V1' as const, actor: { operator_id: '100', agent_id: '100' } })),
    ownerConfigurations: vi.fn(async () => ({ items: [] })), siteDirectorySymbols: vi.fn(async () => []),
    ownerConfiguration: vi.fn(), saveOwnerConfiguration: vi.fn(), configurations: vi.fn(), siteConfigurationTargets: vi.fn(),
    siteConfiguration: vi.fn(), saveSiteConfiguration: vi.fn(), configuration: vi.fn(), saveConfiguration: vi.fn(),
  }, grid: { ...grid(), initializeGridMerchant: vi.fn() } }
}
describe('shared game configuration host boundary', () => {
  beforeEach(() => {
    const values = new Map<string, string>()
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key), clear: () => values.clear() }
    vi.stubGlobal('localStorage', storage)
    vi.stubGlobal('sessionStorage', storage)
  })
  afterEach(() => vi.unstubAllGlobals())
  it('uses only the selected host adapter and never writes on initial render', async () => {
    const adapter = platform()
    const wrapper = mount(MmPredictionGameConfig, { props: { adapter, context: context(), symbolComponent } })
    await flushPromises()
    expect(adapter.api.predictionConfigurationList).toHaveBeenCalledOnce()
    expect(adapter.api.symbols).toHaveBeenCalledOnce()
    expect(adapter.api.predictionConfigurationSave).not.toHaveBeenCalled()
    expect(adapter.grid.saveGridConfig).not.toHaveBeenCalled()
    wrapper.unmount()
  })
  it('rejects invalid identity and refuses agent child-account configuration requests', async () => {
    for (const actor of [context({ operatorId: '' }), context({ canManagePredictionConfig: false })]) {
      const adapter = agent()
      const wrapper = mount(MmPredictionGameConfig, { props: { adapter, context: actor, symbolComponent } })
      await flushPromises()
      expect(adapter.api.ownerConfigurationModel).not.toHaveBeenCalled()
      expect(adapter.api.ownerConfigurations).not.toHaveBeenCalled()
      wrapper.unmount()
    }
  })
  it('preserves backend-selected site mode and does not turn it into owner authority', async () => {
    const adapter = agent()
    vi.mocked(adapter.api.ownerConfigurationModel).mockResolvedValue({ config_model: 'SITE_V1', actor: { operator_id: '100', agent_id: '100' } })
    vi.mocked(adapter.api.siteConfigurationTargets).mockResolvedValue({ actor: { operator_id: '100', agent_id: '100' }, sites: [] })
    const wrapper = mount(MmPredictionGameConfig, { props: { adapter, context: context(), symbolComponent } })
    await flushPromises()
    expect(adapter.api.siteConfigurationTargets).toHaveBeenCalled()
    expect(adapter.api.ownerConfigurations).not.toHaveBeenCalled()
    expect(adapter.api.saveSiteConfiguration).not.toHaveBeenCalled()
    wrapper.unmount()
  })
  it('invalidates old session responses without deleting pending original requests', async () => {
    const adapter = agent()
    let resolve!: (value: Awaited<ReturnType<AgentConfigAdapter['api']['ownerConfigurationModel']>>) => void
    vi.mocked(adapter.api.ownerConfigurationModel).mockReturnValue(new Promise(done => { resolve = done }))
    localStorage.setItem('prediction.owner.pending.v1', 'original request')
    const wrapper = mount(MmPredictionGameConfig, { props: { adapter, context: context(), symbolComponent } })
    await wrapper.setProps({ context: context({ identityKey: 'session-2', operatorId: '101', canManagePredictionConfig: false }) })
    resolve({ config_model: 'OWNER_V1', actor: { operator_id: '100', agent_id: '100' } })
    await flushPromises()
    expect(adapter.api.ownerConfigurations).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('仅代理商主账号')
    expect(localStorage.getItem('prediction.owner.pending.v1')).toBe('original request')
    wrapper.unmount()
    localStorage.removeItem('prediction.owner.pending.v1')
  })
})
