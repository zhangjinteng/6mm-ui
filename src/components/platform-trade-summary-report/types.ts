import type { TableRow } from '../table'

export interface PlatformTradeSummaryRow extends TableRow {
  id: string; stat_date: string; source_type: 'platform' | 'tenant' | 'merchant'; source_id: string
  source_name: string; source_code: string; total_trading_user_count: number | string
  trading_user_count: number | string; contract_trade_count: number | string; contract_trade_amount: string
  prediction_trading_user_count: number | string; prediction_valid_order_count: number | string
  prediction_valid_stake_amount: string; stat_status: number
}
export interface PlatformTradeSummaryQuery {
  period: 'day' | 'month'; start_date: string; end_date: string; source_type?: string; source_keyword?: string
  page_no: number; page_size: number; order_by: string; order_dir: 'asc' | 'desc'
}
export interface PlatformTradeSummaryProps {
  request: (query: PlatformTradeSummaryQuery, context: { signal: AbortSignal }) => Promise<{ rows: PlatformTradeSummaryRow[], total: number, updatedAt?: Date | string }>
  showSources?: boolean; fillHeight?: boolean
}
