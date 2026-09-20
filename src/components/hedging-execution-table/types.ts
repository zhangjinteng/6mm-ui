import type { SelectOption } from "../select";

export type HedgingExecutionReason =
  | "first_trigger"
  | "rebalance"
  | "exit_hedge"
  | "manual_close"
  | "position_flip_close"
  | "hedge_ratio_adjustment";

export type HedgingExecutionSide = "BUY" | "SELL";

export type HedgingExecutionStatus =
  | "planned"
  | "skipped"
  | "submitted"
  | "filled"
  | "failed"
  | "dry_run";

export interface HedgingExecutionOption<T extends string | number = string> {
  agent_id?: number;
  label: string;
  value: T;
}

export interface HedgingExecutionRow {
  account_name: string;
  agent_id?: number;
  agent_name?: string | null;
  exchange: string;
  exchange_account_id: number;
  error_message: string;
  failure_code?: string;
  failure_reason?: string;
  executed_at: string | null;
  filled_notional_usdt: string;
  id: number;
  notional_usdt: string;
  quantity: string;
  reason: HedgingExecutionReason;
  reason_label: string;
  side: HedgingExecutionSide;
  side_label: string;
  status: HedgingExecutionStatus;
  status_label: string;
  symbol: string;
  target_symbol: string;
  task_no: string;
}

export interface HedgingCircuitBreaker {
  account_name: string | null;
  config_id: string;
  consecutive_failures: number;
  exchange: string | null;
  exchange_account_id: string;
  failure_code: string;
  failure_reason: string;
  failure_reason_label: string;
  failure_threshold: number;
  last_error: string;
  last_execution_id: string | null;
  last_failure_at: string | null;
  opened_at: string | null;
  status: "open";
  symbol: string;
}

export interface HedgingExecutionResult {
  circuit_breakers?: HedgingCircuitBreaker[];
  count: number;
  lists: HedgingExecutionRow[];
  options: {
    accounts: HedgingExecutionOption<number>[];
    directions: HedgingExecutionOption<HedgingExecutionSide>[];
    reasons: HedgingExecutionOption<HedgingExecutionReason>[];
    statuses: HedgingExecutionOption<HedgingExecutionStatus>[];
    symbols: HedgingExecutionOption[];
  };
}

export interface HedgingExecutionQuery {
  account_id?: number | string;
  agent_id?: number | string;
  keyword?: string;
  page: number;
  page_size: number;
  reason?: HedgingExecutionReason;
  side?: HedgingExecutionSide;
  status?: HedgingExecutionStatus;
  symbol?: string;
}

export type HedgingExecutionRequest = (
  query: HedgingExecutionQuery,
) => Promise<HedgingExecutionResult>;

export interface HedgingExecutionTableProps {
  agentOptions?: SelectOption[];
  formatDateTime?: (value: string) => string;
  initialPageSize?: number;
  pageSizes?: number[];
  request: HedgingExecutionRequest;
  showAgent?: boolean;
}
