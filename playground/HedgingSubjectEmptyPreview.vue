<template>
  <div class="hedging-empty-fixture">
    <button type="button" @click="toggleRows">切换数据</button>
    <MmHedgingSubjectConfig ref="subject" :request="request" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { MmHedgingSubjectConfig, type HedgingSubjectConfigRow } from '../src'
const subject = ref<InstanceType<typeof MmHedgingSubjectConfig>>()
let populated = false
const row: HedgingSubjectConfigRow = { agent_id: 1, agent_name: '布局测试', accounts: [], exchanges: [], global_enabled: false,
  connected_account_count: 0, enabled_symbol_count: 0, status: 'pending_config', status_label: '待配置', updated_at: '' }
const request = async () => ({ lists: populated ? [row] : [], count: populated ? 1 : 0 })
async function toggleRows() { populated = !populated; await subject.value?.refresh() }
</script>
<style>
html, body, #app { margin: 0; height: 100%; }
.hedging-empty-fixture { height: calc(100dvh - 48px); padding: 24px; }
.hedging-empty-fixture > button { position: fixed; top: 0; right: 0; z-index: 10; }
</style>
