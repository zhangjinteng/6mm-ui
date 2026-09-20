import type { ProTableColumn } from '../pro-table'
import type { SelectOption } from '../select'
import type { TableRow } from '../table'

export interface FundingAccountRow extends TableRow {
  account_balance?: number | string | null
  agent_id?: number | string | null
  agent_name?: string | null
  currency?: string | null
  id: number | string
  last_changed_at?: string | null
  nice_name?: string | null
  platform_user_id?: number | string | null
  user_id?: number | string | null
  username?: string | null
}

export interface FundingAccountListQuery {
  agent_id?: boolean | number | string
  end_time?: string
  keyword: string
  order_by: 'account_balance' | 'currency' | 'last_changed_at'
  order_dir: 'asc' | 'desc'
  page_no: number
  page_size: number
  start_time?: string
}

export interface FundingAccountListResult<Row extends FundingAccountRow = FundingAccountRow> {
  rows: Row[]
  total: number
  updatedAt?: Date | string
}

export type FundingAccountListRequest<Row extends FundingAccountRow = FundingAccountRow> = (
  query: FundingAccountListQuery,
  context: { signal: AbortSignal },
) => Promise<FundingAccountListResult<Row>>

export type FundingAccountTableColumns<Row extends FundingAccountRow = FundingAccountRow> =
  | ProTableColumn<Row>[]
  | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[])

export interface FundingAccountTableProps<Row extends FundingAccountRow = FundingAccountRow> {
  agentOptions?: SelectOption[]
  ariaLabel?: string
  columns?: FundingAccountTableColumns<Row>
  columnsConfigurable?: boolean
  fillHeight?: boolean
  initialPageSize?: number
  pageSizes?: number[]
  request: FundingAccountListRequest<Row>
}

export interface FundingAccountTableExpose {
  reload: () => Promise<void>
}
