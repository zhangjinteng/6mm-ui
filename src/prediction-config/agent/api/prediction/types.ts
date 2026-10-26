export type Game = 'UP_DOWN' | 'HIGH_LOW'
export type OrderView = 'CURRENT' | 'HISTORY'
export interface DecimalField {
    value: string; template_value: string; default_value: string
    minimum_value: string; maximum_value: string; agent_editable: boolean; overridden: boolean
}
export interface StakeTier {
    stake_tier_id: string; enabled: boolean; enabled_by_default: boolean
    display_order: number; retired: boolean; minimum_stake?: DecimalField; maximum_stake?: DecimalField
}
export interface ConfigRule {
    game_type: string; symbol: string; duration_seconds: string; enabled: boolean
    enabled_by_default: boolean; market_id: string; validation_status: string
    forced_adjustments: Array<{field:string;before_value:string;after_value:string;reason:string;adjusted_at_ms:string}>
    stake_tiers: StakeTier[]
    bet_open_seconds?: DecimalField; minimum_stake?: DecimalField; maximum_stake?: DecimalField
    settlement_display_seconds: string
    [key:string]: unknown
}
export interface GameplayConfig {
    scope: string; agent_id: string; template_version: string; agent_version: string
    effective_version: string; updated_at_ms: string; rules: ConfigRule[]
}
export interface SaveBody {
    client_request_id: string; reason: string; based_on_template_version: string
    based_on_agent_version: string; game_type: 'UP_DOWN'; symbol: string
    agent_override: {enabled:boolean;overrides:Array<{duration_seconds:string;enabled:boolean;stake_tiers:Array<{stake_tier_id:string;enabled:boolean;maximum_stake:string}>}>}
}
export interface OperationReceipt {
    operation_id:string; operator_id:string; client_request_id:string; capability:string
    action:string; target_type:string; target_id:string; reason:string
    before_json:string; after_json:string; result:string; error_code:string
    created_at_ms:string; completed_at_ms:string; source_service:string; trace_id:string
}
export interface SaveResult {
    configuration: GameplayConfig; receipt: OperationReceipt; reconciliation_job?: Record<string,unknown>
}
export interface AdminPage<T> {items:T[];page_number:number;page_size:number;total_count:string;total_pages:string;query_contract_version?:number}
export interface AdminOrder extends Record<string, unknown> {
    public_user_id?:string;user_name?:string;funds_completed_at_ms?:string
    order_no?:string;debit_ledger_id?:string;settlement_ledger_id?:string
    order_id:string;agent_id:string;user_id:string;home_site_id:string;order_source:string
    game_type:string;symbol:string;market_id:string;direction:string;settlement_asset:string
    stake:string;estimated_net_profit:string;estimated_return:string;final_net_profit?:string;final_return?:string
    business_status:string;fund_status:string;unknown_from:string;result:string;config_version:string
    created_at_ms:string;accepted_at_ms?:string;expire_at_ms?:string;result_at_ms?:string;settled_at_ms?:string
    round_id:string;round_no?:string;duration_seconds:string;open_price?:string;result_price?:string
    funds_transaction_id:string;agent_profit:string;client_request_id:string;order_version:string
}
export interface AdminRound extends Record<string, unknown> {
    agent_id:string;round_id:string;round_no?:string;generation_id:string;market_id:string;symbol:string
    duration_seconds:string;room_code:string;status:string;result:string;cancel_reason:string;config_version:string
    settlement_asset:string;pool_share:string;up_pool:string;down_pool:string;locked_up_pool:string;locked_down_pool:string
    up_odds?:{numerator:string;denominator:string};down_odds?:{numerator:string;denominator:string}
    start_price?:string;end_price?:string;bet_open_at_ms:string;bet_close_at_ms:string
    draw_at_ms?:string;observe_end_at_ms:string;display_end_at_ms:string;result_at_ms?:string;settled_at_ms?:string
    participant_count:string;order_count:string;total_stake:string;total_return:string;platform_revenue:string
    truncation_tail:string;agent_profit:string;player_stake:string;market_maker_stake:string
    player_order_count:string;market_maker_order_count:string
}
export interface OrderDetailResult {
    summary:AdminOrder;up_down?:Record<string,unknown>;high_low?:Record<string,unknown>
}
/** 资金业务号深链解析结果：玩法段落 + 页面定位用的订单号（一律按字符串处理） */
