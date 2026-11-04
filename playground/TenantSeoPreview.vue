<script setup lang="ts">
import { MmTenantSeoSettings, type TenantSeoDetail, type TenantSeoSaveInput } from '../src'
const sites = [{ site_id: '910001', site_name: '主站' }, { site_id: '910002', site_name: '备用站点' }]
const rows = new Map<string, TenantSeoDetail>()
async function load(_signal?: AbortSignal, siteId = '910001'): Promise<TenantSeoDetail> {
  const row = rows.get(siteId) || { tenant_id: '900001', tenant_name: 'AlphaEx', site_id: siteId, site_name: sites.find(s => s.site_id === siteId)!.site_name,
    primary_domain: 'trade.example.com', indexing_enabled: false, effective_indexing_enabled: false, blocking_reason: null,
    configured_locales: 1, total_locales: 20, updated_at: '2026-11-04T01:00:00Z', default_locale: 'zh-CN',
    translations: { 'zh-CN': { title: 'AlphaEx 首页', description: '安全、可靠的数字资产交易服务。' } },
    google_verification_token: null, verification_domain: null, verification_domain_matches: false, version: 1,
    locales: [{ value: 'zh-CN', label: '简体中文 · zh-CN' }, { value: 'en', label: 'English · en' }],
    sites, can_edit: !new URLSearchParams(location.search).has('readonly') }
  return structuredClone(row)
}
async function save(input: TenantSeoSaveInput) {
  const row = { ...await load(undefined, input.site_id), ...input, version: input.expected_version + 1, updated_at: new Date().toISOString() }
  rows.set(input.site_id, JSON.parse(JSON.stringify(row)))
  return { changed: true, version: row.version, detail: row }
}
const translation = { loadContext: async () => ({ available: false, reason: '尚未启用翻译，可手动编辑。', settings: null }), translate: async () => ({ target_locale: 'en', values: {}, errors: {} }) }
</script>
<template><main class="seo-preview"><MmTenantSeoSettings :load="load" :save="save" :translation="translation" /></main></template>
<style>body { margin: 0; background: #f6f7f9; } .seo-preview { padding: 12px; --navbar-height: 0px; --mm-color-primary: #008675; }</style>
