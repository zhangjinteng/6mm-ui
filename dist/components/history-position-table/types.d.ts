import { ProTableColumn } from '../pro-table';
import { TableRow } from '../table';
export interface HistoryPositionIdentity {
    agent_id?: number | string | null;
    agent_user_id?: number | string | null;
    nice_name?: string | null;
    platform_user_id?: number | string | null;
    public_user_id?: number | string | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    username?: string | null;
}
export interface HistoryPositionRow extends TableRow {
    agent_id?: number | string | null;
    agent_user_id?: number | string | null;
    close_price?: number | string | null;
    close_quantity?: number | string | null;
    closed_at?: string | null;
    created_at?: string | null;
    entry_price?: number | string | null;
    funding_fee_accum?: number | string | null;
    handling_fee?: number | string | null;
    id: number | string;
    leverage?: number | string | null;
    margin_mode?: number | string | null;
    max_quantity?: number | string | null;
    open_quantity?: number | string | null;
    opened_at?: string | null;
    platform_user_id?: number | string | null;
    pnl?: number | string | null;
    position_id?: number | string | null;
    position_side?: string | null;
    product_category?: string | null;
    product_category_name?: string | null;
    quantity?: number | string | null;
    roe?: number | string | null;
    status?: number | string | null;
    symbol?: string | null;
    trade_fills?: {
        side?: string | null;
    } | null;
    trade_fills_all_sum_quantity?: number | string | null;
    trade_side?: string | null;
    trigger_mode?: number | string | null;
    user?: HistoryPositionIdentity | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    username?: string | null;
}
export interface HistoryPositionListQuery {
    end_time: string;
    keyword: string;
    leverage: boolean | number | string;
    margin_mode: boolean | number | string;
    order_by: 'closed_at' | 'created_at' | 'entry_price' | 'leverage' | 'margin_mode' | 'position_id' | 'position_side' | 'quantity' | 'symbol';
    order_dir: 'asc' | 'desc';
    page_no: number;
    page_size: number;
    position_side: string;
    start_time: string;
    status: boolean | number | string;
    symbol: string;
    trigger_mode: boolean | number | string;
    user_type?: boolean | number | string;
}
export interface HistoryPositionListResult<Row extends HistoryPositionRow = HistoryPositionRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export interface HistoryPositionRequestContext {
    signal: AbortSignal;
}
export type HistoryPositionListRequest<Row extends HistoryPositionRow = HistoryPositionRow> = (query: HistoryPositionListQuery, context: HistoryPositionRequestContext) => Promise<HistoryPositionListResult<Row>>;
export type HistoryPositionTableColumns<Row extends HistoryPositionRow = HistoryPositionRow> = ProTableColumn<Row>[] | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
export interface HistoryPositionTableActionContext {
    reload: () => Promise<void>;
}
export type HistoryPositionTableActionHandler<Row extends HistoryPositionRow = HistoryPositionRow> = (row: Row, context: HistoryPositionTableActionContext) => Promise<void> | void;
export interface HistoryPositionTableActions<Row extends HistoryPositionRow = HistoryPositionRow> {
    detail?: HistoryPositionTableActionHandler<Row>;
}
export interface HistoryPositionTableProps<Row extends HistoryPositionRow = HistoryPositionRow> {
    actions?: HistoryPositionTableActions<Row>;
    ariaLabel?: string;
    columns?: HistoryPositionTableColumns<Row>;
    columnsConfigurable?: boolean;
    fillHeight?: boolean;
    filterDrawerSubtitle?: string;
    filterDrawerTitle?: string;
    includeRobotUserType?: boolean;
    initialKeyword?: string;
    initialPageSize?: number;
    pageSizes?: number[];
    request: HistoryPositionListRequest<Row>;
    showUserType?: boolean;
}
export interface HistoryPositionTableExpose {
    reload: () => Promise<void>;
}
