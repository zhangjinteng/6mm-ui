import type { TableRow } from '../table'

export interface FuturesPnlReportRow extends TableRow {
  id: string
  stat_date: string
  source_type?: 'merchant' | 'tenant' | 'platform'
  source_id?: string
  source_code?: string
  source_name?: string
  trading_user_count: number | string
  profitable_user_count: number | string
  losing_user_count: number | string
  trade_amount: string
  profit_amount: string
  loss_amount: string
  net_pnl: string
  stat_status: number
}

export interface FuturesPnlReportQuery {
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

export interface FuturesPnlReportProps {
  request: (query: FuturesPnlReportQuery, context: { signal: AbortSignal }) => Promise<{ rows: FuturesPnlReportRow[], total: number, updatedAt?: Date | string }>
  showSources?: boolean
  showSourceCode?: boolean
  sourceSearch?: 'id' | 'name-or-id'
  fillHeight?: boolean
}
