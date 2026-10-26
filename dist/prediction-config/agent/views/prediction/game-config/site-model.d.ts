import { SiteActor, SiteGame, SiteConfigRead, SiteSaveBody, SiteStored, SiteTargets } from '../../../api/prediction/site-types';
export declare const siteGame: (value: SiteConfigRead) => SiteGame;
export declare const periods: string[];
export declare const object: (v: unknown) => v is Record<string, unknown>;
export declare function ensure(ok: unknown, code?: string): asserts ok;
export declare function frozen<T>(value: T): T;
export declare function siteRequestId(source?: {
    getRandomValues(array: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer>;
}): string;
export declare function assertActor(value: unknown): asserts value is SiteActor;
export declare function assertTargets(value: unknown): asserts value is SiteTargets;
export declare function assertStored(value: unknown): asserts value is SiteStored;
export declare function assertSiteRead(value: unknown, site: string, symbol: string, game?: SiteGame): asserts value is SiteConfigRead;
export declare function assertHighLowValues(row: Record<string, unknown>, required?: boolean): void;
export interface SiteRow {
    fixed_odds?: string;
    minimum_stake?: string;
    effective_fixed_odds?: string;
    effective_minimum?: string;
    duration_seconds: string;
    observation_seconds: string;
    stake_tier_id: string;
    enabled: boolean;
    maximum_stake: string;
    effective_maximum: string;
    effective_enabled: boolean;
    inherited_enabled: boolean;
    editable: boolean;
}
export declare function siteRows(config: SiteConfigRead): SiteRow[];
export declare function makeSiteBody(config: SiteConfigRead, rows: SiteRow[], enabled: boolean, reason: string, request: string): SiteSaveBody;
export interface SiteBinding extends SiteActor {
    site_id: string;
    game_type: SiteGame;
    symbol: string;
    public_version: string;
    site_version: string;
}
export declare function siteBinding(actor: SiteActor, config: SiteConfigRead): SiteBinding;
export declare class SiteIntentGate {
    private generation;
    next(binding: SiteBinding): {
        current: (current: SiteBinding | null) => boolean;
    };
    close(): void;
}
