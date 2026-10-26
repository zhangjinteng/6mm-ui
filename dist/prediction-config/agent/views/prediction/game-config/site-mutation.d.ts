import { SiteActor, SiteConfigRead, SiteSaveBody, SiteSaveResult } from '../../../api/prediction/site-types';
import { PendingStorage } from '../shared/mutation';
export declare const siteStorageKey = "prediction.site.pending.v1";
export interface SitePending extends SiteActor {
    schema: 'site-v1';
    body: SiteSaveBody;
    attempted: boolean;
    attempt: number;
}
export declare function readSitePending(storage: PendingStorage): SitePending | null;
export declare function persistSitePending(storage: PendingStorage, actor: SiteActor, body: SiteSaveBody): SitePending;
export declare function validSiteSuccess(value: unknown, pending: SitePending): value is SiteSaveResult;
export type SiteDispatchResult = {
    status: 'success';
    value: SiteSaveResult;
} | {
    status: 'unknown' | 'rejected' | 'superseded';
    error: unknown;
};
export declare function dispatchSitePending(storage: PendingStorage, pending: SitePending, send: (body: SiteSaveBody) => Promise<unknown>): Promise<SiteDispatchResult>;
export declare function dispatchSitePendingWithRefresh(storage: PendingStorage, pending: SitePending, send: (body: SiteSaveBody) => Promise<unknown>, read: (body: SiteSaveBody) => Promise<SiteConfigRead>): Promise<{
    status: "unknown" | "rejected" | "superseded";
    error: unknown;
} | {
    latest: SiteConfigRead;
    refreshFailed: boolean;
    status: "success";
    value: SiteSaveResult;
} | {
    latest: null;
    refreshFailed: boolean;
    status: "success";
    value: SiteSaveResult;
}>;
