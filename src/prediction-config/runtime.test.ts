import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MmPredictionGameConfig from './MmPredictionGameConfig.vue'
import type { AgentConfigAdapter, PlatformConfigAdapter, PredictionConfigContext } from './runtime'
import type { OwnerConfig } from './agent/api/prediction/owner-types'

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
function ownerInputConfig(game: 'UP_DOWN' | 'HIGH_LOW'): OwnerConfig {
  const up = game === 'UP_DOWN'
  const gameType = up ? 'GAME_TYPE_UP_DOWN' : 'GAME_TYPE_HIGH_LOW'
  return {
    enabled: true, platform_enabled: true, owner_agent_id: '100', game_type: gameType,
    symbol: 'BTCUSDT', public_version: '8', owner_revision: '0',
    rules: (up ? ['35', '40', '45', '60', '90'] : ['5', '10', '15', '30', '60']).map(duration => ({
      platform_enabled: true, owner_enabled: true, rule_epoch: '2', custom: false,
      platform_minimum_stake: '1', platform_maximum_stake: '3000',
      platform_target_payout_rate: up ? '0.9' : '', platform_maximum_odds: up ? '5' : '',
      platform_fixed_odds: up ? '' : '1.8',
      rule: {
        game_type: gameType, symbol: 'BTCUSDT', duration_seconds: duration,
        market_id: 'BTC-' + duration, enabled: true, bet_open_seconds: up ? '30' : '0',
        target_payout_rate: up ? '0.9' : '', minimum_odds: '1', maximum_odds: up ? '5' : '',
        fixed_odds: up ? '' : '1.8', minimum_stake: '1', maximum_stake: '3000',
        stake_tiers: up ? [{ stake_tier_id: 'tier-' + duration, enabled: true, retired: false,
          display_order: 0, minimum_stake: '1', maximum_stake: '3000' }] : [],
      },
    })),
  }
}
describe('shared game configuration host boundary', () => {
  beforeEach(() => {
    const values = new Map<string, string>()
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key), clear: () => values.clear() }
    vi.stubGlobal('localStorage', storage)
    vi.stubGlobal('sessionStorage', storage)
  })
  afterEach(() => vi.unstubAllGlobals())
  it.each(['UP_DOWN', 'HIGH_LOW', 'GRID'] as const)('uses real MmInput controls for %s without submitting while typing', async mode => {
    const adapter = agent()
    vi.mocked(adapter.api.ownerConfigurations).mockImplementation(async game => ({ items: [ownerInputConfig(game)] }))
    vi.mocked(adapter.api.siteDirectorySymbols).mockResolvedValue(['BTCUSDT'])
    vi.mocked(adapter.grid.initializeGridMerchant).mockResolvedValue({ created: 0 })
    vi.mocked(adapter.grid.gridConfigSymbols).mockResolvedValue(['BTCUSDT'])
    vi.mocked(adapter.grid.gridConfigCatalog).mockResolvedValue({ sites: [{
      site_id: 'site-a', can_edit: true, can_edit_limits: false,
      products: [{ symbol: 'BTCUSDT', enabled: true, default_enabled: true }],
    }] })
    vi.mocked(adapter.grid.gridConfigSite).mockResolvedValue({
      site_id: 'site-a', symbol: 'BTCUSDT', layout_version: '1', site_version: '1',
      effective_from_ms: '0', enabled: true, target_rtp: '0.6',
      min_multiplier: '1.01', max_multiplier: '20', min_order_amount: '1', max_order_amount: '10000',
    })
    const wrapper = mount(MmPredictionGameConfig, { props: { adapter, context: context({ permissions: ['prediction_config:lists'] }), symbolComponent } })
    try {
      await flushPromises()
      if (mode !== 'UP_DOWN') {
        await wrapper.findAll('.game-tabs button')[mode === 'HIGH_LOW' ? 1 : 2]!.trigger('click')
        await flushPromises()
      }
      expect(wrapper.findAll('.el-input')).toHaveLength(0)
      const controls = wrapper.findAll('[data-mm-component="input"]')
      expect(controls).toHaveLength(4)
      const search = controls[0]!.find('input')
      await search.setValue('BTC')
      expect(wrapper.findAll('.symbol-option,.symbol-button')).toHaveLength(1)
      await controls[0]!.find('.mm-input__clear').trigger('click')
      expect((search.element as HTMLInputElement).value).toBe('')
      const odds = controls[1]!.find('input')
      expect(odds.attributes('disabled')).toBeUndefined()
      const precise = mode === 'HIGH_LOW' ? '1.7500000000000001' : '59.1234567891234567'
      await odds.setValue(precise)
      expect((odds.element as HTMLInputElement).value).toBe(precise)
      await odds.trigger('keydown', { key: 'ArrowUp' })
      expect((odds.element as HTMLInputElement).value).toBe(mode === 'HIGH_LOW' ? '1.7600000000000001' : '60.1234567891234567')
      await controls[1]!.find('button[aria-label="减少数值"]').trigger('click')
      expect((odds.element as HTMLInputElement).value).toBe(precise)
      for (const control of controls.slice(2)) {
        await control.find('input').setValue('2.123456789123456789')
        expect((control.find('input').element as HTMLInputElement).value).toBe('2.123456789123456789')
        expect(control.find('.mm-input__append').text()).toBe('USDT')
      }
      expect(controls[1]!.find('.mm-input__append').text()).toBe(mode === 'HIGH_LOW' ? 'x' : '%')
      expect(adapter.api.saveOwnerConfiguration).not.toHaveBeenCalled()
      expect(adapter.grid.saveGridConfig).not.toHaveBeenCalled()
      expect(localStorage.getItem('prediction.owner.pending.v1')).toBeNull()
      expect(sessionStorage.getItem('grid.config.pending.v1')).toBeNull()
    } finally {
      wrapper.unmount()
    }
  })
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
