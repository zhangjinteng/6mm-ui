<script setup lang="ts">
// In-memory fixture only: this preview never sends HTTP requests.
import { MmTenantComplianceSettings, complianceTypes, type ComplianceDetail, type ComplianceSaveInput } from '../src'
const sites = [{ site_id: '910001', site_name: '主站' }, { site_id: '910002', site_name: '备用站点' }]
const rows = new Map<string, ComplianceDetail>()
const flags = new URLSearchParams(location.search)
async function load(_signal?: AbortSignal, siteId = '910001'): Promise<ComplianceDetail> {
    const row = rows.get(siteId) || {
        tenant_id: '900001', tenant_name: 'AlphaEx', site_id: siteId, site_name: sites.find(s => s.site_id === siteId)!.site_name,
        legal_entity_name: 'Alpha Global Technology Limited', updated_at: '2026-11-04T01:00:00Z', platform_count: 3, revision: '1'.repeat(64),
        profile: { legal_entity_name: 'Alpha Global Technology Limited', registration_number: 'HK-76120489', registered_address: '香港湾仔港湾道 18 号', support_email: 'support@example.com', effective_date: '2026-04-02' },
        agreements: complianceTypes.map((t, i) => ({ agreement_type: t.value, label: t.label, mode: i < 2 ? 'url' as const : 'platform' as const, is_enabled: true, url: i < 2 ? 'https://legal.example.com/' + t.value : '', state: 'ready' as const, template_code: t.value, published_chapters: i < 2 ? 0 : [20, 10, 13][i - 2], published_version: '1' })),
        sites, can_edit: !flags.has('readonly')
    }
    return structuredClone(row)
}
async function save(input: ComplianceSaveInput) {
    if (flags.has('uncertain')) throw new Error('Fixture network failure')
    if (flags.has('conflict')) throw { errors: { expected_revision: ['配置已被其他操作员修改，请重新加载核验'] } }
    const previous = await load(undefined, input.site_id)
    const row = { ...previous, ...input, agreements: previous.agreements.map((a, i) => ({ ...a, ...input.agreements[i] })), revision: '2'.repeat(64), updated_at: new Date().toISOString() }
    rows.set(input.site_id, JSON.parse(JSON.stringify(row)))
    return { changed: true, detail: row }
}
</script>
<template><main class="compliance-preview"><MmTenantComplianceSettings :load="load" :save="save" /></main></template>
<style>body { margin:0; background:#f6f7f9; } .compliance-preview { padding:12px; --navbar-height:0px; --mm-color-primary:#008675; }</style>
