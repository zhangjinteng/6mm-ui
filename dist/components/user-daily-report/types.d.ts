import { TableRow } from '../table';
export interface UserDailyReportRow extends TableRow {
    id: string;
    stat_date: string;
    source_type?: 'merchant' | 'tenant' | 'platform';
    source_id?: string;
    source_code?: string;
    source_name?: string;
    initial_user_count: number | string;
    new_user_count: number | string;
    transfer_in_user_count: number | string;
    transfer_in_conversion_rate: number | string;
    transfer_in_amount: string;
    transfer_out_user_count: number | string;
    transfer_out_amount: string;
    active_user_count: number | string;
    active_rate: number | string;
    total_trading_user_count: number | string;
    trading_user_count: number | string;
    prediction_trading_user_count: number | string;
    stat_status: 'completed' | 'processing';
}
export interface UserDailyReportQuery {
    period: 'day' | 'month';
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
export interface UserDailyReportProps {
    request: (query: UserDailyReportQuery, context: {
        signal: AbortSignal;
    }) => Promise<{
        rows: UserDailyReportRow[];
        total: number;
        updatedAt?: Date | string;
    }>;
    showSources?: boolean;
    showSourceCode?: boolean;
    sourceSearch?: 'id' | 'name-or-id';
    fillHeight?: boolean;
}
