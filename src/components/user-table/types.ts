import type { ProTableColumn } from '../pro-table'
import type { IpLocationInfo } from '../ip-location'
import type { SelectOption } from '../select'
import type { TableRow } from '../table'

export interface UserRow extends TableRow {
  agent_id?: number | string | null
  agent_name?: string | null
  agent_name_parse?: string | null
  agent_user_id?: string | null
  created_at?: string | null
  last_login_at?: string | null
  last_login_ip?: string | null
  last_login_ip_info?: IpLocationInfo | null
  nice_name?: string | null
  online_status?: boolean | number | string | null
  risk_label?: number | string | null
  risk_status?: number | string | null
  updated_at?: string | null
  user_id: number | string
  user_type?: number | string | null
  username?: string | null
  vip_level?: number | string | null
  [key: string]: unknown
}

export interface UserListQuery {
  agent_id?: boolean | number | string
  create_time_end: string
  create_time_start: string
  keyword: string
  order_by: 'created_at' | 'last_login_at' | 'user_id' | 'vip_level'
  order_dir: 'asc' | 'desc'
  page_no: number
  page_size: number
  user_type: boolean | number | string
  vip_level: boolean | number | string
}

export interface UserListResult<Row extends UserRow = UserRow> {
  rows: Row[]
  total: number
  updatedAt?: Date | string
}

export interface UserRequestContext {
  signal: AbortSignal
}

export type UserListRequest<Row extends UserRow = UserRow> = (
  query: UserListQuery,
  context: UserRequestContext,
) => Promise<UserListResult<Row>>

export type UserTableColumns<Row extends UserRow = UserRow> =
  | ProTableColumn<Row>[]
  | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[])

export interface UserTableExpose {
  reload: () => Promise<void>
}

export interface UserTableActionContext {
  reload: () => Promise<void>
}

export type UserTableActionHandler<Row extends UserRow = UserRow> = (
  row: Row,
  context: UserTableActionContext,
) => Promise<void> | void

export interface UserTableActions<Row extends UserRow = UserRow> {
  cancelAllOrders?: UserTableActionHandler<Row>
  closeAllPositions?: UserTableActionHandler<Row>
}

export interface UserTableProps<Row extends UserRow = UserRow> {
  actions?: UserTableActions<Row>
  ariaLabel?: string
  columns?: UserTableColumns<Row>
  columnsConfigurable?: boolean
  fillHeight?: boolean
  filterDrawerSubtitle?: string
  filterDrawerTitle?: string
  includeRobotUserType?: boolean
  initialPageSize?: number
  pageSizes?: number[]
  recommendationOptions?: SelectOption[]
  request: UserListRequest<Row>
}
