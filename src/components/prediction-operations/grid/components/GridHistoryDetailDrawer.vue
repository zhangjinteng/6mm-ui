<template>
    <MmDrawer v-model="visible" :aria-label="t('预测网格订单详情')" placement="right" :size="500" @closed="emit('closed')">
        <template #header>
            <div class="order-detail-title">
                <strong>{{ t('预测网格订单详情') }}</strong>
                <span>{{ row ? text('order_no') : '-' }}</span>
            </div>
        </template>
        <div v-if="row" class="order-detail-content">
            <div class="order-detail-summary">
                <SymbolDisplay :symbol="row.symbol" />
                <MmTag :type="statusTagType" effect="soft" round size="sm">{{ text('order_status') }}</MmTag>
            </div>
            <section v-for="group in groups" :key="group.title" class="order-detail-section" :aria-label="t(group.title)">
                <h3>{{ t(group.title) }}</h3>
                <MmInfoGrid size="md">
                    <MmInfoGridItem
                        v-for="key in group.keys"
                        :key="key"
                        :label="t(key === 'user_name' ? '用户名' : tableLabels[key])"
                        :span="key === 'price_range' ? 2 : 1"
                        :data-detail-field="key"
                    >
                        <SourceTypeTag v-if="key === 'source_type'" :source-type="row.source_type ?? null" />
                        <SymbolDisplay v-else-if="key === 'symbol'" :symbol="row.symbol" />
                        <MmTag v-else-if="key === 'order_status'" :type="statusTagType" effect="soft" round size="sm">{{ text(key) }}</MmTag>
                        <span v-else :class="key === 'realized_pnl' ? `is-${profitTone(text(key))}` : undefined">{{ text(key) }}</span>
                    </MmInfoGridItem>
                </MmInfoGrid>
            </section>
        </div>
        <template #footer><MmButton @click="visible = false">{{ t('关闭') }}</MmButton></template>
    </MmDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePresentation } from '../../context'
import { usePredictionLocale } from '../../locale'
const t = usePredictionLocale()
const presentation = usePresentation()
import { MmButton, MmDrawer, MmInfoGrid, MmInfoGridItem, MmTag, type TagType } from '../../ui'
import type { GridOrder } from '../../types'
import SymbolDisplay from '../../SymbolDisplay.vue'
import SourceTypeTag from '../../SourceTypeTag.vue'
import { formatUserName } from '../../format-user-name'
import { gridTableDisplay, tableLabels } from '../format'
import { gridStatusTone, profitTone } from '../../status-tone'

const props = defineProps<{ modelValue: boolean; row: GridOrder | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; closed: [] }>()
const visible = computed({ get: () => props.modelValue, set: (value: boolean) => emit('update:modelValue', value) })
const groups = computed(() => [
    { title: '订单信息', keys: ['order_no', 'symbol', 'price_range'] },
    { title: '用户信息', keys: ['public_user_id', 'user_name', 'source_name', 'source_type'] },
    { title: '结算信息', keys: ['stake_amount', 'locked_multiplier', 'result_price', 'order_status', 'actual_return', 'realized_pnl', 'debit_ledger_id', 'settlement_ledger_id'] },
    { title: '时间信息', keys: ['created_at_ms', 'settled_at_ms'] }
].map(group => ({ ...group, keys: group.keys.filter(key => presentation().showSources || !['source_name', 'source_type'].includes(key)) })))
const text = (key: string): string => {
    if (!props.row) return '-'
    if (key === 'user_name') return formatUserName(
        typeof props.row.nick_name === 'string' ? props.row.nick_name : undefined,
        typeof props.row.user_name === 'string' ? props.row.user_name : undefined
    )
    const value = gridTableDisplay(key, props.row)
    return ['source_name', 'order_no', 'symbol', 'public_user_id'].includes(key) ? value : t(value)
}
const statusTagType = computed<TagType>(() => {
    const tone = props.row ? gridStatusTone(props.row.status) : 'neutral'
    return tone === 'neutral' ? 'default' : tone
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
