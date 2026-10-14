import type { TableRow } from '../table'

export interface FuturesFeeReportRow extends TableRow {
  id: string
  stat_date: string
  symbol?: string
  source_type?: 'merchant' | 'tenant' | 'platform'
  source_id?: string
  source_code?: string
  source_name?: string
  fee_user_count: number | string
  fee_count: number | string
  maker_trade_amount: string
  taker_trade_amount: string
  maker_handling_fee: string
  taker_handling_fee: string
  total_handling_fee: string
  stat_status: number
}

export interface FuturesFeeReportQuery {
  period: 'day' | 'month'
  symbol: string
  start_date: string
  end_date: string
  source_type?: string
  source_id?: string
  source_keyword?: string
  page_no: number
  page_size: number
  order_by: string
  order_dir: 'asc' | 'desc'
}

export interface FuturesFeeReportProps {
  request: (query: FuturesFeeReportQuery, context: { signal: AbortSignal }) => Promise<{ rows: FuturesFeeReportRow[], total: number, updatedAt?: Date | string }>
  showSources?: boolean
  showSourceCode?: boolean
  showSymbolWhenFiltered?: boolean
  sourceSearch?: 'id' | 'name-or-id'
  fillHeight?: boolean
}
