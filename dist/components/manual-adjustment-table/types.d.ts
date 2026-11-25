import { AccountChangeLogRow } from '../account-change-log-table';
export interface ManualAdjustmentRow extends AccountChangeLogRow {
    source_name?: string | null;
    source_type?: 'merchant' | 'platform' | 'white_label' | null;
    agent_name_parse?: string | null;
    change_type_parse?: string | null;
    available_balance_after?: number | string | null;
    account_type: 'contract' | 'funding';
    record_key?: string;
    direction: 'inc' | 'dec' | '';
    order_no: string;
    ledger_id: string | null;
    flow_id: string | null;
    ledger_sync_status: 'pending' | 'linked' | 'failed';
    operator_id: string | null;
    operator_name: string | null;
    operator_account?: string | null;
    operator_display_name?: string | null;
    reason: string | null;
}
