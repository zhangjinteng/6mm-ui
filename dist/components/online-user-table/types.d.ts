import { ProTableColumn } from '../pro-table';
import { IpLocationInfo } from '../ip-location';
import { SelectOption } from '../select';
import { TableRow } from '../table';
export interface OnlineUserRow extends TableRow {
    active_at?: string | null;
    agent_id?: number | string | null;
    agent_name_parse?: string | null;
    agent_user_id?: string | null;
    id?: number | string | null;
    last_active_at?: string | null;
    last_active_time?: string | null;
    last_activity_at?: string | null;
    last_login_at?: string | null;
    last_login_ip?: string | null;
    last_login_ip_info?: IpLocationInfo | null;
    login_at?: string | null;
    login_time?: string | null;
    nice_name?: string | null;
    online_duration?: number | string | null;
    online_duration_seconds?: number | string | null;
    online_seconds?: number | string | null;
    online_time?: number | string | null;
    updated_at?: string | null;
    user_id: number | string;
    user_type?: number | string | null;
    username?: string | null;
    vip_level?: number | string | null;
}
export interface OnlineUserListQuery {
    agent_id?: boolean | number | string;
    create_time_end: string;
    create_time_start: string;
    keyword: string;
    order_by: 'last_login_at' | 'vip_level';
    order_dir: 'asc' | 'desc';
    page_no: number;
    page_size: number;
    user_type: boolean | number | string;
    vip_level: boolean | number | string;
}
export interface OnlineUserListResult<Row extends OnlineUserRow = OnlineUserRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export interface OnlineUserRequestContext {
    signal: AbortSignal;
}
export type OnlineUserListRequest<Row extends OnlineUserRow = OnlineUserRow> = (query: OnlineUserListQuery, context: OnlineUserRequestContext) => Promise<OnlineUserListResult<Row>>;
export type OnlineUserTableColumns<Row extends OnlineUserRow = OnlineUserRow> = ProTableColumn<Row>[] | ((defaultColumns: ProTableColumn<Row>[]) => ProTableColumn<Row>[]);
export interface OnlineUserTableExpose {
    reload: () => Promise<void>;
}
export interface OnlineUserTableProps<Row extends OnlineUserRow = OnlineUserRow> {
    ariaLabel?: string;
    columns?: OnlineUserTableColumns<Row>;
    columnsConfigurable?: boolean;
    fillHeight?: boolean;
    filterDrawerSubtitle?: string;
    filterDrawerTitle?: string;
    includeRobotUserType?: boolean;
    initialPageSize?: number;
    pageSizes?: number[];
    recommendationOptions?: SelectOption[];
    request: OnlineUserListRequest<Row>;
}
