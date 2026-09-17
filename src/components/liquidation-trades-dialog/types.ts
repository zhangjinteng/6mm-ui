import type { LiquidationRow } from '../liquidation-table'

export type LiquidationTradeIdentifier = number | string

export interface LiquidationTradeSummaryRow extends LiquidationRow {
  average_execution_price?: number | string | null
  liquidation_quantity?: number | string | null
  occurred_at?: string | null
  position_id: LiquidationTradeIdentifier
  position_side?: string | null
  symbol?: string | null
}

export interface LiquidationTradeRow extends Record<string, unknown> {
  fill_count?: number | string | null
  handling_fee?: number | string | null
  order_id?: LiquidationTradeIdentifier | null
  position_id?: LiquidationTradeIdentifier | null
  price?: number | string | null
  quantity?: number | string | null
  role_type?: string | null
  side?: string | null
  trade_time?: string | null
  trade_value?: number | string | null
}

export interface LiquidationTradeListQuery {
  page_no: number
  page_size: number
  position_id: LiquidationTradeIdentifier
}

export interface LiquidationTradeListResult<Row extends LiquidationTradeRow = LiquidationTradeRow> {
  rows: Row[]
  total: number
  updatedAt?: Date | string
}

export interface LiquidationTradeRequestContext {
  signal: AbortSignal
}

export type LiquidationTradeListRequest<Row extends LiquidationTradeRow = LiquidationTradeRow> = (
  query: LiquidationTradeListQuery,
  context: LiquidationTradeRequestContext,
) => Promise<LiquidationTradeListResult<Row>>

export type LiquidationTradeHrefResolver = (
  id: LiquidationTradeIdentifier,
) => string | undefined

export interface LiquidationTradesDialogProps<
  SummaryRow extends LiquidationTradeSummaryRow = LiquidationTradeSummaryRow,
  TradeRow extends LiquidationTradeRow = LiquidationTradeRow,
> {
  initialPageSize?: number
  modelValue: boolean
  orderTradesHref?: LiquidationTradeHrefResolver
  pageSizes?: number[]
  positionHref?: LiquidationTradeHrefResolver
  request: LiquidationTradeListRequest<TradeRow>
  row?: SummaryRow | null
}
