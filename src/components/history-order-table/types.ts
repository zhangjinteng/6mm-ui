import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import type { TableRow } from '../table'

export interface HistoryOrderIdentity {
  agent_id?: number | string | null
  agent_user_id?: number | string | null
  nice_name?: string | null
  platform_user_id?: number | string | null
  public_user_id?: number | string | null
  user_id?: number | string | null
  user_type?: number | string | null
  username?: string | null
}

export interface HistoryOrderRow extends TableRow {
  agent_id?: number | string | null
  agent_user_id?: number | string | null
  client_order_id?: number | string | null
  close_only?: boolean | number | string | null
  condition_orders?: unknown[] | null
  created_at?: string | null
  filled_quantity?: number | string | null
  leverage?: number | string | null
  maker_only?: boolean | number | string | null
  margin_mode?: number | string | null
  order_id: number | string
  order_status?: number | string | null
  order_status_parse?: string | null
  order_type?: string | null
  platform_user_id?: number | string | null
  position_id?: number | string | null
  position_value?: number | string | null
  price?: number | string | null
  product_category?: string | null
  product_category_name?: string | null
  quantity?: number | string | null
  reduce_only?: boolean | number | string | null
  remaining?: number | string | null
  side?: string | null
  symbol?: string | null
  time_in_force?: string | null
  updated_at?: string | null
  user?: HistoryOrderIdentity | null
  user_id?: number | string | null
  user_type?: number | string | null
  username?: string | null
}

export type HistoryOrderSortField =
  | 'created_at'
  | 'order_face_value'
  | 'order_id'
  | 'price'
  | 'quantity'
  | 'user_id'

export interface HistoryOrderListQuery {
  end_time: string
  keyword: string
  leverage: boolean | number | string
  maker_only: boolean | number | string
  margin_mode: boolean | number | string
  order_by: HistoryOrderSortField
  order_dir: 'asc' | 'desc'
  order_status: Array<number | string>
  order_type: boolean | number | string
  page_no: number
  page_size: number
  reduce_only: boolean | number | string
  side: boolean | number | string
  start_time: string
  symbol: string
  user_type?: boolean | number | string
}

export interface HistoryOrderListResult<Row extends HistoryOrderRow = HistoryOrderRow> {
  rows: Row[]
  total: number
  updatedAt?: Date | string
}

export interface HistoryOrderRequestContext {
  filters: QueryBarValue
  signal: AbortSignal
}

export type HistoryOrderListRequest<Row extends HistoryOrderRow = HistoryOrderRow> = (
  query: HistoryOrderListQuery,
  context: HistoryOrderRequestContext,
) => Promise<HistoryOrderListResult<Row>>

export type HistoryOrderTableColumns<Row extends HistoryOrderRow = HistoryOrderRow> =
  | ProTableColumn<Row>[]
  | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[])

export type HistoryOrderTableQueryFields =
  | QueryBarField[]
  | ((defaultFields: QueryBarField[]) => QueryBarField[])

export interface HistoryOrderTableActionContext {
  reload: () => Promise<void>
}

export type HistoryOrderTableActionHandler<Row extends HistoryOrderRow = HistoryOrderRow> = (
  row: Row,
  context: HistoryOrderTableActionContext,
) => Promise<void> | void

export interface HistoryOrderTableActions<Row extends HistoryOrderRow = HistoryOrderRow> {
  detail?: HistoryOrderTableActionHandler<Row>
}

export interface HistoryOrderTableProps<Row extends HistoryOrderRow = HistoryOrderRow> {
  actions?: HistoryOrderTableActions<Row>
  ariaLabel?: string
  columns?: HistoryOrderTableColumns<Row>
  columnsConfigurable?: boolean
  fillHeight?: boolean
  filterDrawerSubtitle?: string
  filterDrawerTitle?: string
  includeRobotUserType?: boolean
  initialKeyword?: string
  initialPageSize?: number
  pageSizes?: number[]
  queryFields?: HistoryOrderTableQueryFields
  request: HistoryOrderListRequest<Row>
  showUserType?: boolean
}

export interface HistoryOrderTableExpose {
  reload: () => Promise<void>
}
