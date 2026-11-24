import { BalanceAdjustmentParams, BalanceAdjustmentQueryResult, FundingAdjustmentContext, FundingAdjustmentResult } from './types';
type __VLS_Props = {
    storageScope?: string;
    adjust: (direction: 'inc' | 'dec', params: BalanceAdjustmentParams) => Promise<unknown>;
    queryAdjustment?: (direction: 'inc' | 'dec', params: BalanceAdjustmentParams) => Promise<BalanceAdjustmentQueryResult>;
    fundingContext?: (userId: number | string) => Promise<FundingAdjustmentContext>;
    adjustFunding?: (direction: 'inc' | 'dec', params: BalanceAdjustmentParams) => Promise<FundingAdjustmentResult>;
};
interface BalanceUser {
    uid?: number | string | null;
    username?: string | null;
}
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {
    open: (userId: number | string, type?: "dec" | "inc", nowBalance?: number | string, userContext?: BalanceUser, initialAccount?: "contract" | "funding") => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    success: (...args: any[]) => void;
    close: (...args: any[]) => void;
    reconciled: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSuccess?: ((...args: any[]) => any) | undefined;
    onClose?: ((...args: any[]) => any) | undefined;
    onReconciled?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
