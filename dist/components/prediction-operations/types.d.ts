import { Component } from 'vue';
import { LocationInput, OrderLocation } from './order-location';
type ContractSourceType = 'merchant' | 'white_label' | 'platform';
export interface Page<T> {
    items: T[];
    page_number: number;
    page_size: number;
    total_count: string;
    total_pages: string;
    query_contract_version?: number;
}
export interface Agent {
    id: string;
    agent_name: string | null;
    user_name: string | null;
    status: string | null;
}
export interface OrderRow extends Record<string, unknown> {
    order_id: string;
    order_no?: string;
    debit_ledger_id?: string;
    settlement_ledger_id?: string;
    agent_id: string;
    user_id: string;
    home_site_id: string;
    order_source: string;
    game_type: string;
    symbol: string;
    market_id: string;
    round_id: string;
    round_no?: string;
    duration_seconds: string;
    direction: string;
    stake: string;
    estimated_net_profit: string;
    estimated_return: string;
    final_net_profit?: string;
    final_return?: string;
    business_status: string;
    fund_status: string;
    result: string;
    created_at_ms: string;
    settled_at_ms?: string;
    order_version: string;
    public_user_id?: string;
    user_name?: string | null;
    nick_name?: string | null;
    source_type?: ContractSourceType | null;
    source_id?: string | null;
    source_name?: string | null;
    funds_completed_at_ms?: string;
}
export interface RoundRow extends Record<string, unknown> {
    round_id: string;
    round_no?: string;
    agent_id: string;
    market_id: string;
    symbol: string;
    duration_seconds: string;
    status: string;
    result: string;
    player_stake: string;
    market_maker_stake: string;
    player_order_count: string;
    market_maker_order_count: string;
    total_stake: string;
    participant_count: string;
    up_pool: string;
    down_pool: string;
    bet_open_at_ms: string;
    bet_close_at_ms: string;
    draw_at_ms?: string;
}
export interface OrderDetail {
    summary: OrderRow;
    up_down?: Record<string, unknown>;
    high_low?: Record<string, unknown>;
}
export type OrderView = 'current' | 'history';
export interface GridOrder extends Record<string, unknown> {
    order_id: string;
    order_no: string | null;
    user_id: string;
    source_type?: ContractSourceType | null;
    source_id?: string | null;
    source_name?: string | null;
    symbol: string;
    status: number;
    settlement_mark_price: string | null;
    settlement_price_time_ms: string | null;
    funding_read_available?: boolean;
    debit_ledger_id: string | null;
    settlement_funding_type: 'PAYOUT' | 'REFUND' | null;
    settlement_ledger_id: string | null;
}
export interface GridPage {
    lists: GridOrder[];
    page_no: number;
    page_size: number;
    count: number;
    extend: {
        query_snapshot_at_ms: string;
    };
}
export interface PredictionPageContext {
    actorId: string;
    permissions: readonly string[];
    identityKey: string;
    route: {
        fullPath: string;
        query: Record<string, unknown>;
    };
}
export interface PredictionPageAdapter {
    rounds(query: Record<string, string | number>, signal?: AbortSignal): Promise<Page<RoundRow>>;
    orders(view: OrderView, query: Record<string, string | number>, signal?: AbortSignal): Promise<Page<OrderRow>>;
    locate(input: LocationInput, view: OrderView, signal?: AbortSignal): Promise<OrderLocation>;
    navigate(target: {
        path: string;
        query: Record<string, string>;
    }): unknown;
    symbols?(signal?: AbortSignal): Promise<string[]>;
    symbolComponent?: Component;
}
export interface PredictionGridAdapter {
    orders(query: string, signal?: AbortSignal): Promise<unknown>;
    locate(id: string, signal?: AbortSignal): Promise<OrderLocation>;
    navigate(target: {
        path: string;
        query: Record<string, string>;
    }): unknown;
    symbols?(signal?: AbortSignal): Promise<string[]>;
    symbolComponent?: Component;
}
export {};
