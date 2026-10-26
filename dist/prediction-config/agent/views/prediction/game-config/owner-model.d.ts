import { SiteEffectiveRule, SiteEffectiveTier } from '../../../api/prediction/site-types';
import { OwnerActor, OwnerConfig, OwnerLimitChange, OwnerSaveBody } from '../../../api/prediction/owner-types';
export type { OwnerActor, OwnerConfig, OwnerLimitChange, OwnerSaveBody };
export declare function ownerTier(rule: SiteEffectiveRule): SiteEffectiveTier;
export declare function canManageOwnerConfig(actor: OwnerActor): boolean;
export declare const money: (v: unknown) => v is string;
export declare function validateOwnerBounds(platformMin: string, platformMax: string, minimum: string, maximum: string): boolean;
export declare function assertOwnerConfig(value: unknown, actor: OwnerActor): asserts value is OwnerConfig;
export interface OwnerRow extends OwnerLimitChange {
    observation_seconds: string;
    enabled: boolean;
    platform_minimum: string;
    platform_maximum: string;
    odds: string;
    custom: boolean;
    owner_enabled: boolean;
    platform_enabled: boolean;
    target_payout_rate: string;
    maximum_odds: string;
    fixed_odds: string;
    platform_target_payout_rate: string;
    platform_maximum_odds: string;
    platform_fixed_odds: string;
    minimum_odds: string;
}
export declare function ownerRows(value: unknown, actor: OwnerActor): OwnerRow[];
export declare function makeOwnerBody(value: OwnerConfig, actor: OwnerActor, rows: OwnerRow[], reason: string, key: string, enabled?: boolean): OwnerSaveBody;
export declare class OwnerReadGate {
    private generation;
    begin(actor: OwnerActor, game: string, symbol: string): {
        generation: number;
        operator: string;
        owner: string;
        game: string;
        symbol: string;
    };
    close(): void;
    current(ticket: ReturnType<OwnerReadGate['begin']>, actor: OwnerActor, game: string, symbol: string): boolean;
}
