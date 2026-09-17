import type { ProTableColumn } from '../pro-table'
import type { SelectOption } from '../select'
import type { TableRow } from '../table'

export interface UserAssetIdentity {
  agent_id?: number | string | null
  agent_name?: string | null
  agent_name_parse?: string | null
  agent_user_id?: number | string | null
  nice_name?: string | null
  platform_user_id?: number | string | null
  user_id?: number | string | null
  user_type?: number | string | null
  username?: string | null
}

export interface UserAssetPosition {
  entry_price?: number | string | null
  margin?: number | string | null
  position_side?: number | string | null
  quantity?: number | string | null
  side?: number | string | null
  symbol?: string | null
  unrealized_pnl?: number | string | null
}

export interface UserAssetRow extends TableRow {
  agent_id?: number | string | null
  agent_name?: string | null
  agent_name_parse?: string | null
  agent_user_id?: number | string | null
  asset_type?: string | null
  available_balance?: number | string | null
  frozen_balance?: number | string | null
  nice_name?: string | null
  platform_user_id?: number | string | null
  position_amount?: number | string | null
  position_pnl?: number | string | null
  positions?: UserAssetPosition[] | null
  realized_pnl?: number | string | null
  total_margin?: number | string | null
  total_quantity?: Record<string, number | string> | null
  ua_id?: number | string | null
  unrealized_pnl?: number | string | null
  user?: UserAssetIdentity | null
  user_id: number | string
  user_type?: number | string | null
  username?: string | null
  wallet_balance?: number | string | null
}

export interface UserAssetListQuery {
  agent_id?: boolean | number | string
  keyword: string
  order_by: 'platform_user_id' | 'public_user_id' | 'ua_id' | 'uid' | 'user_id'
  order_dir: 'asc' | 'desc'
  page_no: number
  page_size: number
  user_type: boolean | number | string
}

export interface UserAssetListResult<Row extends UserAssetRow = UserAssetRow> {
  rows: Row[]
  total: number
  updatedAt?: Date | string
}

export interface UserAssetRequestContext {
  signal: AbortSignal
}

export type UserAssetListRequest<Row extends UserAssetRow = UserAssetRow> = (
  query: UserAssetListQuery,
  context: UserAssetRequestContext,
) => Promise<UserAssetListResult<Row>>

export type UserAssetTableColumns<Row extends UserAssetRow = UserAssetRow> =
  | ProTableColumn<Row>[]
  | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[])

export interface UserAssetTableExpose {
  reload: () => Promise<void>
}

export interface UserAssetTableActionContext {
  reload: () => Promise<void>
}

export type UserAssetTableActionHandler<Row extends UserAssetRow = UserAssetRow> = (
  row: Row,
  context: UserAssetTableActionContext,
) => Promise<void> | void

export interface UserAssetTableActions<Row extends UserAssetRow = UserAssetRow> {
  deduct?: UserAssetTableActionHandler<Row>
  deposit?: UserAssetTableActionHandler<Row>
}

export interface UserAssetTableProps<Row extends UserAssetRow = UserAssetRow> {
  actions?: UserAssetTableActions<Row>
  ariaLabel?: string
  columns?: UserAssetTableColumns<Row>
  columnsConfigurable?: boolean
  fillHeight?: boolean
  filterDrawerSubtitle?: string
  filterDrawerTitle?: string
  includeRobotUserType?: boolean
  initialPageSize?: number
  marketPrices?: Readonly<Record<string, number | string | null | undefined>>
  pageSizes?: number[]
  recommendationOptions?: SelectOption[]
  request: UserAssetListRequest<Row>
}
