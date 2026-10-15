import { ProTableColumn } from '../pro-table';
import { TableRow } from '../table';
export interface FundingOverviewRow extends TableRow {
    id: number | string;
    platform_user_id?: number | string;
    agent_id?: number | string;
    user_id?: number | string | null;
    username?: string | null;
    nice_name?: string | null;
    funding_balance?: number | string | null;
    contract_equity?: number | string | null;
    contract_occupied?: number | string | null;
    total_assets?: number | string | null;
    last_changed_at?: string | null;
}
export interface FundingOverviewListQuery {
    keyword: string;
    start_time?: string;
    end_time?: string;
    order_by: 'user_id' | 'username' | 'funding_balance' | 'contract_equity' | 'contract_occupied' | 'total_assets' | 'last_changed_at';
    order_dir: 'asc' | 'desc';
    page_no: number;
    page_size: number;
}
export interface FundingOverviewListResult<Row extends FundingOverviewRow = FundingOverviewRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export type FundingOverviewListRequest<Row extends FundingOverviewRow = FundingOverviewRow> = (query: FundingOverviewListQuery, context: {
    signal: AbortSignal;
}) => Promise<FundingOverviewListResult<Row>>;
export interface FundingOverviewTableProps<Row extends FundingOverviewRow = FundingOverviewRow> {
    request: FundingOverviewListRequest<Row>;
    columns?: ProTableColumn<Row>[] | ((defaults: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
    ariaLabel?: string;
    fillHeight?: boolean;
    columnsConfigurable?: boolean;
    initialPageSize?: number;
    pageSizes?: number[];
}
