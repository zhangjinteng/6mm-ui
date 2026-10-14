import type { TableRow } from '../table'

export interface AssetBalanceReportRow extends TableRow {
  id: string | number; stat_date: string; account_type: 'contract' | 'funding'; currency: string
  source_type?: 'platform' | 'tenant' | 'merchant'; source_id?: string; source_name?: string
  funded_user_count: string | number; opening_total: string | null; closing_total: string | null
  period_net_change: string | null; closing_available: string | null; closing_occupied: string | null
  stat_status?: string | number
}
export interface AssetBalanceReportQuery {
  period: 'day' | 'month'; currency: string; start_date: string; end_date: string
  source_type?: string; source_keyword?: string
  page_no: number; page_size: number; order_by: string; order_dir: 'asc' | 'desc'
}
export interface AssetBalanceReportProps {
  request: (params: AssetBalanceReportQuery, context: { signal: AbortSignal }) => Promise<{
    rows: AssetBalanceReportRow[]; total: number; currencies?: string[]; updatedAt?: string | Date
  }>
  showSources?: boolean; fillHeight?: boolean
}
