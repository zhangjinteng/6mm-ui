import { ProTableColumn } from '../pro-table';
import { TableRow } from '../table';
export interface PositionIdentity {
    agent_id?: number | string | null;
    agent_user_id?: number | string | null;
    nice_name?: string | null;
    platform_user_id?: number | string | null;
    public_user_id?: number | string | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    username?: string | null;
}
export interface PositionRow extends TableRow {
    agent_id?: number | string | null;
    agent_user_id?: number | string | null;
    break_even_price?: number | string | null;
    created_at?: string | null;
    entry_price?: number | string | null;
    frozen_balance?: number | string | null;
    frozen_quantity?: number | string | null;
    funding_fee_accum?: number | string | null;
    id: number | string;
    leverage?: number | string | null;
    liq_price?: number | string | null;
    margin_mode?: number | string | null;
    margin_price?: number | string | null;
    margin_ratio?: number | string | null;
    mark_price?: number | string | null;
    nice_name?: string | null;
    next_funding_fee?: number | string | null;
    platform_user_id?: number | string | null;
    pnl?: number | string | null;
    position_id?: number | string | null;
    position_side?: string | null;
    position_value?: number | string | null;
    product_category?: string | null;
    product_category_name?: string | null;
    quantity?: number | string | null;
    symbol?: string | null;
    unrealized_pnl?: number | string | null;
    updated_at?: string | null;
    user?: PositionIdentity | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    username?: string | null;
    wallet_balance?: number | string | null;
}
export interface PositionListQuery {
    end_time: string;
    keyword: string;
    leverage: boolean | number | string;
    margin_mode: boolean | number | string;
    order_by: 'created_at' | 'entry_price' | 'leverage' | 'margin_mode' | 'position_id' | 'position_side' | 'quantity' | 'symbol' | 'user_type';
    order_dir: 'asc' | 'desc';
    page_no: number;
    page_size: number;
    position_side: string;
    start_time: string;
    symbol: string;
    user_type?: boolean | number | string;
}
export interface PositionListResult<Row extends PositionRow = PositionRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export interface PositionRequestContext {
    signal: AbortSignal;
}
export type PositionListRequest<Row extends PositionRow = PositionRow> = (query: PositionListQuery, context: PositionRequestContext) => Promise<PositionListResult<Row>>;
export type PositionTableColumns<Row extends PositionRow = PositionRow> = ProTableColumn<Row>[] | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
export interface PositionTableActionContext {
    reload: () => Promise<void>;
}
export type PositionTableActionHandler<Row extends PositionRow = PositionRow> = (row: Row, context: PositionTableActionContext) => Promise<void> | void;
export interface PositionTableActions<Row extends PositionRow = PositionRow> {
    close?: PositionTableActionHandler<Row>;
    detail?: PositionTableActionHandler<Row>;
}
export interface PositionTableProps<Row extends PositionRow = PositionRow> {
    actions?: PositionTableActions<Row>;
    ariaLabel?: string;
    columns?: PositionTableColumns<Row>;
    columnsConfigurable?: boolean;
    fillHeight?: boolean;
    filterDrawerSubtitle?: string;
    filterDrawerTitle?: string;
    includeRobotUserType?: boolean;
    initialKeyword?: string;
    initialPageSize?: number;
    marketPrices?: Readonly<Record<string, number | string | null | undefined>>;
    pageSizes?: number[];
    request: PositionListRequest<Row>;
    showUserType?: boolean;
}
export interface PositionTableExpose {
    reload: () => Promise<void>;
}
