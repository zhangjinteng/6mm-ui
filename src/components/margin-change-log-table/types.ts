import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import type { TableRow } from '../table'
import type { TagType } from '../tag'

export interface MarginChangeLogIdentity {
  nice_name?: string | null
  platform_user_id?: number | string | null
  user_id?: number | string | null
  user_type?: number | string | null
  username?: string | null
}

export interface MarginChangeLogRow extends TableRow {
  agent_id?: number | string | null
  balance_after?: number | string | null
  balance_before?: number | string | null
  biz_id?: number | string | null
  biz_type?: string | null
  created_at?: string | null
  currency?: string | null
  delta_amount?: number | string | null
  id: number | string
  nice_name?: string | null
  order_no?: number | string | null
  platform_user_id?: number | string | null
  transfer_amount?: number | string | null
  user?: MarginChangeLogIdentity | null
  user_id?: number | string | null
  user_type?: number | string | null
  username?: string | null
}

export interface MarginChangeLogListQuery {
  biz_type?: string
  biz_types?: string[]
  end_time: string
  include_zero_amount: 0 | 1
  order_by: 'balance_after' | 'balance_before' | 'biz_type' | 'created_at' | 'delta_amount'
  order_dir: 'asc' | 'desc'
  page_no: number
  page_size: number
  start_time: string
  user_id: string
  user_type: boolean | number | string
  username: string
}

export interface MarginChangeLogListResult<Row extends MarginChangeLogRow = MarginChangeLogRow> {
  rows: Row[]
  total: number
  updatedAt?: Date | string
}

export interface MarginChangeLogRequestContext {
  filters: QueryBarValue
  signal: AbortSignal
}

export type MarginChangeLogListRequest<Row extends MarginChangeLogRow = MarginChangeLogRow> = (
  query: MarginChangeLogListQuery,
  context: MarginChangeLogRequestContext,
) => Promise<MarginChangeLogListResult<Row>>

export type MarginChangeLogTableColumns<Row extends MarginChangeLogRow = MarginChangeLogRow> =
  | ProTableColumn<Row>[]
  | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[])

export type MarginChangeLogTableQueryFields =
  | QueryBarField[]
  | ((defaultFields: QueryBarField[]) => QueryBarField[])

export interface MarginChangeLogTableProps<Row extends MarginChangeLogRow = MarginChangeLogRow> {
  allowedBizTypes?: readonly string[]
  ariaLabel?: string
  bizTypeLabels?: Readonly<Record<string, string>>
  bizTypeTagTypes?: Readonly<Record<string, TagType>>
  columns?: MarginChangeLogTableColumns<Row>
  columnsConfigurable?: boolean
  fillHeight?: boolean
  filterDrawerSubtitle?: string
  filterDrawerTitle?: string
  hiddenBizTypes?: readonly string[]
  includeZeroAmount?: boolean
  initialPageSize?: number
  pageSizes?: number[]
  queryFields?: MarginChangeLogTableQueryFields
  request: MarginChangeLogListRequest<Row>
  showTransferAmount?: boolean
  showTransferStatus?: boolean
  showUserFilters?: boolean
}

export interface MarginChangeLogTableExpose {
  reload: () => Promise<void>
}
