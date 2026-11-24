import { AccountChangeLogListRequest } from '../account-change-log-table';
import { ConditionOrderListRequest } from '../condition-order-table';
import { CurrentOrderListRequest } from '../current-order-table';
import { HistoryPositionListRequest } from '../history-position-table';
import { PositionListRequest } from '../position-table';
import { TradeFillListRequest } from '../trade-fill-table';
type Amount = string | number;
export interface PortraitIdentity {
    user_id: number | string;
    public_user_id: number | string;
    username?: string | null;
    nick_name?: string | null;
    risk_status?: number | null;
    risk_label?: number | null;
    agent_name_parse?: string | null;
    vip_level?: number | null;
    online_status?: number | null;
    created_at?: string | null;
    last_login_at?: string | null;
    last_login_ip?: string | null;
}
export interface UserPortrait {
    detail: PortraitIdentity;
    account: {
        wallet_balance?: Amount;
        available_balance?: Amount;
    } | null;
    positions: {
        symbol: string;
        quantity: Amount;
        margin?: Amount;
        margin_price?: Amount;
        unrealized_pnl?: Amount;
    }[] | null;
    orders: {
        symbol: string;
        original_qty: Amount;
        filled_qty: Amount;
        order_price: Amount;
    }[] | null;
    volume_30d: Amount | null;
    realized_pnl: Amount | null;
}
export type PortraitTab = 'basic' | 'position' | 'order' | 'conditionOrder' | 'historyDeal' | 'historyPosition' | 'fundFlow';
export type PortraitTables = {
    position: PositionListRequest;
    order: CurrentOrderListRequest;
    conditionOrder: ConditionOrderListRequest;
    historyDeal: TradeFillListRequest;
    historyPosition: HistoryPositionListRequest;
    fundFlow: AccountChangeLogListRequest;
};
export {};
