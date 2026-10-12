import { TableRow } from '../table';
export interface FuturesPositionReportRow extends TableRow {
    id: string;
    stat_date: string;
    source_type?: 'merchant' | 'tenant' | 'platform';
    source_id?: string;
    source_code?: string;
    source_name?: string;
    position_user_count: number | string;
    long_position_user_count: number | string;
    short_position_user_count: number | string;
    long_position_amount: string;
    short_position_amount: string;
    closing_position_amount: string;
    occupied_margin: string;
    unrealized_pnl: string;
    average_leverage: string;
    stat_status: number;
    snapshot_at?: string;
}
export interface FuturesPositionReportQuery {
    period: 'day' | 'month';
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
export interface FuturesPositionReportProps {
    request: (query: FuturesPositionReportQuery, context: {
        signal: AbortSignal;
    }) => Promise<{
        rows: FuturesPositionReportRow[];
        total: number;
        updatedAt?: Date | string;
    }>;
    showSources?: boolean;
    showSourceCode?: boolean;
    sourceSearch?: 'id' | 'name-or-id';
    fillHeight?: boolean;
}
