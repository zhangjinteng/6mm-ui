import { GameplayConfig, SaveBody, SaveResult } from '../../../api/prediction/types';
export type PendingStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export interface EditableRow {
    duration_seconds: string;
    observation_seconds: string;
    stake_tier_id: string;
    enabled: boolean;
    maximum_stake: string;
    minimum: string;
    maximum: string;
    editable: boolean;
    rule_enabled: boolean;
    tier_enabled: boolean;
}
export interface Pending {
    schema: 1;
    operator_id: string;
    agent_id: string;
    body: SaveBody;
    attempted: boolean;
    attempt: number;
}
export declare function configSymbol(config: GameplayConfig): string;
export declare function editableRows(value: unknown): EditableRow[];
export declare function makeBody(config: GameplayConfig, rows: EditableRow[], reason: string, key: string): SaveBody;
export declare function readPending(storage: PendingStorage): Pending | null;
export declare function persistPending(storage: PendingStorage, operator: string, agent: string, body: SaveBody): Pending;
export declare function restorePending(storage: PendingStorage, operator: string, agent: string): Pending | null;
export declare function clearPending(storage: PendingStorage, pending: Pending): void;
export declare function validSuccess(value: unknown, body: SaveBody, operator: string, agent: string): value is SaveResult;
export declare function isDeterminate(error: unknown): boolean;
export type DispatchResult = {
    status: 'success';
    value: SaveResult;
} | {
    status: 'rejected' | 'unknown' | 'superseded';
    error: unknown;
};
export declare function dispatchPending(storage: PendingStorage, pending: Pending, send: (body: SaveBody) => Promise<unknown>): Promise<DispatchResult>;
export declare class IntentGate {
    private generation;
    next(): () => boolean;
    close(): void;
}
