export type AssetDistributionSource = 'platform' | 'tenant' | 'merchant'
export type AssetDistributionAccount = 'funding' | 'contract'
export interface AssetDistributionRow extends Record<string, unknown> {
  id: string
  stat_date: string
  source_id: string
  source_type: AssetDistributionSource
  source_name: string
  account_type: AssetDistributionAccount
  currency: 'USDT'
  funded_user_count: number | null
  total_balance: string | null
  available_balance: string | null
  restricted_balance: string | null
  current_price: '1'
  total_valuation: string | null
  asset_share: string | null
  updated_at: string | null
  snapshot_status: 'complete' | 'incomplete' | 'empty'
}
export interface AssetDistributionQuery {
  source_type?: AssetDistributionSource
  source_keyword?: string
  account_type: AssetDistributionAccount | ''
  page_no: number
  page_size: number
  order_by: string
  order_dir: 'asc' | 'desc'
}
export type AssetDistributionRequest = (params: AssetDistributionQuery, context: { signal: AbortSignal }) => Promise<{
  rows: AssetDistributionRow[]; total: number
}>
export interface AssetDistributionTableProps {
  request: AssetDistributionRequest
  showSources?: boolean
  formatTimestamp?: (value: string | null) => string
}
