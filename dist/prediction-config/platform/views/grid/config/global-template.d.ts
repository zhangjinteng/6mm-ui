import { PendingCommand } from './journal';
export declare const parameterFields: readonly [readonly ["target_rtp", "目标返奖率", "%"], readonly ["min_multiplier", "最低赔率", "x"], readonly ["max_multiplier", "最高赔率", "x"], readonly ["min_order_amount", "单笔最小额", "USDT"], readonly ["max_order_amount", "单笔最大额", "USDT"]];
type Field = typeof parameterFields[number][0];
export type Parameters = Record<Field, string>;
export type LayoutFields = {
    price_band_width: string;
    column_duration_seconds: string;
    price_decimals: number | null;
};
type Layout = LayoutFields & {
    version: string;
    row_count: string;
    column_count: string;
};
export type GlobalSnapshot = {
    enabled?: boolean;
    availability_version?: string;
    scope: 'GLOBAL';
    symbol: string;
    global_version: string;
    effective_from_ms: string | null;
    parameters: Parameters | null;
    layout: Layout | null;
};
type ParameterCommand = {
    action?: 'save_parameters';
    symbol: string;
    based_on_global_version: string;
    client_request_id: string;
    reason: string;
    changes: Parameters;
    based_on_layout_version?: string;
    layout?: Partial<LayoutFields>;
};
type AvailabilityCommand = {
    action: 'set_enabled';
    symbol: string;
    based_on_availability_version: string;
    client_request_id: string;
    reason: string;
    enabled: boolean;
};
export type GlobalCommand = ParameterCommand | AvailabilityCommand;
type GlobalResult = {
    enabled?: boolean;
    availability_version?: string;
    scope: 'GLOBAL';
    symbol: string;
    global_version: string;
    operation_id: string;
    operation_status: 'SUCCEEDED';
    effective_from_ms: string | null;
    changed: boolean;
    cache_state: 'PENDING' | 'DONE' | 'NOT_REQUIRED';
};
export declare function globalSnapshot(value: unknown, symbol: string): GlobalSnapshot;
export declare function globalCommand(snapshot: GlobalSnapshot, changes: unknown, id: string, layout?: Partial<LayoutFields>): ParameterCommand;
export declare const globalJournal: {
    readPending: (storage: import('./journal').PendingStorage) => PendingCommand<GlobalCommand> | null;
    persistPending: (storage: import('./journal').PendingStorage, operatorId: string, command: GlobalCommand) => PendingCommand<GlobalCommand>;
    captureSaveReview: (operatorId: string, command: GlobalCommand) => import('./journal').Review<GlobalCommand>;
    persistReviewedCommand: (storage: import('./journal').PendingStorage, review: import('./journal').Review<GlobalCommand>, currentOperatorId: string, currentCommand: GlobalCommand) => PendingCommand<GlobalCommand>;
    pendingForActor: (storage: import('./journal').PendingStorage, operatorId: string) => {
        status: "none" | "bound" | "foreign";
        pending?: PendingCommand<GlobalCommand> | undefined;
    };
    attemptPending: (storage: import('./journal').PendingStorage, pending: PendingCommand<GlobalCommand>, mode: "save" | "receipt" | "recover", sender: (mode: "save" | "receipt", command: GlobalCommand) => Promise<unknown>) => Promise<{
        status: "success";
        value: GlobalResult;
    } | {
        status: "rejected";
        error: unknown;
        journalCleared: boolean;
    } | {
        status: "unknown";
        error: unknown;
    }>;
};
export {};
