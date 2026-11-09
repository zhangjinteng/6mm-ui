<script setup lang="ts">
import { MmTenantBrandSettings, type TenantBrandDetail, type TenantBrandSaveInput } from '../src'
const params = new URLSearchParams(location.search)
let detail: TenantBrandDetail = { tenant_id: '900001', tenant_name: 'AlphaEx', can_edit: !params.has('readonly'), sites: [
  { site_id: '910001', site_name: '主站', config_version: '8', revision: 'a'.repeat(64), updated_at: '2026-11-03T10:18:00Z', domains: [{ domain: 'trade.example.com', is_primary: true }] },
  { site_id: '910002', site_name: '备用站点', config_version: '8', revision: 'b'.repeat(64), domains: [] },
] }
async function load() { return structuredClone(detail) }
async function save(input: TenantBrandSaveInput) {
  // In-memory preview only. Never calls business APIs, DNS or configuration publishers.
  const site = detail.sites.find(site => site.site_id === input.site_id)!
  site.domains = structuredClone(input.domains); site.revision = 'c'.repeat(64)
  site.config_version = String(Number(site.config_version) + 1)
  return { changed: true, config_version: site.config_version, revision: site.revision, snapshot_version: site.config_version }
}
</script>
<template><main class="brand-preview"><MmTenantBrandSettings :load="load" :save="save" /></main></template>
<style>body { margin: 0; background: #f6f7f9; } .brand-preview { padding: 12px; --navbar-height: 0px; --mm-color-primary: #008675; }</style>
