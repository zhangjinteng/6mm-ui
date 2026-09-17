import { SelectOption } from '../select';
export type HedgingSubjectStatus = "running" | "disabled" | "pending_config" | "account_abnormal";
export interface HedgingSubjectAccount {
    exchange: string;
    id: number;
    name: string;
}
export interface HedgingSubjectConfigRow {
    accounts: HedgingSubjectAccount[];
    agent_id: number;
    agent_name?: string | null;
    connected_account_count: number;
    enabled_symbol_count: number;
    exchanges: string[];
    global_enabled: boolean;
    status: HedgingSubjectStatus;
    status_label: string;
    updated_at?: string | null;
}
export interface HedgingSubjectConfigResult {
    count: number;
    lists: HedgingSubjectConfigRow[];
}
export interface HedgingSubjectConfigQuery {
    agent_id?: number | string;
    enabled?: "0" | "1";
    page: number;
    page_size: number;
    status?: HedgingSubjectStatus;
}
export type HedgingSubjectConfigRequest = (query: HedgingSubjectConfigQuery) => Promise<HedgingSubjectConfigResult>;
export interface HedgingSubjectConfigProps {
    agentOptions?: SelectOption[];
    formatDateTime?: (value: string) => string;
    request: HedgingSubjectConfigRequest;
}
