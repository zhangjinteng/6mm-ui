import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import type { TableRow } from '../table'

export type AccountChangeLogMode = 'all' | 'pnl'

export interface AccountChangeLogIdentity {
  agent_user_id?: number | string | null
  nice_name?: string | null
  platform_user_id?: number | string | null
  user_id?: number | string | null
  user_type?: number | string | null
  username?: string | null
}

export interface AccountChangeLogRow extends TableRow {
  agent_user_id?: number | string | null
  amount?: number | string | null
  asset_type?: string | null
  change_type?: string | null
  created_at?: string | null
  id: number | string
  nice_name?: string | null
  platform_user_id?: number | string | null
  product_category?: string | null
  product_category_name?: string | null
  reference_id?: number | string | null
  symbol?: string | null
  user?: AccountChangeLogIdentity | null
  user_id?: number | string | null
  user_type?: number | string | null
  username?: string | null
  wallet_balance_after?: number | string | null
  wallet_balance_before?: number | string | null
}

export interface AccountChangeLogListQuery {
  change_type: string
  cursor?: string
  end_time: string
  keyword: string
  order_by: 'amount' | 'created_at' | 'id'
  order_dir: 'asc' | 'desc'
  page_size: number
  start_time: string
  symbol: string
  user_type?: boolean | number | string
}

export interface AccountChangeLogListResult<Row extends AccountChangeLogRow = AccountChangeLogRow> {
  hasMore?: boolean
  hasPrevious?: boolean
  nextCursor?: string | null
  previousCursor?: string | null
  rows: Row[]
  updatedAt?: Date | string
}

export interface AccountChangeLogRequestContext {
  filters: QueryBarValue
  signal: AbortSignal
}

export type AccountChangeLogListRequest<Row extends AccountChangeLogRow = AccountChangeLogRow> = (
  query: AccountChangeLogListQuery,
  context: AccountChangeLogRequestContext,
) => Promise<AccountChangeLogListResult<Row>>

export type AccountChangeLogTableColumns<Row extends AccountChangeLogRow = AccountChangeLogRow> =
  | ProTableColumn<Row>[]
  | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[])

export type AccountChangeLogTableQueryFields =
  | QueryBarField[]
  | ((defaultFields: QueryBarField[]) => QueryBarField[])

export type AccountChangeLogDetailHandler<Row extends AccountChangeLogRow = AccountChangeLogRow> = (
  row: Row,
) => Promise<void> | void

export interface AccountChangeLogTableActions<Row extends AccountChangeLogRow = AccountChangeLogRow> {
  detail?: AccountChangeLogDetailHandler<Row>
}

export interface AccountChangeLogTableProps<Row extends AccountChangeLogRow = AccountChangeLogRow> {
  actions?: AccountChangeLogTableActions<Row>
  ariaLabel?: string
  columns?: AccountChangeLogTableColumns<Row>
  columnsConfigurable?: boolean
  fillHeight?: boolean
  filterDrawerSubtitle?: string
  filterDrawerTitle?: string
  includeRobotUserType?: boolean
  initialPageSize?: number
  mode?: AccountChangeLogMode
  pageSizes?: number[]
  queryFields?: AccountChangeLogTableQueryFields
  request: AccountChangeLogListRequest<Row>
  showUserType?: boolean
}

export interface AccountChangeLogTableExpose {
  reload: () => Promise<void>
}
