import { ProTableColumn } from '../pro-table';
import { QueryBarField, QueryBarValue } from '../query-bar';
import { TableRow } from '../table';
export interface FeeCommissionIdentity {
    agent_user_id?: number | string | null;
    nick_name?: string | null;
    public_user_id?: number | string | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    username?: string | null;
}
export interface FeeCommissionRow extends TableRow {
    agent_id?: number | string | null;
    agent_user_id?: number | string | null;
    base_asset?: string | null;
    commission_amount?: number | string | null;
    commission_rate?: number | string | null;
    fee_asset?: string | null;
    handling_fee?: number | string | null;
    id: number | string;
    margin_mode?: number | string | null;
    order_id?: number | string | null;
    platform_user_id?: number | string | null;
    position_id?: number | string | null;
    price?: number | string | null;
    quantity?: number | string | null;
    role_type?: string | null;
    side?: string | null;
    symbol?: string | null;
    trade_id?: number | string | null;
    trade_time?: string | null;
    trade_value?: number | string | null;
    user?: FeeCommissionIdentity | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
}
export interface FeeCommissionListQuery {
    end_time: string;
    keyword: string;
    margin_mode: boolean | number | string;
    order_by: 'commission_amount' | 'handling_fee' | 'order_id' | 'position_id' | 'public_user_id' | 'trade_time' | 'trade_value' | 'user_id';
    order_dir: 'asc' | 'desc';
    page_no: number;
    page_size: number;
    role_type: boolean | number | string;
    side: boolean | number | string;
    start_time: string;
    symbol: string;
}
export interface FeeCommissionListResult<Row extends FeeCommissionRow = FeeCommissionRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export interface FeeCommissionRequestContext {
    filters: QueryBarValue;
    signal: AbortSignal;
}
export type FeeCommissionListRequest<Row extends FeeCommissionRow = FeeCommissionRow> = (query: FeeCommissionListQuery, context: FeeCommissionRequestContext) => Promise<FeeCommissionListResult<Row>>;
export type FeeCommissionTableColumns<Row extends FeeCommissionRow = FeeCommissionRow> = ProTableColumn<Row>[] | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
export type FeeCommissionTableQueryFields = QueryBarField[] | ((defaultFields: QueryBarField[]) => QueryBarField[]);
export interface FeeCommissionTableProps<Row extends FeeCommissionRow = FeeCommissionRow> {
    ariaLabel?: string;
    columns?: FeeCommissionTableColumns<Row>;
    columnsConfigurable?: boolean;
    fillHeight?: boolean;
    filterDrawerSubtitle?: string;
    filterDrawerTitle?: string;
    initialPageSize?: number;
    pageSizes?: number[];
    queryFields?: FeeCommissionTableQueryFields;
    request: FeeCommissionListRequest<Row>;
    showCommissionAmount?: boolean;
}
export interface FeeCommissionTableExpose {
    reload: () => Promise<void>;
}
