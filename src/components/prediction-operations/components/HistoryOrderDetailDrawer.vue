<template>
    <MmDrawer v-model="visible" :aria-label="t(title)" placement="right" :size="500" @closed="emit('closed')">
        <template #header>
            <div class="order-detail-title">
                <strong>{{ t(title) }}</strong>
                <span>{{ row ? text({ key: 'order_id', label: '订单号' }) : '-' }}</span>
            </div>
        </template>
        <div v-if="row" class="order-detail-content">
            <div class="order-detail-summary">
                <SymbolDisplay :symbol="row.symbol" />
                <MmTag :type="statusTagType" effect="soft" round size="sm" :title="orderStatusTitle(row)">
                    {{ text({ key: 'order_status', label: '订单状态' }) }}
                </MmTag>
            </div>
            <section v-for="group in groups" :key="group.title" class="order-detail-section" :aria-label="t(group.title)">
                <h3>{{ t(group.title) }}</h3>
                <MmInfoGrid size="md">
                    <MmInfoGridItem v-for="field in group.fields" :key="field.key" :label="t(field.label)" :data-detail-field="field.key">
                        <SourceTypeTag v-if="field.key === 'source_type'" :source-type="row.source_type ?? null" />
                        <SymbolDisplay v-else-if="field.key === 'symbol'" :symbol="row.symbol" />
                        <MmTag v-else-if="field.key === 'order_status'" :type="statusTagType" effect="soft" round size="sm" :title="orderStatusTitle(row)">{{ text(field) }}</MmTag>
                        <span v-else :class="field.key === 'realized_pnl' ? `is-${profitTone(row.realized_pnl)}` : undefined">{{ text(field) }}</span>
                    </MmInfoGridItem>
                </MmInfoGrid>
            </section>
        </div>
        <template #footer><MmButton @click="visible = false">{{ t('关闭') }}</MmButton></template>
    </MmDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePresentation } from '../context'
import { usePredictionLocale } from '../locale'
const t = usePredictionLocale()
const presentation = usePresentation()
import { MmButton, MmDrawer, MmInfoGrid, MmInfoGridItem, MmTag, type TagType } from '../ui'
import type { OrderRow } from '../types'
import SymbolDisplay from '../SymbolDisplay.vue'
import SourceTypeTag from '../SourceTypeTag.vue'
import { formatUserName } from '../format-user-name'
import { tableFieldText, operationHistoryDetailFields, type Field } from '../fields'
import { orderStatusSummary, orderStatusTitle, profitTone } from '../status-tone'

const props = defineProps<{ modelValue: boolean; row: OrderRow | null; game: 'UP_DOWN' | 'HIGH_LOW' }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; closed: [] }>()
const visible = computed({ get: () => props.modelValue, set: (value: boolean) => emit('update:modelValue', value) })
const title = computed(() => `${props.game === 'UP_DOWN' ? '涨跌预测' : '自选预测'}订单详情`)
const groups = computed(() => (props.game === 'UP_DOWN' ? [
    { title: '订单信息', keys: ['order_id', 'round_id', 'symbol', 'duration_seconds'] },
    { title: '用户信息', keys: ['public_user_id', 'user_name', 'source_name', 'source_type'] },
    { title: '预测信息', keys: ['direction', 'actual_direction', 'stake', 'final_odds', 'open_price', 'result_price'] },
    { title: '结算信息', keys: ['order_status', 'actual_return', 'realized_pnl', 'funds_completed_at_ms', 'debit_ledger_id', 'settlement_ledger_id'] }
] : [
    { title: '订单信息', keys: ['order_id', 'symbol', 'duration_seconds', 'fixed_odds'] },
    { title: '用户信息', keys: ['public_user_id', 'user_name', 'source_name', 'source_type'] },
    { title: '预测信息', keys: ['direction', 'actual_direction', 'open_price', 'result_price'] },
    { title: '结算信息', keys: ['stake', 'actual_return', 'realized_pnl', 'order_status', 'debit_ledger_id', 'settlement_ledger_id', 'expire_at_ms', 'funds_completed_at_ms'] }
]).map(group => ({
    title: group.title,
    fields: group.keys.filter(key => presentation().showSources || !['source_name', 'source_type'].includes(key)).map(key => operationHistoryDetailFields(props.game).find(field => field.key === key)!)
})))
const text = (field: Field) => {
    if (!props.row) return '-'
    if (field.key === 'user_name') return formatUserName(props.row.nick_name, props.row.user_name)
    const value = tableFieldText(props.row, field, props.game)
    return ['source_name', 'order_id', 'round_id', 'symbol', 'public_user_id'].includes(field.key) ? value : t(value)
}
const statusTagType = computed<TagType>(() => {
    const tone = props.row && orderStatusSummary(props.row)?.tone
    return !tone || tone === 'neutral' ? 'default' : tone
})
</script>

<style scoped>
.order-detail-title { display: flex; min-width: 0; flex-direction: column; gap: 1px; }
.order-detail-title strong { color: var(--mm-color-text); font-weight: var(--mm-font-weight-bold); }
.order-detail-title span { color: var(--mm-color-text-subtle); font-size: var(--mm-font-size-xs); overflow-wrap: anywhere; }
.order-detail-content { color: var(--mm-color-text); }
.order-detail-summary { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--mm-space-3); padding: var(--mm-space-3); border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); background: var(--mm-color-soft); }
.order-detail-section { margin-top: var(--mm-space-3); }
.order-detail-section h3 { margin: 0 0 var(--mm-space-2); color: var(--mm-color-text); font-size: var(--mm-font-size-sm); font-weight: var(--mm-font-weight-bold); }
.order-detail-section :deep(dd) { min-width: 0; overflow-wrap: anywhere; }
.is-success { color: var(--mm-color-success); }
.is-danger { color: var(--mm-color-danger); }
</style>
