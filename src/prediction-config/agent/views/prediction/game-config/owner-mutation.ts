import type { OwnerActor, OwnerConfig, OwnerSaveBody, OwnerSaveResult } from '../../../api/prediction/owner-types'
import { canManageOwnerConfig, money, assertOwnerConfig, ownerTier } from './owner-model'
import { compareDecimal, decimal, integer, text } from '../shared/format'
import { isDeterminate, type PendingStorage } from '../shared/mutation'
import { ensure, frozen, object, periods } from './site-model'
function assertActor(actor: OwnerActor) { ensure(canManageOwnerConfig(actor), 'IDENTITY_UNCONFIRMED') }
export const ownerStorageKey = 'prediction.owner.pending.v1'
export interface OwnerPending extends OwnerActor { schema: 'owner-v1'; body: OwnerSaveBody; attempted: boolean; attempt: number }
function keys(value: Record<string, unknown>, required: string[], optional: string[] = []) {
    ensure(required.every(k => Object.hasOwn(value, k)) && Object.keys(value).every(k => required.includes(k) || optional.includes(k)), 'PENDING_CORRUPT')
}
function bodyShape(value: unknown): asserts value is OwnerSaveBody {
    ensure(object(value),'PENDING_CORRUPT'); keys(value,['game_type','symbol','based_owner_revision','changes','client_request_id','reason'],['enabled']);ensure(value.enabled===undefined || typeof value.enabled==='boolean','PENDING_CORRUPT')
    ensure(['UP_DOWN','HIGH_LOW'].includes(String(value.game_type)) && text(value.symbol,64,true) && text(value.client_request_id,128) && text(value.reason,500) && integer(value.based_owner_revision),'PENDING_CORRUPT')
    ensure(Array.isArray(value.changes) && (value.changes.length>0 || value.enabled!==undefined) && value.changes.length<=100 && new Set(value.changes.map(r=>r.duration_seconds)).size===value.changes.length,'PENDING_CORRUPT')
    for(const row of value.changes) {
        ensure(object(row)); keys(row,['duration_seconds','stake_tier_id','based_rule_epoch','minimum_stake','maximum_stake'],['enabled','target_payout_rate','maximum_odds','fixed_odds'])
        ensure(row.enabled===undefined || typeof row.enabled==='boolean','PENDING_CORRUPT')
        if(value.game_type==='UP_DOWN') {
            ensure(row.fixed_odds===undefined,'PENDING_CORRUPT')
            if(row.target_payout_rate!==undefined || row.maximum_odds!==undefined) ensure(money(row.target_payout_rate) && compareDecimal(row.target_payout_rate,'1')<=0 && money(row.maximum_odds) && compareDecimal(row.maximum_odds,'1')>=0,'PENDING_CORRUPT')
        } else {ensure(row.target_payout_rate===undefined && row.maximum_odds===undefined,'PENDING_CORRUPT');if(row.fixed_odds!==undefined)ensure(money(row.fixed_odds) && compareDecimal(row.fixed_odds,'1')>0,'PENDING_CORRUPT')}
        ensure(integer(row.duration_seconds,true) && integer(row.based_rule_epoch,true) && (value.game_type==='UP_DOWN' ? periods.includes(row.duration_seconds) && text(row.stake_tier_id) : row.stake_tier_id===''),'PENDING_CORRUPT')
        ensure(money(row.minimum_stake) && money(row.maximum_stake) && compareDecimal(row.minimum_stake,row.maximum_stake)<=0,'PENDING_CORRUPT')
    }
}
export function readOwnerPending(storage: PendingStorage): OwnerPending | null {
    const raw = storage.getItem(ownerStorageKey)
    if (raw === null) return null
    ensure(raw.length <= 32768, 'PENDING_CORRUPT')
    let value: unknown
    try { value = JSON.parse(raw) } catch { throw new Error('PENDING_CORRUPT') }
    ensure(object(value)); keys(value, ['schema', 'operator_id', 'agent_id', 'body', 'attempted', 'attempt']); assertActor(value as unknown as OwnerActor)
    ensure(value.schema === 'owner-v1' && typeof value.attempted === 'boolean' && Number.isSafeInteger(value.attempt) && Number(value.attempt) >= 0 && value.attempted === (Number(value.attempt) > 0), 'PENDING_CORRUPT')
    bodyShape(value.body)
    return frozen(value as unknown as OwnerPending)
}
const same = (a: OwnerPending | null, b: OwnerPending) => !!a && a.operator_id === b.operator_id && a.agent_id === b.agent_id && JSON.stringify(a.body) === JSON.stringify(b.body)
export function persistOwnerPending(storage: PendingStorage, actor: OwnerActor, body: OwnerSaveBody): OwnerPending {
    assertActor(actor); bodyShape(body); ensure(readOwnerPending(storage) === null, 'PENDING_EXISTS')
    const value: OwnerPending = {schema: 'owner-v1', ...actor, body: JSON.parse(JSON.stringify(body)), attempted: false, attempt: 0}
    storage.setItem(ownerStorageKey, JSON.stringify(value)); ensure(same(readOwnerPending(storage), value), 'PERSISTENCE_UNAVAILABLE')
    return frozen(value)
}
function clear(storage: PendingStorage, pending: OwnerPending) { if (same(readOwnerPending(storage), pending)) storage.removeItem(ownerStorageKey) }
export function validOwnerSuccess(value: unknown, pending: OwnerPending): value is OwnerSaveResult {
    try {
        ensure(object(value) && object(value.receipt)); assertOwnerConfig(value.configuration,pending)
        const body=pending.body, stored=value.configuration, receipt=value.receipt
        ensure(stored.symbol===body.symbol && stored.game_type==='GAME_TYPE_'+body.game_type && BigInt(stored.owner_revision)===BigInt(body.based_owner_revision)+1n)
        if(body.enabled!==undefined)ensure(stored.enabled===body.enabled)
        for(const change of body.changes) {
            const item=stored.rules.find(r=>r.rule.duration_seconds===change.duration_seconds);ensure(item && item.rule_epoch===change.based_rule_epoch)
            if(change.enabled!==undefined)ensure(item.owner_enabled===change.enabled)
            for(const k of ['target_payout_rate','maximum_odds','fixed_odds'] as const)if(change[k]!==undefined)ensure(compareDecimal(item.rule[k],change[k]!)===0)
            const bounds=body.game_type==='UP_DOWN'?ownerTier(item.rule):item.rule
            ensure((('stake_tier_id' in bounds)?bounds.stake_tier_id:'')===change.stake_tier_id && compareDecimal(bounds.minimum_stake,change.minimum_stake)===0 && compareDecimal(bounds.maximum_stake,change.maximum_stake)===0)
        }
        ensure(['operation_id', 'operator_id', 'client_request_id', 'capability', 'action', 'target_type', 'target_id', 'reason', 'before_json', 'after_json', 'result', 'error_code', 'created_at_ms', 'completed_at_ms', 'source_service', 'trace_id'].every(k => typeof receipt[k] === 'string'))
        ensure(text(receipt.operation_id, 256) && text(receipt.trace_id, 256) && text(receipt.target_id, 256) && integer(receipt.created_at_ms) && integer(receipt.completed_at_ms))
        ensure(receipt.operator_id === pending.operator_id && receipt.client_request_id === body.client_request_id && receipt.reason === body.reason && receipt.source_service === 'agent_admin')
        ensure(receipt.result === 'OPERATION_RESULT_SUCCEEDED' && receipt.error_code === '' && receipt.action === 'ADMIN_ACTION_OWNER_CONFIG_PUBLISH' && receipt.capability === 'prediction.owner.config.publish' && receipt.target_type === 'owner_config')
        // The BFF verifies the Go target digest; this layer also strictly binds the full stored target.
        return true
    } catch { return false }
}
export type OwnerDispatchResult = {status: 'success'; value: OwnerSaveResult} | {status: 'unknown' | 'rejected' | 'superseded'; error: unknown}
const active = new WeakMap<PendingStorage, {pending: OwnerPending; promise: Promise<OwnerDispatchResult>}>()
export function dispatchOwnerPending(storage: PendingStorage, pending: OwnerPending, send: (body: OwnerSaveBody) => Promise<unknown>): Promise<OwnerDispatchResult> {
    const running = active.get(storage)
    if (running) { ensure(same(running.pending, pending), 'PENDING_EXISTS'); return running.promise }
    const stored = readOwnerPending(storage); ensure(same(stored, pending), 'PENDING_CHANGED')
    const hadAttempt = stored!.attempted, attempt = stored!.attempt + 1
    ensure(Number.isSafeInteger(attempt), 'ATTEMPT_LIMIT')
    storage.setItem(ownerStorageKey, JSON.stringify({...stored, attempted: true, attempt}))
    const persisted = readOwnerPending(storage); ensure(persisted?.attempt === attempt && same(persisted, pending), 'PERSISTENCE_UNAVAILABLE')
    const promise = Promise.resolve().then(async (): Promise<OwnerDispatchResult> => {
        try {
            const value = await send(pending.body)
            if (!same(readOwnerPending(storage), pending)) return {status: 'superseded', error: null}
            if (!validOwnerSuccess(value, pending)) return {status: 'unknown', error: Error('INVALID_RECEIPT')}
            clear(storage, pending)
            return {status: 'success', value}
        } catch (error) {
            const current = readOwnerPending(storage)
            if (!same(current, pending)) return {status: 'superseded', error}
            const wrongKey = object(error) && error.client_request_id !== undefined && error.client_request_id !== pending.body.client_request_id
            if (!hadAttempt && current!.attempt === attempt && !wrongKey && isDeterminate(error)) { clear(storage, pending); return {status: 'rejected', error} }
            return {status: 'unknown', error}
        }
    }).finally(() => { if (active.get(storage)?.promise === promise) active.delete(storage) })
    active.set(storage, {pending, promise})
    return promise
}

// Saving and refreshing have different outcomes. A failed read never recreates a completed pending write.
export async function dispatchOwnerPendingWithRefresh(storage: PendingStorage, pending: OwnerPending, send: (body: OwnerSaveBody) => Promise<unknown>, read: (body: OwnerSaveBody) => Promise<OwnerConfig>) {
    const result = await dispatchOwnerPending(storage, pending, send)
    if (result.status !== 'success') return result
    try { return {...result, latest: await read(pending.body), refreshFailed: false} }
    catch { return {...result, latest: null, refreshFailed: true} }
}
