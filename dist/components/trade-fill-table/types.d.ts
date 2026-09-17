import { ProTableColumn } from '../pro-table';
import { TableRow } from '../table';
export interface TradeFillIdentity {
    agent_id?: number | string | null;
    agent_user_id?: number | string | null;
    nice_name?: string | null;
    platform_user_id?: number | string | null;
    public_user_id?: number | string | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    username?: string | null;
}
export interface TradeFillPosition {
    id?: number | string | null;
    leverage?: number | string | null;
    margin_mode?: number | string | null;
    position_id?: number | string | null;
    user_type?: number | string | null;
}
export interface TradeFillRow extends TableRow {
    agent_user_id?: number | string | null;
    fill_id: number | string;
    handling_fee?: number | string | null;
    order_id?: number | string | null;
    platform_user_id?: number | string | null;
    position?: TradeFillPosition | null;
    position_id?: number | string | null;
    position_side?: string | null;
    price?: number | string | null;
    product_category?: string | null;
    product_category_name?: string | null;
    public_user_id?: number | string | null;
    quantity?: number | string | null;
    realized_pnl?: number | string | null;
    role_type?: string | null;
    side?: string | null;
    symbol?: string | null;
    trade_id?: number | string | null;
    trade_time?: string | null;
    trade_value?: number | string | null;
    user?: TradeFillIdentity | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
}
export interface TradeFillListQuery {
    end_time: string;
    keyword: string;
    margin_mode: boolean | number | string;
    order_by: 'handling_fee' | 'order_id' | 'position_id' | 'price' | 'quantity' | 'realized_pnl' | 'role_type' | 'side' | 'symbol' | 'trade_time' | 'trade_value';
    order_dir: 'asc' | 'desc';
    page_no: number;
    page_size: number;
    role_type: boolean | number | string;
    side: boolean | number | string;
    start_time: string;
    symbol: string;
    user_type?: boolean | number | string;
}
export interface TradeFillListResult<Row extends TradeFillRow = TradeFillRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export interface TradeFillRequestContext {
    signal: AbortSignal;
}
export type TradeFillListRequest<Row extends TradeFillRow = TradeFillRow> = (query: TradeFillListQuery, context: TradeFillRequestContext) => Promise<TradeFillListResult<Row>>;
export type TradeFillTableColumns<Row extends TradeFillRow = TradeFillRow> = ProTableColumn<Row>[] | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
export interface TradeFillTableActionContext {
    reload: () => Promise<void>;
}
export type TradeFillTableActionHandler<Row extends TradeFillRow = TradeFillRow> = (row: Row, context: TradeFillTableActionContext) => Promise<void> | void;
export interface TradeFillTableActions<Row extends TradeFillRow = TradeFillRow> {
    detail?: TradeFillTableActionHandler<Row>;
}
export interface TradeFillTableProps<Row extends TradeFillRow = TradeFillRow> {
    actions?: TradeFillTableActions<Row>;
    ariaLabel?: string;
    columns?: TradeFillTableColumns<Row>;
    columnsConfigurable?: boolean;
    fillHeight?: boolean;
    filterDrawerSubtitle?: string;
    filterDrawerTitle?: string;
    includeRobotUserType?: boolean;
    initialKeyword?: string;
    initialPageSize?: number;
    pageSizes?: number[];
    request: TradeFillListRequest<Row>;
    showUserType?: boolean;
}
export interface TradeFillTableExpose {
    reload: () => Promise<void>;
}
