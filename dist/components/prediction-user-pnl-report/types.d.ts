import { TableRow } from '../table';
export interface PredictionUserPnlReportRow extends TableRow {
    id: string;
    stat_date: string;
    play_type: 'all' | 'grid' | 'high_low' | 'up_down';
    symbol?: string | null;
    source_type?: 'merchant' | 'tenant' | 'platform';
    source_id?: string;
    source_code?: string;
    source_name?: string;
    trading_user_count: number;
    valid_trading_user_count: number;
    profitable_user_count: number;
    losing_user_count: number;
    breakeven_user_count: number;
    order_count: number;
    win_order_count: number;
    lose_order_count: number;
    refund_order_count: number;
    stake_amount: string;
    valid_stake_amount: string;
    return_amount: string;
    user_net_pnl: string;
    platform_pnl: string;
    payout_rate: string;
    stat_status: number;
}
export interface PredictionUserPnlReportQuery {
    play_type: string;
    symbol: string;
    start_date: string;
    end_date: string;
    source_type?: string;
    source_id?: string;
    source_keyword?: string;
    page_no: number;
    page_size: number;
    order_by: string;
    order_dir: 'asc' | 'desc';
}
export interface PredictionUserPnlReportProps {
    request: (query: PredictionUserPnlReportQuery, context: {
        signal: AbortSignal;
    }) => Promise<{
        rows: PredictionUserPnlReportRow[];
        total: number;
        updatedAt?: Date | string;
    }>;
    loadSymbols?: () => Promise<string[]>;
    showSources?: boolean;
    showSourceCode?: boolean;
    sourceSearch?: 'id' | 'name-or-id';
    fillHeight?: boolean;
}
