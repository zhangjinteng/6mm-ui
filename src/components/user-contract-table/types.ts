import type { ProTableColumn } from '../pro-table'
import type { TableRow } from '../table'

export interface UserContractRow extends TableRow {
  user_id: number | string
  internal_user_id?: number | string
  username?: string | null
  nice_name?: string | null
  agent_user_id?: string | null
  wallet_balance?: number | string | null
  available_balance?: number | string | null
  position_amount?: number | string | null
  position_count?: number | string | null
  order_amount?: number | string | null
  order_count?: number | string | null
  unrealized_pnl?: number | string | null
  pnl_30d?: number | string | null
  fee_30d?: number | string | null
  last_contract_at?: string | null
}

export interface UserContractListQuery {
  keyword: string
  username: string
  has_position: '' | '0' | '1'
  start_time?: string
  end_time?: string
  order_by: 'user_id' | 'wallet_balance' | 'pnl_30d'
  order_dir: 'asc' | 'desc'
  page_no: number
  page_size: number
}

export interface UserContractListResult<Row extends UserContractRow = UserContractRow> {
  rows: Row[]
  total: number
  updatedAt?: Date | string
}

export type UserContractListRequest<Row extends UserContractRow = UserContractRow> = (
  query: UserContractListQuery,
  context: { signal: AbortSignal },
) => Promise<UserContractListResult<Row>>

export type UserContractTableColumns<Row extends UserContractRow = UserContractRow> =
  | ProTableColumn<Row>[]
  | ((defaults: ProTableColumn<Row>[]) => ProTableColumn<Row>[])

export interface UserContractTableProps<Row extends UserContractRow = UserContractRow> {
  request: UserContractListRequest<Row>
  columns?: UserContractTableColumns<Row>
  initialKeyword?: number | string
  initialPageSize?: number
}

export interface UserContractAccount { user_id: number | string; wallet_balance?: number | string; available_balance?: number | string }
export interface UserContractPosition { quantity?: number | string; entry_price?: number | string; unrealized_pnl?: number | string | null; side?: number | string; symbol?: string }
export interface UserContractOrder { original_qty?: number | string; filled_qty?: number | string; order_price?: number | string; trigger_price?: number | string; order_source?: string; frozen_amount?: number | string; symbol?: string }
export interface UserContractPositionGroup { user_id: number | string; positions?: UserContractPosition[] }
export interface UserContractOrderGroup { user_id: number | string; orders?: UserContractOrder[]; total_count?: number }
export interface UserContractMetrics { user_id: number | string; pnl_30d?: number | string | null; fee_30d?: number | string | null; last_contract_at?: string | null }
