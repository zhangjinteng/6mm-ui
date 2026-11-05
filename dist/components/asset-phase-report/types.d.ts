export type AssetReportKind = 'distribution' | 'changes';
export interface AssetReportQuery {
    period: 'day' | 'month';
    account_type: 'funding' | 'contract';
    currency: 'USDT';
    source_type?: 'platform' | 'tenant' | 'merchant';
    source_keyword?: string;
    start_date: string;
    end_date: string;
    page_no: number;
    page_size: number;
    order_by: string;
    order_dir: 'asc' | 'desc';
}
export interface AssetReportBucket {
    count: number | null;
    amount: string | null;
    user_share: string | null;
    asset_share: string | null;
}
export interface AssetReportRow {
    [key: string]: unknown;
    id: string;
    stat_date: string;
    source_name: string;
    source_type: 'platform' | 'tenant' | 'merchant';
    source_id: string;
    account_type: 'funding' | 'contract';
    currency: 'USDT';
    funded_user_count: number | null;
    total_assets: string | null;
    negative_assets: string | null;
    opening_assets: string | null;
    closing_assets: string | null;
    deposit_in: string | null;
    withdraw_out: string | null;
    transfer_net: string | null;
    realized_pnl: string | null;
    fee_net: string | null;
    manual_adjust: string | null;
    buckets: AssetReportBucket[];
    stat_status: 'processing' | 'completed' | 'incomplete';
    updated_at: string | null;
}
export type AssetReportRequest = (params: AssetReportQuery, context: {
    signal: AbortSignal;
}) => Promise<{
    rows: AssetReportRow[];
    total: number;
}>;
