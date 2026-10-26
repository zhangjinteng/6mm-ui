export interface GridLayout {
    row_count: string;
    column_count: string;
    column_duration_seconds: string;
    price_band_width: string;
    price_decimals?: number | null;
    effective_from_ms: string;
    editable: boolean;
    affected_site_ids: string[];
}
export interface GridSnapshot {
    config_id?: string;
    requested_agent_id?: string;
    agent_id?: string | null;
    inherited?: boolean;
    default_config_id?: string;
    default_version?: string;
    default_resolution_epoch?: string;
    default_enabled?: boolean;
    effective_enabled?: boolean;
    default_target_rtp?: string;
    default_min_order_amount?: string;
    default_max_order_amount?: string;
    layout?: GridLayout;
    site_id: string;
    symbol: string;
    layout_version: string;
    site_version: string;
    effective_from_ms: string;
    enabled: boolean;
    target_rtp: string;
    min_multiplier: string;
    max_multiplier: string;
    min_order_amount: string;
    max_order_amount: string;
}
export interface GridCommand {
    based_on_config_id?: string;
    based_on_default_version?: string;
    based_on_default_resolution_epoch?: string;
    site_id: string;
    symbol: string;
    based_on_layout_version: string;
    based_on_site_version: string;
    client_request_id: string;
    reason: string;
    changes: Partial<Pick<GridSnapshot, 'enabled' | 'target_rtp' | 'min_multiplier' | 'max_multiplier' | 'min_order_amount' | 'max_order_amount'> & Pick<GridLayout, 'price_band_width' | 'column_duration_seconds' | 'price_decimals' | 'row_count' | 'column_count'>>;
}
export declare function createGridDraft(snapshot: GridSnapshot, canEdit?: boolean): GridSnapshot;
export interface PendingGridCommand {
    schema: 1;
    operator_id: string;
    command: GridCommand;
}
export interface GridSaveReview {
    operator_id: string;
    command: GridCommand;
}
export type PendingStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export interface GridOperationResult {
    operation_status: 'SUCCEEDED';
    operation_id: string;
    site_id: string;
    symbol: string;
    layout_version: string;
    site_version: string;
    effective_from_ms: string;
    changed: boolean;
    cache_state: 'PENDING' | 'DONE' | 'NOT_REQUIRED';
}
export declare function canonicalDecimal(value: unknown, maxScale?: number): string;
export declare function compareDecimal(left: string, right: string): number;
export declare function ratioToPercent(value: string): string;
export declare function percentToRatio(value: string): string;
export declare function secureRequestId(source?: {
    getRandomValues(array: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer>;
}): string;
export declare function hasGridPriceBandPrecisionError(value: unknown): boolean;
export declare function normalizeLayout(value: unknown): GridLayout;
export declare function hasLayoutChanges(source: GridSnapshot, draft: GridSnapshot, allowLayout?: boolean): boolean;
export declare function normalizeSnapshot(value: unknown): GridSnapshot;
export declare function normalizeSnapshotForTarget(value: unknown, siteId: string, symbol: string): GridSnapshot;
export declare function makeCommand(sourceValue: unknown, draftValue: unknown, reason: string, requestId: string, allowMultipliers: boolean, allowLayout?: boolean): GridCommand;
export declare function readPending(storage: PendingStorage): PendingGridCommand | null;
export declare function persistPending(storage: PendingStorage, operatorId: string, command: GridCommand): PendingGridCommand;
export declare function captureSaveReview(operatorId: string, command: GridCommand): GridSaveReview;
export declare function persistReviewedCommand(storage: PendingStorage, review: GridSaveReview, currentOperatorId: string, currentCommand: GridCommand): PendingGridCommand;
export declare function pendingForActor(storage: PendingStorage, operatorId: string): {
    status: 'none' | 'bound' | 'foreign';
    pending?: PendingGridCommand;
};
export declare function isUnconfirmedReceipt(error: unknown): boolean;
export declare function attemptPending(storage: PendingStorage, pending: PendingGridCommand, mode: 'save' | 'receipt' | 'recover', sender: (mode: 'save' | 'receipt', command: GridCommand) => Promise<unknown>): Promise<{
    status: 'success';
    value: GridOperationResult;
} | {
    status: 'rejected';
    error: unknown;
    journalCleared: boolean;
} | {
    status: 'unknown';
    error: unknown;
}>;
export declare class SelectionGate {
    private generation;
    private controller?;
    next(key: string): {
        signal: AbortSignal;
        current: (currentKey: string) => boolean;
    };
    close(): void;
}
