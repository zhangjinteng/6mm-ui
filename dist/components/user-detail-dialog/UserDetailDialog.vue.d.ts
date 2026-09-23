import { UserDetailData, UserDetailDialogProps, UserDetailMetricKey } from './types';
declare function load(): Promise<void>;
declare var __VLS_10: {
    detail: {
        active_at?: string | null | undefined;
        agent_user_id?: number | string | null | undefined;
        contract?: {
            fee_30d?: number | string | null | undefined;
            last_trade_at?: string | null | undefined;
            order_count?: number | string | null | undefined;
            pnl_30d?: number | string | null | undefined;
            position_amount?: number | string | null | undefined;
            position_count?: number | string | null | undefined;
            positions?: (Array<Record<string, unknown>> | null) | undefined;
            unrealized_pnl?: number | string | null | undefined;
            wallet_balance?: number | string | null | undefined;
        } | null | undefined;
        created_at?: string | null | undefined;
        last_active_at?: string | null | undefined;
        last_active_time?: string | null | undefined;
        last_activity_at?: string | null | undefined;
        last_login_at?: string | null | undefined;
        last_login_ip?: string | null | undefined;
        last_login_ip_info?: {
            address?: string | null | undefined;
            city?: string | null | undefined;
            city_names?: {
                en?: string | null | undefined;
                zh?: string | null | undefined;
            } | null | undefined;
            country?: string | null | undefined;
            country_code?: string | null | undefined;
            country_name?: string | null | undefined;
            country_names?: {
                en?: string | null | undefined;
                zh?: string | null | undefined;
            } | null | undefined;
            ip?: string | null | undefined;
            kind?: (import('..').IpLocationKind | null) | undefined;
            region?: string | null | undefined;
            region_names?: {
                en?: string | null | undefined;
                zh?: string | null | undefined;
            } | null | undefined;
            timezone?: string | null | undefined;
        } | null | undefined;
        login_at?: string | null | undefined;
        login_time?: string | null | undefined;
        nice_name?: string | null | undefined;
        online_status?: boolean | number | string | null | undefined;
        prediction?: {
            last_prediction_at?: string | null | undefined;
            lose_orders?: number | string | null | undefined;
            net_profit_30d?: number | string | null | undefined;
            orders_30d?: number | string | null | undefined;
            pending_amount?: number | string | null | undefined;
            pending_orders?: number | string | null | undefined;
            refund_orders?: number | string | null | undefined;
            return_30d?: number | string | null | undefined;
            stake_30d?: number | string | null | undefined;
            win_orders?: number | string | null | undefined;
        } | null | undefined;
        updated_at?: string | null | undefined;
        user_id: number | string;
        user_type?: number | string | null | undefined;
        username?: string | null | undefined;
        vip_level?: number | string | null | undefined;
    } | null;
    loading: boolean;
    reload: typeof load;
}, __VLS_48: {
    value: string | number | null | undefined;
    detail: {
        active_at?: string | null | undefined;
        agent_user_id?: number | string | null | undefined;
        contract?: {
            fee_30d?: number | string | null | undefined;
            last_trade_at?: string | null | undefined;
            order_count?: number | string | null | undefined;
            pnl_30d?: number | string | null | undefined;
            position_amount?: number | string | null | undefined;
            position_count?: number | string | null | undefined;
            positions?: (Array<Record<string, unknown>> | null) | undefined;
            unrealized_pnl?: number | string | null | undefined;
            wallet_balance?: number | string | null | undefined;
        } | null | undefined;
        created_at?: string | null | undefined;
        last_active_at?: string | null | undefined;
        last_active_time?: string | null | undefined;
        last_activity_at?: string | null | undefined;
        last_login_at?: string | null | undefined;
        last_login_ip?: string | null | undefined;
        last_login_ip_info?: {
            address?: string | null | undefined;
            city?: string | null | undefined;
            city_names?: {
                en?: string | null | undefined;
                zh?: string | null | undefined;
            } | null | undefined;
            country?: string | null | undefined;
            country_code?: string | null | undefined;
            country_name?: string | null | undefined;
            country_names?: {
                en?: string | null | undefined;
                zh?: string | null | undefined;
            } | null | undefined;
            ip?: string | null | undefined;
            kind?: (import('..').IpLocationKind | null) | undefined;
            region?: string | null | undefined;
            region_names?: {
                en?: string | null | undefined;
                zh?: string | null | undefined;
            } | null | undefined;
            timezone?: string | null | undefined;
        } | null | undefined;
        login_at?: string | null | undefined;
        login_time?: string | null | undefined;
        nice_name?: string | null | undefined;
        online_status?: boolean | number | string | null | undefined;
        prediction?: {
            last_prediction_at?: string | null | undefined;
            lose_orders?: number | string | null | undefined;
            net_profit_30d?: number | string | null | undefined;
            orders_30d?: number | string | null | undefined;
            pending_amount?: number | string | null | undefined;
            pending_orders?: number | string | null | undefined;
            refund_orders?: number | string | null | undefined;
            return_30d?: number | string | null | undefined;
            stake_30d?: number | string | null | undefined;
            win_orders?: number | string | null | undefined;
        } | null | undefined;
        updated_at?: string | null | undefined;
        user_id: number | string;
        user_type?: number | string | null | undefined;
        username?: string | null | undefined;
        vip_level?: number | string | null | undefined;
    };
}, __VLS_75: {
    detail: {
        active_at?: string | null | undefined;
        agent_user_id?: number | string | null | undefined;
        contract?: {
            fee_30d?: number | string | null | undefined;
            last_trade_at?: string | null | undefined;
            order_count?: number | string | null | undefined;
            pnl_30d?: number | string | null | undefined;
            position_amount?: number | string | null | undefined;
            position_count?: number | string | null | undefined;
            positions?: (Array<Record<string, unknown>> | null) | undefined;
            unrealized_pnl?: number | string | null | undefined;
            wallet_balance?: number | string | null | undefined;
        } | null | undefined;
        created_at?: string | null | undefined;
        last_active_at?: string | null | undefined;
        last_active_time?: string | null | undefined;
        last_activity_at?: string | null | undefined;
        last_login_at?: string | null | undefined;
        last_login_ip?: string | null | undefined;
        last_login_ip_info?: {
            address?: string | null | undefined;
            city?: string | null | undefined;
            city_names?: {
                en?: string | null | undefined;
                zh?: string | null | undefined;
            } | null | undefined;
            country?: string | null | undefined;
            country_code?: string | null | undefined;
            country_name?: string | null | undefined;
            country_names?: {
                en?: string | null | undefined;
                zh?: string | null | undefined;
            } | null | undefined;
            ip?: string | null | undefined;
            kind?: (import('..').IpLocationKind | null) | undefined;
            region?: string | null | undefined;
            region_names?: {
                en?: string | null | undefined;
                zh?: string | null | undefined;
            } | null | undefined;
            timezone?: string | null | undefined;
        } | null | undefined;
        login_at?: string | null | undefined;
        login_time?: string | null | undefined;
        nice_name?: string | null | undefined;
        online_status?: boolean | number | string | null | undefined;
        prediction?: {
            last_prediction_at?: string | null | undefined;
            lose_orders?: number | string | null | undefined;
            net_profit_30d?: number | string | null | undefined;
            orders_30d?: number | string | null | undefined;
            pending_amount?: number | string | null | undefined;
            pending_orders?: number | string | null | undefined;
            refund_orders?: number | string | null | undefined;
            return_30d?: number | string | null | undefined;
            stake_30d?: number | string | null | undefined;
            win_orders?: number | string | null | undefined;
        } | null | undefined;
        updated_at?: string | null | undefined;
        user_id: number | string;
        user_type?: number | string | null | undefined;
        username?: string | null | undefined;
        vip_level?: number | string | null | undefined;
    };
    ip: string | null | undefined;
    info: {
        address?: string | null | undefined;
        city?: string | null | undefined;
        city_names?: {
            en?: string | null | undefined;
            zh?: string | null | undefined;
        } | null | undefined;
        country?: string | null | undefined;
        country_code?: string | null | undefined;
        country_name?: string | null | undefined;
        country_names?: {
            en?: string | null | undefined;
            zh?: string | null | undefined;
        } | null | undefined;
        ip?: string | null | undefined;
        kind?: (import('..').IpLocationKind | null) | undefined;
        region?: string | null | undefined;
        region_names?: {
            en?: string | null | undefined;
            zh?: string | null | undefined;
        } | null | undefined;
        timezone?: string | null | undefined;
    } | null | undefined;
};
type __VLS_Slots = {} & {
    'header-actions'?: (props: typeof __VLS_10) => any;
} & {
    'user-type'?: (props: typeof __VLS_48) => any;
} & {
    'login-location'?: (props: typeof __VLS_75) => any;
};
declare const __VLS_base: import('vue').DefineComponent<UserDetailDialogProps, {
    reload: typeof load;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
    loaded: (detail: UserDetailData) => any;
    "metric-click": (key: UserDetailMetricKey, detail: UserDetailData) => any;
}, string, import('vue').PublicProps, Readonly<UserDetailDialogProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onLoaded?: ((detail: UserDetailData) => any) | undefined;
    "onMetric-click"?: ((key: UserDetailMetricKey, detail: UserDetailData) => any) | undefined;
}>, {
    width: number | string;
    closeOnClickModal: boolean;
    currentListLabel: string;
    requestKey: number | string;
    showMetricLinks: boolean;
    userId: number | string | null;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
