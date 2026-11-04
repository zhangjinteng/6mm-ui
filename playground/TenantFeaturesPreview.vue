<script setup lang="ts">
import { MmTenantFeatureSettings, type TenantFeatureSettingsDetail, type TenantFeatureSaveInput } from '../src'
const params = new URLSearchParams(location.search)
const sites = [{ site_id: '910001', site_name: '主站' }, { site_id: '910002', site_name: '备用站点' }]
const values = new Map<string, { enabled: boolean; version: string | null }>()
async function load(_signal?: AbortSignal, siteId = '910001'): Promise<TenantFeatureSettingsDetail> {
  const site = sites.find(site => site.site_id === siteId)!
  const value = values.get(siteId)
  return { tenant_id: '900001', tenant_name: 'AlphaEx', ...site, sites, can_edit: !params.has('readonly'),
    features: { trade_ranking: value?.enabled ?? true }, expected_updated_at: value?.version ?? null }
}
async function save(input: TenantFeatureSaveInput) {
  // In-memory QA only: no requests to business APIs or real tenant configuration.
  values.set(input.site_id, { enabled: input.features.trade_ranking, version: new Date().toISOString() })
  return { changed: true, detail: await load(undefined, input.site_id) }
}
</script>
<template><main class="features-preview"><MmTenantFeatureSettings :load="load" :save="save" /></main></template>
<style>body { margin: 0; background: #f6f7f9; } .features-preview { padding: 12px; --navbar-height: 0px; --mm-color-primary: #008675; }</style>
