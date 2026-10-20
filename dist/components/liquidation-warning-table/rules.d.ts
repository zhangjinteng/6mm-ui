import { LiquidationWarningRules } from './types';
export interface WarningRuleDraft {
    entryThreshold: string;
    highRiskThreshold: string;
    notifyEnabled: boolean;
}
export declare const parseWarningRules: (value: unknown) => LiquidationWarningRules;
export declare const validateWarningDraft: (draft: WarningRuleDraft) => {
    entryThreshold: string | true;
    highRiskThreshold: string | true;
};
export declare const toWarningRulePayload: (draft: WarningRuleDraft) => LiquidationWarningRules | null;
export declare const formatWarningThreshold: (value: unknown) => string;
export declare const formatLiquidationRiskRatio: (value: unknown) => string;
type WarningLevel = {
    label: '预警';
    type: 'warning';
} | {
    label: '高风险';
    type: 'danger';
};
export declare const resolveWarningLevel: (marginRatio: unknown, rules: LiquidationWarningRules | null | undefined) => WarningLevel | null;
export {};
