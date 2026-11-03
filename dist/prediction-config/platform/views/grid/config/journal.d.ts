export type PendingStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export interface PendingCommand<C> {
    schema: 1;
    operator_id: string;
    command: C;
}
export interface Review<C> {
    operator_id: string;
    command: C;
}
/** Both editors keep their own exact command contract and storage key; replay semantics are identical. */
export declare function createGridJournal<C, R>(STORAGE_KEY: string, commandShape: (v: unknown) => asserts v is C, operationResult: (v: unknown, pending: PendingCommand<C>) => v is R): {
    readPending: (storage: PendingStorage) => PendingCommand<C> | null;
    persistPending: (storage: PendingStorage, operatorId: string, command: C) => PendingCommand<C>;
    captureSaveReview: (operatorId: string, command: C) => Review<C>;
    persistReviewedCommand: (storage: PendingStorage, review: Review<C>, currentOperatorId: string, currentCommand: C) => PendingCommand<C>;
    pendingForActor: (storage: PendingStorage, operatorId: string) => {
        status: "none" | "bound" | "foreign";
        pending?: PendingCommand<C>;
    };
    attemptPending: (storage: PendingStorage, pending: PendingCommand<C>, mode: "save" | "receipt" | "recover", sender: (mode: "save" | "receipt", command: C) => Promise<unknown>) => Promise<{
        status: "success";
        value: R;
    } | {
        status: "rejected";
        error: unknown;
        journalCleared: boolean;
    } | {
        status: "unknown";
        error: unknown;
    }>;
};
