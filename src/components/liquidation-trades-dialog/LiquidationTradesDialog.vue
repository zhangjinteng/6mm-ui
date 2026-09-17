<script setup lang="ts" generic="SummaryRow extends LiquidationTradeSummaryRow = LiquidationTradeSummaryRow, TradeRow extends LiquidationTradeRow = LiquidationTradeRow">
import { computed, ref, useId, watch } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import { MmIcon } from '../icon'
import { MmLink } from '../link'
import { MmPagination } from '../pagination'
import { MmTag } from '../tag'
import type { TagType } from '../tag'
import type {
  LiquidationTradeIdentifier,
  LiquidationTradeRow,
  LiquidationTradeSummaryRow,
  LiquidationTradesDialogProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmLiquidationTradesDialog' })

const props = withDefaults(defineProps<LiquidationTradesDialogProps<SummaryRow, TradeRow>>(), {
  initialPageSize: 15,
  orderTradesHref: undefined,
  pageSizes: () => [15, 20, 50, 100],
  positionHref: undefined,
  row: null,
})

const emit = defineEmits<{
  closed: []
  'order-click': [id: LiquidationTradeIdentifier, event: MouseEvent]
  'position-click': [id: LiquidationTradeIdentifier, event: MouseEvent]
  'update:modelValue': [value: boolean]
}>()

const { messages } = useLocale()
const copy = computed(() => messages.value.liquidations)
const descriptionId = `mm-liquidation-trades-dialog-${useId()}-description`
const loading = ref(false)
const loadError = ref('')
const tradeRows = ref<TradeRow[]>([])
const tradeTotal = ref(0)
const tradePage = ref(1)
const tradePageSize = ref(normalizePageSize(props.initialPageSize))
const liquidationTriggerPrice = ref<number | string | null>(null)
let loadSequence = 0
let activeController: AbortController | null = null

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
const row = computed(() => props.row)
const userUid = computed(() => displayValue(
  row.value?.user?.public_user_id ?? row.value?.public_user_id ?? row.value?.user_id,
))
const tradeQuantityTotal = computed(() => tradeRows.value.reduce((total, trade) => {
  const quantity = Number(trade.quantity)
  return Number.isFinite(quantity) ? total + Math.abs(quantity) : total
}, 0))
const tradeQuantitySummary = computed(() => {
  const expected = Number(row.value?.liquidation_quantity)
  return Number.isFinite(expected) ? Math.abs(expected) : tradeQuantityTotal.value
})

function normalizePageSize(value: number): number {
  const candidate = Number(value)
  return Number.isFinite(candidate) ? Math.min(100, Math.max(1, Math.trunc(candidate))) : 15
}

function displayValue(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value)
}

function formatDecimal(value: unknown, maximumFractionDigits: number, minimumFractionDigits = 0): string {
  if (value === null || value === undefined || value === '') return '-'
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return '-'
  return numberValue.toLocaleString('en-US', { maximumFractionDigits, minimumFractionDigits })
}

function positionSideLabel(value: unknown): string {
  const side = String(value ?? '').toLowerCase()
  if (side === 'long') return copy.value.long
  if (side === 'short') return copy.value.short
  return '-'
}

function positionSideType(value: unknown): TagType {
  const side = String(value ?? '').toLowerCase()
  if (side === 'long') return 'success'
  if (side === 'short') return 'danger'
  return 'info'
}

function tradeSideLabel(value: unknown): string {
  const side = String(value ?? '').toLowerCase()
  if (side === 'buy') return copy.value.buy
  if (side === 'sell') return copy.value.sell
  return displayValue(value)
}

function tradeSideType(value: unknown): TagType {
  return String(value ?? '').toLowerCase() === 'sell' ? 'danger' : 'success'
}

function roleLabel(value: unknown): string {
  const role = String(value ?? '').toUpperCase()
  if (role === 'TAKER') return 'Taker'
  if (role === 'MAKER') return 'Maker'
  return displayValue(value)
}

function identifier(value: unknown): LiquidationTradeIdentifier | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const text = String(value ?? '').trim()
  return text === '' ? null : text
}

function positionLink(id: unknown): string | undefined {
  const value = identifier(id)
  return value === null ? undefined : props.positionHref?.(value)
}

function orderLink(id: unknown): string | undefined {
  const value = identifier(id)
  return value === null ? undefined : props.orderTradesHref?.(value)
}

function handlePositionClick(id: unknown, event: MouseEvent): void {
  const value = identifier(id)
  if (value === null) {
    event.preventDefault()
    return
  }
  emit('position-click', value, event)
}

function handleOrderClick(id: unknown, event: MouseEvent): void {
  const value = identifier(id)
  if (value === null) {
    event.preventDefault()
    return
  }
  emit('order-click', value, event)
}

async function loadTradeRows(): Promise<void> {
  const positionId = identifier(row.value?.position_id)
  if (!visible.value || positionId === null) return

  activeController?.abort()
  const controller = new AbortController()
  activeController = controller
  const sequence = ++loadSequence
  loading.value = true
  loadError.value = ''
  tradeRows.value = []

  try {
    const result = await props.request({
      page_no: tradePage.value,
      page_size: tradePageSize.value,
      position_id: positionId,
    }, { signal: controller.signal })
    if (sequence !== loadSequence || controller.signal.aborted) return

    tradeRows.value = Array.isArray(result?.rows) ? result.rows : []
    if (tradePage.value === 1) liquidationTriggerPrice.value = tradeRows.value[0]?.price ?? null
    tradeTotal.value = Math.max(0, Number(result?.total) || tradeRows.value.length)
  }
  catch (error: unknown) {
    if (sequence !== loadSequence || controller.signal.aborted) return
    const candidate = error as { message?: string, msg?: string } | null
    loadError.value = candidate?.msg || candidate?.message || copy.value.tradeLoadFailed
  }
  finally {
    if (sequence === loadSequence) loading.value = false
    if (activeController === controller) activeController = null
  }
}

function handleTradePageChange(page: number): void {
  if (page === tradePage.value) return
  tradePage.value = page
  void loadTradeRows()
}

function handleTradePageSizeChange(pageSize: number): void {
  const normalized = normalizePageSize(pageSize)
  if (normalized === tradePageSize.value) return
  tradePageSize.value = normalized
  tradePage.value = 1
  void loadTradeRows()
}

function resetState(): void {
  activeController?.abort()
  activeController = null
  loadSequence += 1
  loading.value = false
  loadError.value = ''
  tradeRows.value = []
  tradeTotal.value = 0
  tradePage.value = 1
  liquidationTriggerPrice.value = null
}

function handleClosed(): void {
  resetState()
  emit('closed')
}

watch(
  () => [props.modelValue, props.row?.position_id] as const,
  ([isVisible]) => {
    if (!isVisible) return
    resetState()
    void loadTradeRows()
  },
  { immediate: true },
)
</script>

<template>
  <MmDialog
    v-bind="$attrs"
    v-model="visible"
    :aria-describedby="descriptionId"
    :close-on-click-modal="false"
    panel-class="mm-liquidation-trades-dialog-panel"
    width="min(1180px, calc(100vw - 24px))"
    @closed="handleClosed"
  >
    <template #header>
      <div class="mm-liquidation-trades-dialog__title">
        <strong>{{ copy.tradeDialogTitle }}</strong>
        <span :id="descriptionId">{{ copy.tradeDialogSubtitle(displayValue(row?.position_id)) }}</span>
      </div>
    </template>

    <div v-if="row" class="mm-liquidation-trades-dialog__body">
      <dl class="mm-liquidation-trades-dialog__summary">
        <div><dt>{{ copy.userUid }}</dt><dd>{{ userUid }}</dd></div>
        <div>
          <dt>{{ copy.positionId }}</dt>
          <dd>
            <MmLink
              v-if="identifier(row.position_id) !== null"
              :aria-label="copy.viewPositionFor(displayValue(row.position_id))"
              :href="positionLink(row.position_id)"
              :title="copy.viewPosition"
              @click="handlePositionClick(row.position_id, $event)"
            >
              {{ displayValue(row.position_id) }}
            </MmLink>
            <template v-else>-</template>
          </dd>
        </div>
        <div><dt>{{ copy.contract }}</dt><dd>{{ displayValue(row.symbol) }}</dd></div>
        <div>
          <dt>{{ copy.side }}</dt>
          <dd><MmTag effect="soft" round size="sm" :type="positionSideType(row.position_side)">{{ positionSideLabel(row.position_side) }}</MmTag></dd>
        </div>
        <div><dt>{{ copy.liquidationQuantity }}</dt><dd>{{ formatDecimal(row.liquidation_quantity, 8) }}</dd></div>
        <div><dt>{{ copy.averageExecutionPrice }}</dt><dd>{{ formatDecimal(row.average_execution_price, 4, 2) }}</dd></div>
        <div><dt>{{ copy.triggerPrice }}</dt><dd>{{ formatDecimal(liquidationTriggerPrice, 8) }}</dd></div>
        <div><dt>{{ copy.liquidationResult }}</dt><dd>{{ copy.fullLiquidation }}</dd></div>
        <div><dt>{{ copy.occurredAt }}</dt><dd>{{ displayValue(row.occurred_at) }}</dd></div>
      </dl>

      <section class="mm-liquidation-trades-dialog__details">
        <div class="mm-liquidation-trades-dialog__section-title">
          <strong>{{ copy.tradeDetails }}</strong>
          <span>{{ copy.tradeDetailsSummary(tradeTotal, formatDecimal(tradeQuantitySummary, 8)) }}</span>
        </div>

        <div v-if="loading" class="mm-liquidation-trades-dialog__state" role="status">
          <MmIcon class="is-loading" name="loader-circle" :size="22" />
          <span>{{ copy.tradeLoading }}</span>
        </div>
        <div v-else-if="loadError" class="mm-liquidation-trades-dialog__state is-error" role="alert">
          <MmIcon name="alert" :size="20" />
          <span>{{ loadError }}</span>
          <MmButton size="sm" @click="loadTradeRows">{{ messages.common.retry }}</MmButton>
        </div>
        <div v-else-if="tradeRows.length === 0" class="mm-liquidation-trades-dialog__state">
          {{ copy.noTradeDetails }}
        </div>
        <div v-else class="mm-liquidation-trades-dialog__table-content">
          <div class="mm-liquidation-trades-dialog__table-wrap">
            <table class="mm-liquidation-trades-dialog__table">
              <thead>
                <tr>
                  <th>{{ copy.positionId }}</th><th>{{ copy.orderId }}</th><th>{{ copy.tradeSide }}</th>
                  <th>{{ copy.tradePrice }}</th><th>{{ copy.tradeQuantity }}</th><th>{{ copy.tradeAmount }}</th>
                  <th>{{ copy.tradeRole }}</th><th>{{ copy.handlingFee }}</th><th>{{ copy.tradeStatus }}</th><th>{{ copy.tradeTime }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trade in tradeRows" :key="String(trade.order_id)">
                  <td>
                    <MmLink
                      v-if="identifier(trade.position_id) !== null"
                      :aria-label="copy.viewPositionFor(displayValue(trade.position_id))"
                      :href="positionLink(trade.position_id)"
                      :title="copy.viewPosition"
                      @click="handlePositionClick(trade.position_id, $event)"
                    >{{ displayValue(trade.position_id) }}</MmLink>
                    <template v-else>-</template>
                  </td>
                  <td>
                    <MmLink
                      :aria-label="copy.viewOrderTradesFor(displayValue(trade.order_id))"
                      data-action="view-liquidation-order-trades"
                      :href="orderLink(trade.order_id)"
                      @click="handleOrderClick(trade.order_id, $event)"
                    >
                      {{ displayValue(trade.order_id) }}
                      <template #suffix><MmIcon name="arrow-up-right" :size="12" /></template>
                    </MmLink>
                  </td>
                  <td><MmTag effect="soft" round size="sm" :type="tradeSideType(trade.side)">{{ tradeSideLabel(trade.side) }}</MmTag></td>
                  <td>{{ formatDecimal(trade.price, 8) }}</td><td>{{ formatDecimal(trade.quantity, 8) }}</td>
                  <td>{{ formatDecimal(trade.trade_value, 8, 2) }}</td><td>{{ roleLabel(trade.role_type) }}</td>
                  <td>{{ formatDecimal(trade.handling_fee, 8, 2) }}</td>
                  <td><MmTag effect="soft" round size="sm" type="success">{{ copy.filled }}</MmTag></td>
                  <td>{{ displayValue(trade.trade_time) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <MmPagination
            class="mm-liquidation-trades-dialog__pagination"
            :current-page="tradePage"
            :page-size="tradePageSize"
            :page-sizes="pageSizes"
            show-size-changer
            size="sm"
            :total="tradeTotal"
            @current-change="handleTradePageChange"
            @size-change="handleTradePageSizeChange"
          />
        </div>
      </section>
    </div>

    <template #footer><MmButton @click="visible = false">{{ messages.common.close }}</MmButton></template>
  </MmDialog>
</template>

<style src="./liquidation-trades-dialog.css"></style>
