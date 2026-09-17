import type { ProTableColumn } from '../pro-table'
import type { TableRow } from '../table'

export interface LiquidationIdentity {
  agent_id?: number | string | null
  agent_user_id?: number | string | null
  nice_name?: string | null
  platform_user_id?: number | string | null
  public_user_id?: number | string | null
  user_id?: number | string | null
  user_type?: number | string | null
  username?: string | null
}

export interface LiquidationRow extends TableRow {
  agent_id?: number | string | null
  agent_user_id?: number | string | null
  average_execution_price?: number | string | null
  leverage?: number | string | null
  liquidation_fee?: number | string | null
  liquidation_quantity?: number | string | null
  margin_mode?: number | string | null
  occurred_at?: string | null
  platform_user_id?: number | string | null
  position_id: number | string
  position_side?: string | null
  product_category?: string | null
  product_category_name?: string | null
  public_user_id?: number | string | null
  symbol?: string | null
  user?: LiquidationIdentity | null
  user_id?: number | string | null
  user_type?: number | string | null
}

export interface LiquidationListQuery {
  end_time: string
  keyword: string
  order_by: 'average_execution_price' | 'leverage' | 'liquidation_quantity' | 'margin_mode' | 'occurred_at' | 'position_id' | 'position_side' | 'symbol' | 'user_id' | 'user_type'
  order_dir: 'asc' | 'desc'
  page_no: number
  page_size: number
  position_side: boolean | number | string
  product_category: boolean | number | string
  start_time: string
  symbol: string
  user_type?: boolean | number | string
}

export interface LiquidationListResult<Row extends LiquidationRow = LiquidationRow> {
  rows: Row[]
  total: number
  updatedAt?: Date | string
}

export interface LiquidationRequestContext {
  signal: AbortSignal
}

export type LiquidationListRequest<Row extends LiquidationRow = LiquidationRow> = (
  query: LiquidationListQuery,
  context: LiquidationRequestContext,
) => Promise<LiquidationListResult<Row>>

export type LiquidationTableColumns<Row extends LiquidationRow = LiquidationRow> =
  | ProTableColumn<Row>[]
  | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[])

export interface LiquidationTableActionContext {
  reload: () => Promise<void>
}

export type LiquidationTableActionHandler<Row extends LiquidationRow = LiquidationRow> = (
  row: Row,
  context: LiquidationTableActionContext,
) => Promise<void> | void

export interface LiquidationTableActions<Row extends LiquidationRow = LiquidationRow> {
  detail?: LiquidationTableActionHandler<Row>
  trades?: LiquidationTableActionHandler<Row>
}

export interface LiquidationTableProps<Row extends LiquidationRow = LiquidationRow> {
  actions?: LiquidationTableActions<Row>
  ariaLabel?: string
  columns?: LiquidationTableColumns<Row>
  columnsConfigurable?: boolean
  fillHeight?: boolean
  filterDrawerSubtitle?: string
  filterDrawerTitle?: string
  includeRobotUserType?: boolean
  initialKeyword?: string
  initialPageSize?: number
  pageSizes?: number[]
  productCategoryOptions?: Array<{ label: string, value: string }>
  request: LiquidationListRequest<Row>
  showUserType?: boolean
}

export interface LiquidationTableExpose {
  reload: () => Promise<void>
}
