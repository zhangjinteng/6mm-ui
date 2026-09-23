import { App } from 'vue';
export declare const MmUserDetailDialog: {
    new (...args: any[]): import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./types').UserDetailDialogProps> & Readonly<{
        "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
        onLoaded?: ((detail: import('./types').UserDetailData) => any) | undefined;
        "onMetric-click"?: ((key: import('./types').UserDetailMetricKey, detail: import('./types').UserDetailData) => any) | undefined;
    }>, {
        reload: () => Promise<void>;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        "update:modelValue": (value: boolean) => any;
        loaded: (detail: import('./types').UserDetailData) => any;
        "metric-click": (key: import('./types').UserDetailMetricKey, detail: import('./types').UserDetailData) => any;
    }, import('vue').PublicProps, {
        width: number | string;
        closeOnClickModal: boolean;
        currentListLabel: string;
        requestKey: number | string;
        showMetricLinks: boolean;
        userId: number | string | null;
    }, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import('./types').UserDetailDialogProps> & Readonly<{
        "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
        onLoaded?: ((detail: import('./types').UserDetailData) => any) | undefined;
        "onMetric-click"?: ((key: import('./types').UserDetailMetricKey, detail: import('./types').UserDetailData) => any) | undefined;
    }>, {
        reload: () => Promise<void>;
    }, {}, {}, {}, {
        width: number | string;
        closeOnClickModal: boolean;
        currentListLabel: string;
        requestKey: number | string;
        showMetricLinks: boolean;
        userId: number | string | null;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import('vue').ComponentOptionsBase<Readonly<import('./types').UserDetailDialogProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onLoaded?: ((detail: import('./types').UserDetailData) => any) | undefined;
    "onMetric-click"?: ((key: import('./types').UserDetailMetricKey, detail: import('./types').UserDetailData) => any) | undefined;
}>, {
    reload: () => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
    loaded: (detail: import('./types').UserDetailData) => any;
    "metric-click": (key: import('./types').UserDetailMetricKey, detail: import('./types').UserDetailData) => any;
}, string, {
    width: number | string;
    closeOnClickModal: boolean;
    currentListLabel: string;
    requestKey: number | string;
    showMetricLinks: boolean;
    userId: number | string | null;
}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & (new () => {
    $slots: {
        'header-actions'?: (props: {
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
            reload: () => Promise<void>;
        }) => any;
    } & {
        'user-type'?: (props: {
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
        }) => any;
    } & {
        'login-location'?: (props: {
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
        }) => any;
    };
}) & {
    install(app: App): void;
};
export default MmUserDetailDialog;
export * from './types';
