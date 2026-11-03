export type PendingStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
export interface PendingCommand<C> { schema: 1; operator_id: string; command: C }
export interface Review<C> { operator_id: string; command: C }
const positiveIntegerPattern = /^[1-9]\d*$/
function object(v: unknown): v is Record<string, unknown> { return !!v && typeof v==='object' && !Array.isArray(v) }
function requireValid(v: unknown, message: string): asserts v { if (!v) throw Error(message) }
function exactKeys(v: Record<string,unknown>, keys: string[]) { requireValid(Object.keys(v).length===keys.length && keys.every(k=>Object.hasOwn(v,k)), 'PENDING_CORRUPT') }

/** Both editors keep their own exact command contract and storage key; replay semantics are identical. */
export function createGridJournal<C,R>(STORAGE_KEY: string, commandShape: (v: unknown) => asserts v is C,
    operationResult: (v: unknown,pending: PendingCommand<C>) => v is R) {
    function deepFreeze<T>(value: T): T {
        if (value && typeof value === 'object') {
            Object.freeze(value)
            for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child)
        }
        return value
    }
    function same(left: PendingCommand<C> | null, right: PendingCommand<C>) {
        return !!left && JSON.stringify(left) === JSON.stringify(right)
    }
    function readPending(storage: PendingStorage): PendingCommand<C> | null {
        const raw = storage.getItem(STORAGE_KEY)
        if (raw === null) return null
        requireValid(raw.length <= 32768, 'PENDING_CORRUPT')
        let value: unknown
        try { value = JSON.parse(raw) } catch { throw new Error('PENDING_CORRUPT') }
        requireValid(object(value), 'PENDING_CORRUPT')
        exactKeys(value, ['schema', 'operator_id', 'command'])
        requireValid(value.schema === 1 && typeof value.operator_id === 'string' && positiveIntegerPattern.test(value.operator_id), 'PENDING_CORRUPT')
        commandShape(value.command)
        return deepFreeze(value as unknown as PendingCommand<C>)
    }
    function persistPending(storage: PendingStorage, operatorId: string, command: C): PendingCommand<C> {
        requireValid(positiveIntegerPattern.test(operatorId), 'IDENTITY_UNCONFIRMED')
        requireValid(readPending(storage) === null, 'PENDING_EXISTS')
        commandShape(command)
        const value: PendingCommand<C> = { schema: 1, operator_id: operatorId, command: JSON.parse(JSON.stringify(command)) }
        storage.setItem(STORAGE_KEY, JSON.stringify(value))
        const stored = readPending(storage)
        requireValid(same(stored, value), 'PERSISTENCE_UNAVAILABLE')
        return stored!
    }
    function captureSaveReview(operatorId: string, command: C): Review<C> {
        requireValid(positiveIntegerPattern.test(operatorId), 'IDENTITY_UNCONFIRMED')
        commandShape(command)
        return deepFreeze({ operator_id: operatorId, command: structuredClone(command) })
    }
    function persistReviewedCommand(storage: PendingStorage, review: Review<C>, currentOperatorId: string, currentCommand: C): PendingCommand<C> {
        commandShape(review.command)
        commandShape(currentCommand)
        requireValid(review.operator_id === currentOperatorId && JSON.stringify(review.command) === JSON.stringify(currentCommand), 'STALE_CONFIRMATION')
        return persistPending(storage, review.operator_id, review.command)
    }
    function pendingForActor(storage: PendingStorage, operatorId: string): { status: 'none' | 'bound' | 'foreign'; pending?: PendingCommand<C> } {
        const pending = readPending(storage)
        if (!pending) return { status: 'none' }
        return pending.operator_id === operatorId ? { status: 'bound', pending } : { status: 'foreign', pending }
    }
    async function attemptPending(
        storage: PendingStorage,
        pending: PendingCommand<C>,
        mode: 'save' | 'receipt' | 'recover',
        sender: (mode: 'save' | 'receipt', command: C) => Promise<unknown>
    ): Promise<{ status: 'success'; value: R } | { status: 'rejected'; error: unknown; journalCleared: boolean } | { status: 'unknown'; error: unknown }> {
        requireValid(same(readPending(storage), pending), 'PENDING_CHANGED')
        try {
            // Recovery reuses the save endpoint, but only a validated success may clear its journal.
            const value = await sender(mode === 'recover' ? 'save' : mode, structuredClone(pending.command))
            if (!operationResult(value, pending)) return { status: 'unknown', error: new Error('INVALID_RECEIPT') }
            if (same(readPending(storage), pending)) storage.removeItem(STORAGE_KEY)
            return { status: 'success', value }
        } catch (error) {
            const status = object(error) ? error.operation_status : undefined
            if (status === 'FAILED' && (mode === 'save' || (mode === 'recover' && object(error) && error.error_code === 'VERSION_CONFLICT'))) {
                const journalCleared = same(readPending(storage), pending)
                if (journalCleared) storage.removeItem(STORAGE_KEY)
                return { status: 'rejected', error, journalCleared }
            }
            return { status: 'unknown', error }
        }
    }
    return { readPending, persistPending, captureSaveReview, persistReviewedCommand, pendingForActor, attemptPending }
}
