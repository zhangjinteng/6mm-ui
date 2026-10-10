<script setup lang="ts">
import { MmFuturesTradeReport, type FuturesTradeReportRow } from '../src'

const params = new URLSearchParams(window.location.search)
const showSources = params.get('mode') === 'platform'
const empty = params.get('empty') !== 'false'
const row: FuturesTradeReportRow = {
  id: 'day:2026-10-10:merchant:1:',
  stat_date: '2026-10-10',
  source_id: '1',
  source_type: 'merchant',
  source_code: 'MER1',
  source_name: 'Layout fixture',
  trading_user_count: 1,
  order_count: 2,
  order_amount: '100',
  filled_order_count: 1,
  fill_count: 1,
  trade_amount: '50',
  cancel_order_count: 0,
  cancel_amount: '0',
  amount_fill_rate: '50',
  stat_status: 1,
}

async function request() {
  return { rows: empty ? [] : [row], total: empty ? 0 : 1 }
}
</script>

<template>
  <main class="futures-trade-report-preview">
    <MmFuturesTradeReport :request="request" :show-sources="showSources" />
  </main>
</template>

<style scoped>
:global(body) { margin: 0; }
.futures-trade-report-preview {
  display: flex;
  height: calc(100vh - 32px);
  margin: 16px;
}
</style>
