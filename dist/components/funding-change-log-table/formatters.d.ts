export declare function formatFundingAmount(value: unknown, currency: unknown, showPositiveSign?: boolean): string;
export declare function fundingBalanceChangeClass(value: unknown): string;
export type FundingChangeTypeKey = 'agentTransferIn' | 'agentTransferOut' | 'transferHoldCreated' | 'transferHoldReleased' | 'transferIn' | 'transferOut';
export declare function fundingChangeTypeKey(businessType: unknown, entryType: unknown): FundingChangeTypeKey | null;
