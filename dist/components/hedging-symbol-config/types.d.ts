import { SelectOption } from '../select';
export type HedgingUnit = "base" | "usdt";
export interface HedgingSymbolConfigRow {
    account_id: number;
    account_name: string | null;
    agent_id?: number;
    agent_name?: string | null;
    config_id: number;
    configured: true;
    enabled: boolean;
    exchange: string | null;
    exit_quantity: number;
    exit_usdt: number;
    first_trigger_quantity: number;
    first_trigger_usdt: number;
    hedge_unit: HedgingUnit;
    lifecycle_status: "active" | "closing" | "close_failed" | "disabled";
    max_slippage_percent: number;
    rebalance_quantity: number;
    rebalance_usdt: number;
    symbol: string;
    target_hedge_ratio: number;
    target_symbol?: string;
    updated_at?: string;
}
export interface HedgingSymbolAccountOption {
    exchange: string;
    id: number;
    is_primary: boolean;
    name: string;
    sandbox: boolean;
}
export interface HedgingSymbolConfigResult {
    count: number;
    lists: HedgingSymbolConfigRow[];
    options: {
        accounts: HedgingSymbolAccountOption[];
        exchanges: string[];
    };
}
export interface HedgingSymbolConfigQuery {
    account_id?: number | string;
    agent_id?: number | string;
    enabled?: "0" | "1";
    exchange?: string;
    hedge_unit?: HedgingUnit;
    keyword?: string;
    page: number;
    page_size: number;
}
export type HedgingSymbolConfigRequest = (query: HedgingSymbolConfigQuery) => Promise<HedgingSymbolConfigResult>;
export interface HedgingSymbolConfigLabels {
    account: string;
    agent: string;
    allAccounts: string;
    allAgents: string;
    allExchanges: string;
    allStatuses: string;
    allUnits: string;
    enabled: string;
    exchange: string;
    exit: string;
    firstTrigger: string;
    hedgeUnit: string;
    loading: string;
    noData: string;
    query: string;
    rebalance: string;
    reset: string;
    search: string;
    slippage: string;
    status: string;
    symbol: string;
    targetRatio: string;
    disabled: string;
    unitBase: string;
    unitUsdt: string;
}
export interface HedgingSymbolConfigProps {
    agentOptions?: SelectOption[];
    initialAgentId?: number | string;
    labels?: Partial<HedgingSymbolConfigLabels>;
    request: HedgingSymbolConfigRequest;
    showAgent?: boolean;
}
