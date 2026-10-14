import type { TableRow } from '../table'

export interface PlatformPnlReportRow extends TableRow {
  id: string
  stat_date: string
  source_type?: 'platform' | 'tenant' | 'merchant'
  source_id?: string
  source_name?: string
  contract_trade_pnl: string
  contract_trading_fee_income: string
  contract_liquidation_fee_income: string
  platform_funding_fee_net: string
  contract_total_pnl: string
  prediction_business_pnl: string
  total_pnl: string
  stat_status: number | string
}

export interface PlatformPnlReportQuery {
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

export interface PlatformPnlReportProps {
  request: (query: PlatformPnlReportQuery, context: { signal: AbortSignal }) => Promise<{
    rows: PlatformPnlReportRow[]
    total: number
    updatedAt?: Date | string
  }>
  showSources?: boolean
  fillHeight?: boolean
}
