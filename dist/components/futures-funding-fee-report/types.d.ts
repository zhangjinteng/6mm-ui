import { TableRow } from '../table';
export interface FuturesFundingFeeReportRow extends TableRow {
    id: string;
    stat_date: string;
    symbol?: string;
    source_type?: 'merchant' | 'tenant' | 'platform';
    source_id?: string;
    source_code?: string;
    source_name?: string;
    funding_settlement_user_count: number | string;
    funding_settlement_position_amount: string;
    funding_settlement_count: number | string;
    funding_fee_income: string;
    funding_fee_expense: string;
    funding_fee_net_income: string;
    funding_fee_net_income_rate: string;
    stat_status: number;
}
export interface FuturesFundingFeeReportQuery {
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
export interface FuturesFundingFeeReportProps {
    request: (query: FuturesFundingFeeReportQuery, context: {
        signal: AbortSignal;
    }) => Promise<{
        rows: FuturesFundingFeeReportRow[];
        total: number;
        updatedAt?: Date | string;
    }>;
    showSources?: boolean;
    showSourceCode?: boolean;
    showSymbolWhenFiltered?: boolean;
    sourceSearch?: 'id' | 'name-or-id';
    fillHeight?: boolean;
}
