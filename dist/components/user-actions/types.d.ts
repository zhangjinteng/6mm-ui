export interface FundingAdjustmentResult {
    status: 'submitting' | 'unknown' | 'accepted' | 'executed' | 'pending_review' | 'rejected' | 'execution_rejected';
    message: string;
    result_code: string | null;
    command_id: string;
    business_id: string;
    adjustment_id: string | null;
    out_request_no: string;
    direction: 'inc' | 'dec';
    amount: string;
    reason: string;
}
export interface FundingAdjustmentContext {
    account_id: string;
    home_site_id: string;
    asset_code: 'USDT';
    balance: string | null;
    available_balance: string | null;
    pending_request: FundingAdjustmentResult | null;
}
export interface BalanceAdjustmentParams {
    user_id: number | string;
    balance: string;
    reason: string;
    out_request_no: number | string;
}
export interface BalanceAdjustmentQueryResult {
    status: 'success' | 'failed' | 'pending' | 'unknown';
    /** Fresh balance is required before a terminal result unlocks a new adjustment. */
    balance?: number | string;
}
export interface ResetUserPasswordResult {
    password: string;
}
export interface ResetPasswordUser {
    user_id: number | string;
    public_user_id?: number | string | null;
    source_type?: 'platform' | 'white_label' | 'merchant' | null;
    source_name?: string | null;
    agent_name_parse?: string | null;
}
