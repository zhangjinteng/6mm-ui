<script setup lang="ts">
import { ref } from 'vue'

import {
  MmButton,
  MmIcon,
  MmProTable,
  MmTag,
  MmTooltip,
  type MmProTableRequestParams,
  type QueryBarReturnContext,
  useMmProTable,
} from '../src'
import {
  onlineAccountColumns,
  onlineAccountQueryFields,
  onlineAccountRegions,
  resolveOnlineAccounts,
  type AccountRow,
} from './online-accounts-fixture'

const props = withDefaults(defineProps<{
  ariaLabel?: string
  fillHeight?: boolean
  returnContext?: QueryBarReturnContext
}>(), {
  ariaLabel: '商户在线账户高级表格',
  fillHeight: false,
  returnContext: undefined,
})
const emit = defineEmits<{
  'return-context': [context: QueryBarReturnContext]
}>()

const failNextRequest = ref(false)

function waitForRequest(signal: AbortSignal, delay = 360): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, delay)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer)
      reject(new Error('request aborted'))
    }, { once: true })
  })
}

async function requestAccounts(params: MmProTableRequestParams) {
  await waitForRequest(params.signal)
  if (failNextRequest.value) {
    failNextRequest.value = false
    throw new Error('模拟网关暂时不可用，请重试')
  }
  return { ...resolveOnlineAccounts(params), updatedAt: new Date() }
}

const {
  filters,
  proTableBindings,
  query,
  reload,
  rows,
  total,
} = useMmProTable<AccountRow>({
  initialAutoRefreshSeconds: 0,
  initialPageSize: 20,
  initialSort: { key: 'lastActive', order: 'desc' },
  queryFields: onlineAccountQueryFields,
  request: requestAccounts,
})

function simulateError(): void {
  failNextRequest.value = true
  rows.value = []
  total.value = 0
  void reload()
}

function simulateEmpty(): void {
  filters.value = { ...filters.value, keyword: 'no-matching-account' }
  query(filters.value)
}
</script>

<template>
  <MmProTable
    v-bind="proTableBindings"
    class="online-accounts-pro-table"
    :aria-label="props.ariaLabel"
    :columns="onlineAccountColumns"
    :fill-height="props.fillHeight"
    filter-drawer-subtitle="在线账户"
    :inline-query-field-keys="['keyword', 'status']"
    :page-sizes="[10, 20, 50]"
    :return-context="props.returnContext"
    row-key="id"
    selectable
    striped
    @return-context="emit('return-context', $event)"
  >
    <template #query-actions>
      <MmButton data-testid="simulate-pro-table-empty" size="sm" @click="simulateEmpty">空结果</MmButton>
      <MmButton data-testid="simulate-pro-table-error" size="sm" variant="warning" @click="simulateError">模拟错误</MmButton>
    </template>
    <template #cell-username="{ value }">
      <MmTooltip :content="String(value)" :open-delay="0">
        <span class="online-accounts-pro-table__username">{{ value }}</span>
      </MmTooltip>
    </template>
    <template #cell-userType="{ value }"><MmTag size="sm" :type="value === 'live' ? 'primary' : 'info'">{{ value === 'live' ? '实盘' : '内盘' }}</MmTag></template>
    <template #cell-status="{ value }"><MmTag round size="sm" :type="value === 'online' ? 'success' : value === 'review' ? 'warning' : 'default'">{{ value === 'online' ? '在线' : value === 'review' ? '待复核' : '离线' }}</MmTag></template>
    <template #cell-equity="{ value }"><strong class="online-accounts-pro-table__amount">{{ Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</strong></template>
    <template #cell-exposure="{ value }"><span :class="Number(value) > 4000 ? 'online-accounts-pro-table__risk is-high' : 'online-accounts-pro-table__risk'">{{ Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span></template>
    <template #cell-region="{ value }">{{ onlineAccountRegions.find((region) => region.code === value)?.label || value }}</template>
    <template #cell-actions="{ row }">
      <MmButton icon-only size="sm" :aria-label="`查看 ${row.username}`">
        <template #icon><MmIcon name="rotate" :size="12" /></template>
      </MmButton>
    </template>
  </MmProTable>
</template>

<style scoped>
.online-accounts-pro-table__username { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.online-accounts-pro-table__amount { font-family: var(--mm-font-family-mono); font-size: var(--mm-font-size-xs); }
.online-accounts-pro-table__risk { color: var(--mm-color-text-muted); font-family: var(--mm-font-family-mono); font-size: var(--mm-font-size-xs); }
.online-accounts-pro-table__risk.is-high { color: var(--mm-color-danger); font-weight: 700; }
</style>
