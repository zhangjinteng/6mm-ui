import type { ProTableColumn } from '../pro-table'
import type { SelectOption } from '../select'
import type { TableRow } from '../table'

export type UserMappingStatus = 'normal' | 'processing' | 'abnormal'
export type UserMappingException = 'duplicate_mapping' | 'user_not_found' | 'signature_failed' | 'sync_failed'

export interface UserMappingRow extends TableRow {
  id: number | string
  mapping_id: number | string
  agent_id?: number | string | null
  agent_name?: string | null
  agent_user_id?: number | string | null
  platform_user_id?: number | string | null
  user_uid?: number | string | null
  username?: string | null
  nice_name?: string | null
  mapping_status: UserMappingStatus
  exception_code?: string | null
  exception_type?: string | null
  recent_sync_at?: string | null
}

export interface UserMappingListQuery {
  agent_id?: boolean | number | string
  keyword: string
  mapping_status: '' | UserMappingStatus
  exception_type: '' | UserMappingException
  start_time: string
  end_time: string
  order_by: 'mapping_id' | 'username' | 'agent_user_id' | 'user_uid' | 'mapping_status' | 'exception_type' | 'recent_sync_at' | 'agent_id'
  order_dir: 'asc' | 'desc'
  page_no: number
  page_size: number
}

export interface UserMappingListResult<Row extends UserMappingRow = UserMappingRow> {
  rows: Row[]
  total: number
  updatedAt?: Date | string
}

export type UserMappingListRequest<Row extends UserMappingRow = UserMappingRow> = (
  query: UserMappingListQuery,
  context: { signal: AbortSignal },
) => Promise<UserMappingListResult<Row>>

export type UserMappingTableColumns<Row extends UserMappingRow = UserMappingRow> =
  | ProTableColumn<Row>[]
  | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[])

export interface UserMappingTableProps<Row extends UserMappingRow = UserMappingRow> {
  agentOptions?: SelectOption[]
  ariaLabel?: string
  columns?: UserMappingTableColumns<Row>
  columnsConfigurable?: boolean
  fillHeight?: boolean
  initialPageSize?: number
  pageSizes?: number[]
  request: UserMappingListRequest<Row>
}

export interface UserMappingTableExpose {
  reload: () => Promise<void>
}
