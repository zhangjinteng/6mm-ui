import { ProTableColumn } from '../pro-table';
import { SelectOption } from '../select';
import { TableRow } from '../table';
export interface FundingChangeLogRow extends TableRow {
    agent_id?: number | string | null;
    agent_name?: string | null;
    agent_user_id?: string | null;
    balance_after?: number | string | null;
    balance_before?: number | string | null;
    balance_change?: number | string | null;
    business_id?: number | string | null;
    business_scope?: string | null;
    business_type?: string | null;
    created_at?: string | null;
    currency?: string | null;
    id: number | string;
    ledger_id: number | string;
    nice_name?: string | null;
    platform_user_id?: number | string | null;
    user_id?: number | string | null;
    username?: string | null;
}
export interface FundingChangeLogListQuery {
    agent_id?: boolean | number | string;
    change_type?: string;
    end_time?: string;
    game?: string;
    keyword: string;
    order_by: 'balance_after' | 'balance_before' | 'balance_change' | 'created_at' | 'ledger_id';
    order_dir: 'asc' | 'desc';
    page_no: number;
    page_size: number;
    start_time?: string;
}
export interface FundingChangeLogListResult<Row extends FundingChangeLogRow = FundingChangeLogRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export type FundingChangeLogListRequest<Row extends FundingChangeLogRow = FundingChangeLogRow> = (query: FundingChangeLogListQuery, context: {
    signal: AbortSignal;
}) => Promise<FundingChangeLogListResult<Row>>;
export type FundingChangeLogTableColumns<Row extends FundingChangeLogRow = FundingChangeLogRow> = ProTableColumn<Row>[] | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
export interface FundingChangeLogTableProps<Row extends FundingChangeLogRow = FundingChangeLogRow> {
    agentOptions?: SelectOption[];
    ariaLabel?: string;
    columns?: FundingChangeLogTableColumns<Row>;
    columnsConfigurable?: boolean;
    fillHeight?: boolean;
    initialPageSize?: number;
    pageSizes?: number[];
    request: FundingChangeLogListRequest<Row>;
}
export interface FundingChangeLogTableExpose {
    reload: () => Promise<void>;
}
