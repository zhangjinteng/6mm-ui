import type { TableRow } from '../table'

export interface FuturesRiskReportRow extends TableRow {
  id: string
  stat_date: string
  source_type?: 'merchant' | 'tenant' | 'platform'
  source_id?: string
  source_code?: string
  source_name?: string
  liquidation_user_count: number | string
  liquidation_count: number | string
  liquidation_position_amount: string
  liquidation_trade_amount: string
  liquidation_realized_pnl: string
  liquidation_fee: string
  bankruptcy_count: number | string
  bankruptcy_loss: string
  uncollected_liquidation_fee: string
  uncollected_trading_fee: string
  stat_status: number
}

export interface FuturesRiskReportQuery {
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

export interface FuturesRiskReportProps {
  request: (query: FuturesRiskReportQuery, context: { signal: AbortSignal }) => Promise<{ rows: FuturesRiskReportRow[], total: number, updatedAt?: Date | string }>
  showSources?: boolean
  showSourceCode?: boolean
  sourceSearch?: 'id' | 'name-or-id'
  fillHeight?: boolean
}
