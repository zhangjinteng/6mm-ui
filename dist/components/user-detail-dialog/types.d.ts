import { IpLocationInfo } from '../ip-location';
export type UserDetailMetricKey = 'wallet_balance' | 'position_amount' | 'position_count' | 'order_count' | 'unrealized_pnl' | 'pnl_30d' | 'fee_30d' | 'last_trade_at' | 'prediction_pending_orders' | 'prediction_pending_amount' | 'prediction_orders_30d' | 'prediction_win_orders' | 'prediction_lose_orders' | 'prediction_refund_orders' | 'prediction_stake_30d' | 'prediction_return_30d' | 'prediction_net_profit_30d' | 'prediction_last_at';
export interface UserDetailContractSummary {
    fee_30d?: number | string | null;
    last_trade_at?: string | null;
    order_count?: number | string | null;
    pnl_30d?: number | string | null;
    position_amount?: number | string | null;
    position_count?: number | string | null;
    positions?: Array<Record<string, unknown>> | null;
    unrealized_pnl?: number | string | null;
    wallet_balance?: number | string | null;
}
export interface UserDetailPredictionSummary {
    last_prediction_at?: string | null;
    lose_orders?: number | string | null;
    net_profit_30d?: number | string | null;
    orders_30d?: number | string | null;
    pending_amount?: number | string | null;
    pending_orders?: number | string | null;
    refund_orders?: number | string | null;
    return_30d?: number | string | null;
    stake_30d?: number | string | null;
    win_orders?: number | string | null;
}
export interface UserDetailData {
    active_at?: string | null;
    agent_user_id?: number | string | null;
    contract?: UserDetailContractSummary | null;
    created_at?: string | null;
    last_active_at?: string | null;
    last_active_time?: string | null;
    last_activity_at?: string | null;
    last_login_at?: string | null;
    last_login_ip?: string | null;
    last_login_ip_info?: IpLocationInfo | null;
    login_at?: string | null;
    login_time?: string | null;
    nice_name?: string | null;
    online_status?: boolean | number | string | null;
    prediction?: UserDetailPredictionSummary | null;
    updated_at?: string | null;
    user_id: number | string;
    user_type?: number | string | null;
    username?: string | null;
    vip_level?: number | string | null;
}
export interface UserDetailRequestContext {
    signal: AbortSignal;
}
export interface UserDetailRequestResult {
    data: UserDetailData;
    updatedAt?: Date | string;
}
export type UserDetailRequest = (userId: number | string, context: UserDetailRequestContext) => Promise<UserDetailData | UserDetailRequestResult>;
export interface UserDetailDialogProps {
    closeOnClickModal?: boolean;
    currentListLabel?: string;
    modelValue: boolean;
    request: UserDetailRequest;
    requestKey?: number | string;
    showMetricLinks?: boolean;
    userId?: number | string | null;
    width?: number | string;
}
