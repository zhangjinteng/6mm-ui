import type { TableRow } from '../table'

export interface FuturesUserNetPnlReportRow extends TableRow {
  id: string | number
  stat_date: string
  source_type?: 'platform' | 'tenant' | 'merchant'
  source_id?: string
  source_name?: string
  settled_user_count: number | string
  profitable_user_count: number | string
  losing_user_count: number | string
  breakeven_user_count: number | string
  close_order_count: number | string
  close_amount: string
  realized_pnl: string
  trading_fee: string
  funding_fee: string
  liquidation_fee: string
  true_net_pnl: string
  stat_status: number | string
}

export interface FuturesUserNetPnlReportQuery {
  period: 'day' | 'month'
  start_date: string
  end_date: string
  source_type?: string
  source_keyword?: string
  page_no: number
  page_size: number
  order_by: string
  order_dir: 'asc' | 'desc'
}

export interface FuturesUserNetPnlReportProps {
  request: (query: FuturesUserNetPnlReportQuery, context: { signal: AbortSignal }) => Promise<{ rows: FuturesUserNetPnlReportRow[], total: number, updatedAt?: Date | string }>
  showSources?: boolean
  fillHeight?: boolean
}
