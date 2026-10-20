<script setup lang="ts" generic="Row extends PositionRow = PositionRow">
import { computed, onMounted, shallowRef, useSlots } from 'vue'
import { MmPositionTable, type PositionRow, type PositionTableExpose } from '../position-table'
import { MmButton } from '../button'
import { MmIcon } from '../icon'
import { MmTag } from '../tag'
import { message } from '../../services/message'
import type { ProTableColumn } from '../pro-table'
import LiquidationWarningRulesDialog from './LiquidationWarningRulesDialog.vue'
import { formatLiquidationRiskRatio, formatWarningThreshold, parseWarningRules, resolveWarningLevel } from './rules'
import type { LiquidationWarningRules, LiquidationWarningTableProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmLiquidationWarningTable' })
const props = withDefaults(defineProps<LiquidationWarningTableProps<Row>>(), {
  actions: () => ({}), canEditRules: false, columnsConfigurable: true, fillHeight: true,
  includeRobotUserType: false, initialKeyword: '', initialPageSize: 20,
  marketPrices: () => ({}), pageSizes: () => [20, 30, 40], showUserType: false,
})
const emit = defineEmits<{ 'rules-loaded': [rules: LiquidationWarningRules]; 'rules-saved': [rules: LiquidationWarningRules] }>()
const slots = useSlots()
const forwardedSlots = computed(() => Object.keys(slots).filter(name => !['query-actions', 'cell-warning_level'].includes(name)))
const table = shallowRef<PositionTableExpose>()
const rulesDialog = shallowRef<InstanceType<typeof LiquidationWarningRulesDialog>>()
const rules = shallowRef<LiquidationWarningRules>()
let revision = 0
const updateRules = (value: LiquidationWarningRules) => {
  ++revision
  rules.value = value
  emit('rules-loaded', value)
}
const savedRules = (value: LiquidationWarningRules) => {
  updateRules(value)
  emit('rules-saved', value)
  void table.value?.reload().catch(() => message.warning('规则已保存，列表刷新失败，请点击查询重试'))
}
onMounted(async () => {
  const epoch = revision
  try {
    const value = parseWarningRules(await props.loadRules())
    if (epoch === revision) updateRules(value)
  } catch { /* The rule dialog offers explicit retry; never fabricate a threshold. */ }
})
const columns = (defaults: ProTableColumn<Row>[]): ProTableColumn<Row>[] => {
  if (props.columns) return typeof props.columns === 'function' ? props.columns(defaults) : props.columns
  const result = defaults.filter(c => !['user_type','operation','return_rate','mark_price'].includes(c.key))
    .map(c => ({ ...c, align: 'left' as const }))
  const index = result.findIndex(c => c.key === 'created_at')
  result.splice(index < 0 ? result.length : index, 0,
    { key: 'margin_ratio', dataIndex: 'margin_ratio', title: '风险率', width: 96, hideable: false, align: 'left', formatter: formatLiquidationRiskRatio },
    { key: 'warning_level', title: '预警等级', width: 90, align: 'left' })
  return result
}
const forwardedProps = computed(() => {
  const { canEditRules, loadRules, saveRules, columns: ignored, ...rest } = props
  return rest
})
defineExpose({ reload: () => table.value?.reload() ?? Promise.resolve() })
</script>

<template>
  <div class="mm-liquidation-warning-table" data-mm-component="liquidation-warning-table">
    <MmPositionTable ref="table" v-bind="{ ...forwardedProps, ...$attrs }" :columns="columns" aria-label="强平预警" show-cell-title>
      <template v-for="name in forwardedSlots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
      <template #query-actions="slotProps">
        <MmButton class="mm-liquidation-warning-table__rule" size="sm" title="查看或配置强平预警触发规则" aria-label="强平预警规则" @click="rulesDialog?.open()">
          <MmIcon name="triangle-alert" :size="14" />
          <span>进入预警</span>
          <strong>{{ rules ? `风险率 ≥ ${formatWarningThreshold(rules.min_large_position_value)}` : '规则设置' }}</strong>
          <MmIcon name="settings-2" :size="14" />
        </MmButton>
        <slot name="query-actions" v-bind="slotProps" />
      </template>
      <template #cell-warning_level="slotProps">
        <slot name="cell-warning_level" v-bind="slotProps">
          <MmTag v-if="resolveWarningLevel(slotProps.row.margin_ratio, rules)" :type="resolveWarningLevel(slotProps.row.margin_ratio, rules)?.type" effect="soft" size="sm" round>
            {{ resolveWarningLevel(slotProps.row.margin_ratio, rules)?.label }}
          </MmTag>
          <span v-else>—</span>
        </slot>
      </template>
    </MmPositionTable>
    <LiquidationWarningRulesDialog ref="rulesDialog" :can-edit="canEditRules && !!saveRules" :load-rules="loadRules" :save-rules="saveRules" @loaded="updateRules" @saved="savedRules" />
  </div>
</template>

<style scoped>
.mm-liquidation-warning-table { height: 100%; min-height: 0; }
.mm-liquidation-warning-table :deep(.mm-position-table) { height: 100%; }
.mm-liquidation-warning-table :deep(.mm-pro-table__auto-refresh) { display: none; }
.mm-liquidation-warning-table :deep(.mm-table td) { font-variant-numeric: tabular-nums; }
.mm-liquidation-warning-table :deep(.mm-table th), .mm-liquidation-warning-table :deep(.mm-table td) { padding-inline: 8px; }
.mm-liquidation-warning-table__rule { --mm-button-color: var(--mm-color-warning); --mm-button-border: color-mix(in srgb, var(--mm-color-warning) 24%, var(--mm-color-line)); --mm-button-bg: color-mix(in srgb, var(--mm-color-warning) 6%, var(--mm-color-panel)); }
.mm-liquidation-warning-table__rule :deep(.mm-button__label) { display: inline-flex; align-items: center; gap: 6px; }
.mm-liquidation-warning-table__rule span { color: var(--mm-color-text-muted); }
.mm-liquidation-warning-table__rule strong { font-weight: 600; font-variant-numeric: tabular-nums; }
</style>
