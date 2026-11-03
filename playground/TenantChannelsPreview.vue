<script setup lang="ts">
import { MmTenantChannelSettings, type TenantChannelDetail, type TenantChannelSaveInput } from '../src'
const params = new URLSearchParams(location.search)
let detail: TenantChannelDetail = {
  tenant_id: '900001', tenant_name: 'AlphaEx', can_edit: !params.has('readonly'),
  expected_updated_at: '2026-11-03 10:18:00+00:00',
  social_links: { x: 'https://x.com/alphaex', telegram: 'https://t.me/alphaex', youtube: 'https://youtube.com/@alphaex',
    discord: 'https://discord.gg/alphaex', instagram: 'https://instagram.com/alphaex', medium: 'https://medium.com/@alphaex',
    linkedin: 'https://linkedin.com/company/alphaex', github: 'https://github.com/alphaex' },
}
async function load() { return structuredClone(detail) }
async function save(input: TenantChannelSaveInput) {
  // Preview only: never calls a business API or persists data.
  detail = { ...detail, ...input, expected_updated_at: new Date().toISOString() }
  return { changed: true, detail: structuredClone(detail) }
}
</script>
<template><main class="channel-preview"><MmTenantChannelSettings :load="load" :save="save" /></main></template>
<style>
body { margin: 0; background: #f6f7f9; }
.channel-preview { padding: 12px; --navbar-height: 0px; --mm-color-primary: #008675; }
</style>
