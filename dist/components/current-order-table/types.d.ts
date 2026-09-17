import { ProTableColumn } from '../pro-table';
import { QueryBarField, QueryBarValue } from '../query-bar';
import { TableRow } from '../table';
export interface CurrentOrderIdentity {
    agent_id?: number | string | null;
    agent_user_id?: number | string | null;
    nice_name?: string | null;
    platform_user_id?: number | string | null;
    public_user_id?: number | string | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    username?: string | null;
}
export interface CurrentOrderRow extends TableRow {
    agent_id?: number | string | null;
    agent_user_id?: number | string | null;
    client_order_id?: number | string | null;
    created_at?: string | null;
    filled_quantity?: number | string | null;
    leverage?: number | string | null;
    maker_only?: boolean | number | string | null;
    margin_mode?: number | string | null;
    order_id: number | string;
    order_status?: number | string | null;
    order_status_parse?: string | null;
    order_type?: string | null;
    platform_user_id?: number | string | null;
    price?: number | string | null;
    product_category?: string | null;
    product_category_name?: string | null;
    quantity?: number | string | null;
    reduce_only?: boolean | number | string | null;
    remaining?: number | string | null;
    remaining_quantity?: number | string | null;
    side?: string | null;
    symbol?: string | null;
    updated_at?: string | null;
    user?: CurrentOrderIdentity | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    username?: string | null;
}
export interface CurrentOrderListQuery {
    cursor?: string;
    end_time: string;
    keyword: string;
    leverage: boolean | number | string;
    maker_only: boolean | number | string;
    margin_mode: boolean | number | string;
    order_status: Array<number | string>;
    order_type: boolean | number | string;
    page_size: number;
    reduce_only: boolean | number | string;
    side: boolean | number | string;
    start_time: string;
    symbol: string;
    user_type?: boolean | number | string;
}
export interface CurrentOrderListResult<Row extends CurrentOrderRow = CurrentOrderRow> {
    hasMore?: boolean;
    nextCursor?: string | null;
    rows: Row[];
    updatedAt?: Date | string;
}
export interface CurrentOrderRequestContext {
    filters: QueryBarValue;
    signal: AbortSignal;
}
export type CurrentOrderListRequest<Row extends CurrentOrderRow = CurrentOrderRow> = (query: CurrentOrderListQuery, context: CurrentOrderRequestContext) => Promise<CurrentOrderListResult<Row>>;
export type CurrentOrderTableColumns<Row extends CurrentOrderRow = CurrentOrderRow> = ProTableColumn<Row>[] | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
export type CurrentOrderTableQueryFields = QueryBarField[] | ((defaultFields: QueryBarField[]) => QueryBarField[]);
export interface CurrentOrderTableActionContext {
    reload: () => Promise<void>;
}
export type CurrentOrderTableActionHandler<Row extends CurrentOrderRow = CurrentOrderRow> = (row: Row, context: CurrentOrderTableActionContext) => Promise<void> | void;
export interface CurrentOrderTableActions<Row extends CurrentOrderRow = CurrentOrderRow> {
    cancel?: CurrentOrderTableActionHandler<Row>;
    detail?: CurrentOrderTableActionHandler<Row>;
}
export interface CurrentOrderTableProps<Row extends CurrentOrderRow = CurrentOrderRow> {
    actions?: CurrentOrderTableActions<Row>;
    ariaLabel?: string;
    columns?: CurrentOrderTableColumns<Row>;
    columnsConfigurable?: boolean;
    fillHeight?: boolean;
    filterDrawerSubtitle?: string;
    filterDrawerTitle?: string;
    includeRobotUserType?: boolean;
    initialKeyword?: string;
    initialPageSize?: number;
    pageSizes?: number[];
    queryFields?: CurrentOrderTableQueryFields;
    request: CurrentOrderListRequest<Row>;
    showUserType?: boolean;
}
export interface CurrentOrderTableExpose {
    reload: () => Promise<void>;
}
