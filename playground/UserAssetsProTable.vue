<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import {
  MmButton,
  MmTag,
  MmUserAssetTable,
  type UserAssetListQuery,
  type UserAssetRequestContext,
} from '../src'
import { resolveUserAssets } from './user-assets-fixture'

const props = withDefaults(defineProps<{ ariaLabel?: string, fillHeight?: boolean }>(), {
  ariaLabel: '商户用户资产高级表格',
  fillHeight: false,
})

const marketPrices = ref<Record<string, number>>({
  BTCUSDT: 70_280,
  ETHUSDT: 3_820,
  SOLUSDT: 168.4,
})
let priceTimer: number | undefined
let priceStep = 0

function waitForRequest(signal: AbortSignal, delay = 180): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, delay)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer)
      reject(new Error('request aborted'))
    }, { once: true })
  })
}

async function requestAssets(query: UserAssetListQuery, context: UserAssetRequestContext) {
  await waitForRequest(context.signal)
  return { ...resolveUserAssets(query), updatedAt: new Date() }
}

onMounted(() => {
  priceTimer = window.setInterval(() => {
    priceStep += 1
    const movement = priceStep % 2 === 0 ? 1 : -1
    marketPrices.value = {
      BTCUSDT: marketPrices.value.BTCUSDT! + movement * 12,
      ETHUSDT: marketPrices.value.ETHUSDT! + movement * 1.8,
      SOLUSDT: marketPrices.value.SOLUSDT! + movement * 0.12,
    }
  }, 3_000)
})

onBeforeUnmount(() => {
  if (priceTimer !== undefined) window.clearInterval(priceTimer)
})
</script>

<template>
  <MmUserAssetTable
    class="user-assets-pro-table"
    :aria-label="props.ariaLabel"
    :fill-height="props.fillHeight"
    :market-prices="marketPrices"
    :page-sizes="[20, 50, 100]"
    :request="requestAssets"
  >
    <template #cell-user_id="{ row }">
      <MmButton
        class="user-assets-pro-table__uid"
        size="sm"
        variant="text"
        :aria-label="`查看用户资产 ${row.user_id}`"
      >{{ row.user_id }}</MmButton>
    </template>

    <template #cell-user_type="{ row }">
      <MmTag round size="sm" :type="row.user_type === 1 ? 'success' : 'info'">
        {{ row.user_type === 1 ? '实盘' : '内盘' }}
      </MmTag>
    </template>
  </MmUserAssetTable>
</template>

<style scoped>
.user-assets-pro-table :deep(.mm-pro-table__auto-refresh) { display: none; }
.user-assets-pro-table :deep(.mm-table th),
.user-assets-pro-table :deep(.mm-table td) { min-width: 0; }
.user-assets-pro-table__uid { min-height: 24px; padding: 0; color: var(--mm-color-primary); font-family: var(--mm-font-family-mono); font-weight: 800; }

@media (max-width: 640px) {
  .user-assets-pro-table :deep(.mm-pro-table__pagination-summary) { display: none; }
}
</style>
