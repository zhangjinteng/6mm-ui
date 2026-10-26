import { OwnerActor, OwnerConfig, OwnerSaveBody, OwnerSaveResult } from '../../../api/prediction/owner-types';
import { PendingStorage } from '../shared/mutation';
export declare const ownerStorageKey = "prediction.owner.pending.v1";
export interface OwnerPending extends OwnerActor {
    schema: 'owner-v1';
    body: OwnerSaveBody;
    attempted: boolean;
    attempt: number;
}
export declare function readOwnerPending(storage: PendingStorage): OwnerPending | null;
export declare function persistOwnerPending(storage: PendingStorage, actor: OwnerActor, body: OwnerSaveBody): OwnerPending;
export declare function validOwnerSuccess(value: unknown, pending: OwnerPending): value is OwnerSaveResult;
export type OwnerDispatchResult = {
    status: 'success';
    value: OwnerSaveResult;
} | {
    status: 'unknown' | 'rejected' | 'superseded';
    error: unknown;
};
export declare function dispatchOwnerPending(storage: PendingStorage, pending: OwnerPending, send: (body: OwnerSaveBody) => Promise<unknown>): Promise<OwnerDispatchResult>;
export declare function dispatchOwnerPendingWithRefresh(storage: PendingStorage, pending: OwnerPending, send: (body: OwnerSaveBody) => Promise<unknown>, read: (body: OwnerSaveBody) => Promise<OwnerConfig>): Promise<{
    status: "unknown" | "rejected" | "superseded";
    error: unknown;
} | {
    latest: OwnerConfig;
    refreshFailed: boolean;
    status: "success";
    value: OwnerSaveResult;
} | {
    latest: null;
    refreshFailed: boolean;
    status: "success";
    value: OwnerSaveResult;
}>;
