import { ProTableColumn } from '../pro-table';
import { SelectOption } from '../select';
import { TableRow } from '../table';
export type UserPredictionPlayType = 'all' | 'grid' | 'high_low' | 'up_down';
export interface UserPredictionRow extends TableRow {
    agent_id?: number | string | null;
    agent_name?: string | null;
    agent_user_id?: string | null;
    id: number | string;
    last_prediction_at?: string | null;
    lose_orders?: number | string | null;
    net_profit_30d?: number | string | null;
    nice_name?: string | null;
    orders_30d?: number | string | null;
    pending_amount?: number | string | null;
    pending_orders?: number | string | null;
    platform_user_id?: number | string | null;
    refund_orders?: number | string | null;
    return_30d?: number | string | null;
    stake_30d?: number | string | null;
    user_id?: number | string | null;
    username?: string | null;
    win_orders?: number | string | null;
}
export interface UserPredictionListQuery {
    agent_id?: boolean | number | string;
    end_time?: string;
    keyword: string;
    order_by: 'last_prediction_at' | 'lose_orders' | 'net_profit_30d' | 'orders_30d' | 'pending_amount' | 'pending_orders' | 'refund_orders' | 'return_30d' | 'stake_30d' | 'win_orders';
    order_dir: 'asc' | 'desc';
    page_no: number;
    page_size: number;
    play_type: UserPredictionPlayType;
    start_time?: string;
    username: string;
}
export interface UserPredictionListResult<Row extends UserPredictionRow = UserPredictionRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export type UserPredictionListRequest<Row extends UserPredictionRow = UserPredictionRow> = (query: UserPredictionListQuery, context: {
    signal: AbortSignal;
}) => Promise<UserPredictionListResult<Row>>;
export type UserPredictionTableColumns<Row extends UserPredictionRow = UserPredictionRow> = ProTableColumn<Row>[] | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
export interface UserPredictionTableProps<Row extends UserPredictionRow = UserPredictionRow> {
    agentOptions?: SelectOption[];
    ariaLabel?: string;
    columns?: UserPredictionTableColumns<Row>;
    columnsConfigurable?: boolean;
    fillHeight?: boolean;
    initialKeyword?: number | string;
    initialPageSize?: number;
    pageSizes?: number[];
    request: UserPredictionListRequest<Row>;
}
export interface UserPredictionTableExpose {
    reload: () => Promise<void>;
}
