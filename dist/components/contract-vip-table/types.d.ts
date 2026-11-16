import { ProTableColumn } from '../pro-table';
export interface ContractVipRow extends Record<string, unknown> {
    id: number;
    user_id: string;
    username: string;
    nice_name: string | null;
    agent_id: number;
    vip_level: number;
    volume_30d: string | number;
    current_threshold: string | number;
    next_threshold: string | number | null;
    progress_percent: number | null;
    last_calculated_at: string | null;
    vip_level_updated_at: string | null;
    home_site_id?: number | string | null;
    source_type?: 'merchant' | 'white_label' | 'platform' | null;
    source_id?: number | string | null;
    source_name?: string | null;
}
export interface ContractVipQuery {
    page_no: number;
    page_size: number;
    keyword?: string;
    vip_level?: number | string;
    uid?: string;
    username?: string;
    sort_field?: 'volume_30d' | 'vip_level' | 'last_calculated_at';
    sort_order?: 'asc' | 'desc';
}
export type ContractVipRequest = (query: ContractVipQuery, context: {
    signal: AbortSignal;
}) => Promise<{
    rows: ContractVipRow[];
    total: number;
    updatedAt?: Date;
}>;
export interface ContractVipTableProps {
    request: ContractVipRequest;
    sourceColumns?: ProTableColumn<ContractVipRow>[];
}
