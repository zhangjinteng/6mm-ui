import { TableRow } from '../table';
export interface FuturesTradeReportRow extends TableRow {
    id: string;
    stat_date: string;
    source_type?: 'merchant' | 'tenant' | 'platform';
    source_id?: string;
    source_code?: string;
    source_name?: string;
    trading_user_count: number | string;
    order_count: number | string;
    order_amount: string;
    filled_order_count: number | string;
    fill_count: number | string;
    trade_amount: string;
    cancel_order_count: number | string;
    cancel_amount: string;
    amount_fill_rate: string;
    stat_status: number;
}
export interface FuturesTradeReportQuery {
    period: 'day' | 'month';
    symbol: string;
    start_date: string;
    end_date: string;
    source_type?: string;
    source_id?: string;
    page_no: number;
    page_size: number;
    order_by: string;
    order_dir: 'asc' | 'desc';
}
export interface FuturesTradeReportProps {
    request: (query: FuturesTradeReportQuery, context: {
        signal: AbortSignal;
    }) => Promise<{
        rows: FuturesTradeReportRow[];
        total: number;
        updatedAt?: Date | string;
    }>;
    showSources?: boolean;
    fillHeight?: boolean;
}
