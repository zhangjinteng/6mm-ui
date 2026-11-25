import { AccountChangeLogListQuery, AccountChangeLogListResult, AccountChangeLogRequestContext } from '../account-change-log-table';
import { ManualAdjustmentRow } from './types';
interface ManualAdjustmentApiResult {
    lists?: ManualAdjustmentRow[];
    has_more?: boolean;
    has_previous?: boolean;
    next_cursor?: string | null;
    previous_cursor?: string | null;
}
export declare function createManualAdjustmentRequest(get: (params: Record<string, unknown>, signal: AbortSignal) => Promise<ManualAdjustmentApiResult>): (query: AccountChangeLogListQuery & {
    source_type?: string;
    agent_id?: string | number;
    tenant_id?: string | number;
}, context: AccountChangeLogRequestContext) => Promise<AccountChangeLogListResult<ManualAdjustmentRow>>;
export {};
