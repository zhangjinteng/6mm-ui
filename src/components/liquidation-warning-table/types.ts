import type { PositionRow, PositionTableProps } from '../position-table'

export interface LiquidationWarningRules {
  min_large_position_value: number
  liquidation_high_risk_threshold: number
  liquidation_warning_notify_enabled: boolean
}
export type LiquidationWarningRulesLoader = () => Promise<unknown>
export type LiquidationWarningRulesSaver = (rules: LiquidationWarningRules) => Promise<unknown>
export interface LiquidationWarningTableProps<Row extends PositionRow = PositionRow> extends PositionTableProps<Row> {
  canEditRules?: boolean
  loadRules: LiquidationWarningRulesLoader
  saveRules?: LiquidationWarningRulesSaver
}
