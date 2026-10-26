import { computed, inject, type Component, type InjectionKey, type Ref } from 'vue'
import type { PredictionConfiguration, PredictionGameType, SavePredictionConfigurationPayload } from './platform/views/config/prediction/types'
import type { Receipt } from './platform/views/prediction/submission'
import type * as PlatformGrid from './platform/views/grid/config/model'
import type * as AgentGrid from './agent/views/grid/config/model'
import type { GameplayConfig, SaveBody, SaveResult } from './agent/api/prediction/types'
import type { OwnerModel, OwnerConfig, OwnerSaveBody, OwnerSaveResult } from './agent/api/prediction/owner-types'
import type { SiteTargets, SiteTarget, SiteConfigRead, SiteSaveBody, SiteSaveResult } from './agent/api/prediction/site-types'

export interface PredictionConfigContext {
  operatorId: string
  /** Opaque session generation, never an access token. Changes invalidate all in-flight work. */
  identityKey: string
  permissions: string[]
  canManagePredictionConfig?: boolean
}
export interface PlatformGridCatalog {
  sites: Array<{ site_id: string; can_edit: boolean; can_edit_limits: boolean; products: Array<{ row_count?: string; column_count?: string; symbol: string; enabled: boolean }> }>
}
export interface AgentGridCatalog {
  sites: Array<{ site_id: string; can_edit: boolean; can_edit_limits: boolean; products: Array<{ row_count?: string; column_count?: string; symbol: string; enabled: boolean; default_enabled: boolean }> }>
}
export interface PlatformConfigAdapter {
  role: 'platform'
  api: {
    predictionConfigurationList(params: { game_type?: PredictionGameType }, signal?: AbortSignal): Promise<{ configurations: PredictionConfiguration[] }>
    predictionConfigurationDetail(params: { game_type: PredictionGameType; symbol: string }, signal?: AbortSignal): Promise<{ configuration: PredictionConfiguration }>
    predictionConfigurationSave(body: SavePredictionConfigurationPayload): Promise<{ configuration: PredictionConfiguration; receipt: Receipt }>
    symbols(signal?: AbortSignal): Promise<string[]>
  }
  grid: {
    gridConfigSymbols(signal?: AbortSignal): Promise<string[]>
    gridConfigCatalog(signal?: AbortSignal): Promise<PlatformGridCatalog>
    gridConfigCreation(symbol: string, signal?: AbortSignal): Promise<unknown>
    gridConfigSite(siteId: string, symbol: string, signal?: AbortSignal): Promise<PlatformGrid.GridSnapshot>
    saveGridConfig(body: PlatformGrid.GridCommand): Promise<PlatformGrid.GridOperationResult>
    gridConfigReceipt(body: PlatformGrid.GridCommand): Promise<PlatformGrid.GridOperationResult>
  }
}
export interface AgentConfigAdapter {
  role: 'agent'
  api: {
    ownerConfigurationModel(signal?: AbortSignal): Promise<OwnerModel>
    ownerConfigurations(game: PredictionGameType, signal?: AbortSignal): Promise<{ items: OwnerConfig[] }>
    ownerConfiguration(game: PredictionGameType, symbol: string, signal?: AbortSignal): Promise<{ configuration: OwnerConfig }>
    saveOwnerConfiguration(body: OwnerSaveBody, signal?: AbortSignal): Promise<OwnerSaveResult>
    siteDirectorySymbols(signal?: AbortSignal): Promise<string[]>
    configurations(signal?: AbortSignal, game?: PredictionGameType): Promise<{ configurations: GameplayConfig[] }>
    siteConfigurationTargets(signal?: AbortSignal): Promise<SiteTargets>
    siteConfiguration(target: SiteTarget, signal?: AbortSignal): Promise<SiteConfigRead>
    saveSiteConfiguration(body: SiteSaveBody, signal?: AbortSignal): Promise<SiteSaveResult>
    configuration(symbol: string, signal?: AbortSignal): Promise<{ configuration: GameplayConfig }>
    saveConfiguration(body: SaveBody, signal?: AbortSignal): Promise<SaveResult>
  }
  grid: {
    initializeGridMerchant(signal?: AbortSignal): Promise<{ created: number }>
    gridConfigSymbols(signal?: AbortSignal): Promise<string[]>
    gridConfigCatalog(signal?: AbortSignal): Promise<AgentGridCatalog>
    gridConfigSite(siteId: string, symbol: string, signal?: AbortSignal): Promise<AgentGrid.GridSnapshot>
    saveGridConfig(body: AgentGrid.GridCommand): Promise<AgentGrid.GridOperationResult>
    gridConfigReceipt(body: AgentGrid.GridCommand): Promise<AgentGrid.GridOperationResult>
  }
}
export type PredictionConfigAdapter = PlatformConfigAdapter | AgentConfigAdapter
export interface PredictionConfigRuntime {
  readonly context: PredictionConfigContext
  readonly adapter: PredictionConfigAdapter
  readonly symbolComponent: Component
  readonly locale: string
  translate?: (key: string) => string
  hasTranslation?: (key: string) => boolean
  registerBeforeLeave?: (guard: () => boolean | Promise<boolean>) => void
}
export const predictionConfigRuntimeKey: InjectionKey<PredictionConfigRuntime> = Symbol('MmPredictionGameConfig')
export function useConfigRuntime(): PredictionConfigRuntime {
  const runtime = inject(predictionConfigRuntimeKey)
  if (!runtime) throw new Error('Prediction configuration runtime is missing')
  return runtime
}
export function usePlatformConfigRuntime(): PlatformConfigAdapter {
  const { adapter } = useConfigRuntime()
  if (adapter.role !== 'platform') throw new Error('Platform configuration adapter required')
  return adapter
}
export function useAgentConfigRuntime(): AgentConfigAdapter {
  const { adapter } = useConfigRuntime()
  if (adapter.role !== 'agent') throw new Error('Agent configuration adapter required')
  return adapter
}
export function useConfigUser() {
  const runtime = useConfigRuntime()
  return {
    get userInfo() { return { id: runtime.context.operatorId, can_manage_prediction_config: runtime.context.canManagePredictionConfig === true } },
    get perms() { return runtime.context.permissions },
    get token() { return runtime.context.identityKey },
  }
}
export function useConfigSymbol(): Component { return useConfigRuntime().symbolComponent }
export function useConfigBeforeLeave(guard: () => boolean | Promise<boolean>): void { useConfigRuntime().registerBeforeLeave?.(guard) }
export function useConfigLocale(): { locale: Ref<string>; t: (key: string) => string; te: (key: string) => boolean } {
  const runtime = useConfigRuntime()
  return { locale: computed(() => runtime.locale), t: key => runtime.translate?.(key) ?? key, te: key => runtime.hasTranslation?.(key) ?? false }
}
