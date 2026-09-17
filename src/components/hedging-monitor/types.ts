export type HedgingMonitorStatus =
  | "unconfigured"
  | "global_off"
  | "symbol_off"
  | "account_unavailable"
  | "observing"
  | "data_stale"
  | "open_required"
  | "rebalance_required"
  | "exit_required"
  | "balanced"
  | "execution_failed";

export interface HedgingMonitorRow {
  agent_id?: number;
  agent_name?: string | null;
  account_name: string;
  action_status: string;
  actual_hedge_usdt: string;
  actual_hedge_quantity: string;
  calculated_at: string;
  config_id: number;
  exchange: string;
  exchange_account_id: number;
  exposure_observed_at: string | null;
  health_status: string;
  id: number;
  long_quantity: string;
  net_notional_usdt: string;
  net_quantity: string;
  position_observed_at: string | null;
  source: string;
  status: HedgingMonitorStatus;
  status_label: string;
  status_reason: string;
  short_quantity: string;
  switch_status: string;
  symbol: string;
  target_hedge_quantity: string;
  target_hedge_usdt: string;
  target_symbol: string;
  updated_at: string;
}

export interface HedgingMonitorSummary {
  actual_hedge_usdt: string;
  calculated_at: string | null;
  items: number;
  net_exposure_usdt: string;
  target_hedge_usdt: string;
}

export interface HedgingMonitorStatusOption {
  label: string;
  value: HedgingMonitorStatus;
}

export interface HedgingMonitorResult {
  count: number;
  lists: HedgingMonitorRow[];
  options: { statuses: HedgingMonitorStatusOption[] };
  summary: HedgingMonitorSummary;
}

export interface HedgingMonitorQuery {
  agent_id?: number | string;
  global_enabled?: "0" | "1";
  keyword?: string;
  page: number;
  page_size: number;
  status?: HedgingMonitorStatus;
  symbol_enabled?: "0" | "1";
}

export type HedgingMonitorRequest = (
  query: HedgingMonitorQuery,
) => Promise<HedgingMonitorResult>;
