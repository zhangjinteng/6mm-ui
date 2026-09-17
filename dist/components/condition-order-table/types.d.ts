import { ProTableColumn } from '../pro-table';
import { QueryBarField, QueryBarValue } from '../query-bar';
import { TableRow } from '../table';
export type ConditionOrderKind = 'condition' | 'tp_sl';
export type ConditionOrderLifecycle = 'current' | 'history';
export type ConditionOrderQuantityDisplay = 'account-change' | 'default';
export interface ConditionOrderIdentity {
    agent_user_id?: number | string | null;
    nick_name?: string | null;
    platform_user_id?: number | string | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    username?: string | null;
}
export interface ConditionOrderRow extends TableRow {
    activate_price?: number | string | null;
    agent_user_id?: number | string | null;
    callback_rate?: number | string | null;
    client_order_id?: number | string | null;
    close_position?: boolean | number | string | null;
    condition_id: number | string;
    created_at?: string | null;
    filled_quantity?: number | string | null;
    generated_order_id?: number | string | null;
    leverage?: number | string | null;
    margin_mode?: number | string | null;
    order_id?: number | string | null;
    order_type?: string | null;
    order_type_parse?: string | null;
    platform_user_id?: number | string | null;
    price?: number | string | null;
    product_category?: string | null;
    product_category_name?: string | null;
    quantity?: number | string | null;
    reduce_only?: boolean | number | string | null;
    side?: string | null;
    side_parse?: string | null;
    strategy_sub_id?: number | string | null;
    symbol?: string | null;
    trigger_price?: number | string | null;
    trigger_status?: number | string | null;
    trigger_status_parse?: string | null;
    trigger_type?: string | null;
    trigger_type_parse?: string | null;
    updated_at?: string | null;
    user?: ConditionOrderIdentity | null;
    user_id?: number | string | null;
    user_type?: number | string | null;
    user_type_parse?: string | null;
    working_type?: string | null;
}
export interface ConditionOrderListQuery {
    end: string;
    keyword: string;
    kind: ConditionOrderKind;
    lifecycle: ConditionOrderLifecycle;
    order_type: boolean | number | string;
    page_no: number;
    page_size: number;
    reduce_only: boolean | number | string;
    side: boolean | number | string;
    start: string;
    sym: string;
    user_type?: boolean | number | string;
}
export interface ConditionOrderListResult<Row extends ConditionOrderRow = ConditionOrderRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export interface ConditionOrderRequestContext {
    filters: QueryBarValue;
    signal: AbortSignal;
}
export type ConditionOrderListRequest<Row extends ConditionOrderRow = ConditionOrderRow> = (query: ConditionOrderListQuery, context: ConditionOrderRequestContext) => Promise<ConditionOrderListResult<Row>>;
export type ConditionOrderTableColumns<Row extends ConditionOrderRow = ConditionOrderRow> = ProTableColumn<Row>[] | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
export type ConditionOrderTableQueryFields = QueryBarField[] | ((defaultFields: QueryBarField[]) => QueryBarField[]);
export interface ConditionOrderTableActionContext {
    reload: () => Promise<void>;
}
export type ConditionOrderTableActionHandler<Row extends ConditionOrderRow = ConditionOrderRow> = (row: Row, context: ConditionOrderTableActionContext) => Promise<void> | void;
export interface ConditionOrderTableActions<Row extends ConditionOrderRow = ConditionOrderRow> {
    cancel?: ConditionOrderTableActionHandler<Row>;
    detail?: ConditionOrderTableActionHandler<Row>;
}
export interface ConditionOrderTablePresetProps<Row extends ConditionOrderRow = ConditionOrderRow> {
    actions?: ConditionOrderTableActions<Row>;
    ariaLabel?: string;
    columns?: ConditionOrderTableColumns<Row>;
    columnsConfigurable?: boolean;
    fillHeight?: boolean;
    filterDrawerSubtitle?: string;
    filterDrawerTitle?: string;
    initialPageSize?: number;
    lifecycle: ConditionOrderLifecycle;
    pageSizes?: number[];
    quantityDisplay?: ConditionOrderQuantityDisplay;
    queryFields?: ConditionOrderTableQueryFields;
    request: ConditionOrderListRequest<Row>;
    showUserType?: boolean;
}
export interface ConditionOrderTableCoreProps<Row extends ConditionOrderRow = ConditionOrderRow> extends ConditionOrderTablePresetProps<Row> {
    kind: ConditionOrderKind;
}
export interface ConditionOrderTableExpose {
    reload: () => Promise<void>;
}
