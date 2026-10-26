export interface Receipt {
    operation_id: string;
    client_request_id: string;
    result: string;
    [key: string]: unknown;
}
export interface PendingWrite {
    action: string;
    body: Record<string, unknown>;
    state: 'submitting' | 'unverified';
    attempted?: boolean;
    attemptGeneration?: number;
}
type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export declare function unwrapEnvelope<T>(value: unknown): T;
export declare function receiptFor(action: string, response: unknown): Receipt | undefined;
export declare class SubmissionJournal {
    private busy;
    private readonly key;
    private storage;
    private action;
    constructor(storage: StoragePort, actor: string, action: string, target: string);
    read(): PendingWrite | null;
    private validate;
    begin(body: Record<string, unknown>, id?: string): void;
    private ownsStoredIntent;
    attempt(send: (body: Record<string, unknown>) => Promise<unknown>): Promise<unknown>;
}
export {};
