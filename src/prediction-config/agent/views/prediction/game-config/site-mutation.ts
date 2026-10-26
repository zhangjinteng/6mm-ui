import type { SiteActor, SiteConfigRead, SiteSaveBody, SiteSaveResult } from '../../../api/prediction/site-types'
import { compareDecimal, decimal, integer, text } from '../shared/format'
import { isDeterminate, type PendingStorage } from '../shared/mutation'
import { assertActor, assertHighLowValues, assertStored, ensure, frozen, object, periods } from './site-model'
export const siteStorageKey = 'prediction.site.pending.v1'
export interface SitePending extends SiteActor { schema: 'site-v1'; body: SiteSaveBody; attempted: boolean; attempt: number }
function keys(value: Record<string, unknown>, required: string[], optional: string[] = []) {
    ensure(required.every(k => Object.hasOwn(value, k)) && Object.keys(value).every(k => required.includes(k) || optional.includes(k)), 'PENDING_CORRUPT')
}
function bodyShape(value: unknown): asserts value is SiteSaveBody {
    ensure(object(value), 'PENDING_CORRUPT')
    keys(value, ['site_id', 'game_type', 'symbol', 'client_request_id', 'reason', 'based_on_public_version', 'based_on_site_version', 'enabled', 'overrides'])
    ensure(text(value.site_id, 128) && ['UP_DOWN', 'HIGH_LOW'].includes(String(value.game_type)) && text(value.symbol, 64, true) && text(value.client_request_id, 128) && text(value.reason, 500), 'PENDING_CORRUPT')
    ensure(integer(value.based_on_public_version, true) && integer(value.based_on_site_version, true) && typeof value.enabled === 'boolean' && Array.isArray(value.overrides), 'PENDING_CORRUPT')
    const upDown = value.game_type === 'UP_DOWN'
    ensure((upDown ? value.overrides.length === 5 : value.overrides.length > 0 && value.overrides.length <= 100) && new Set(value.overrides.map(r => r.duration_seconds)).size === value.overrides.length, 'PENDING_CORRUPT')
    for (const row of value.overrides) {
        ensure(object(row))
        if (!upDown) {
            keys(row, ['duration_seconds'], ['enabled', 'fixed_odds', 'minimum_stake', 'maximum_stake'])
            ensure(integer(row.duration_seconds, true) && (!Object.hasOwn(row, 'enabled') || typeof row.enabled === 'boolean'), 'PENDING_CORRUPT')
            assertHighLowValues(row); continue
        }
        keys(row, ['duration_seconds', 'stake_tiers'], ['enabled'])
        ensure(periods.includes(String(row.duration_seconds)) && (!Object.hasOwn(row, 'enabled') || typeof row.enabled === 'boolean') && Array.isArray(row.stake_tiers) && row.stake_tiers.length === 1, 'PENDING_CORRUPT')
        const tier = row.stake_tiers[0]; ensure(object(tier)); keys(tier, ['stake_tier_id'], ['enabled', 'maximum_stake'])
        ensure(text(tier.stake_tier_id) && (!Object.hasOwn(tier, 'enabled') || typeof tier.enabled === 'boolean'), 'PENDING_CORRUPT')
        ensure(!Object.hasOwn(tier, 'maximum_stake') || (decimal(tier.maximum_stake) && compareDecimal(tier.maximum_stake, '1') >= 0), 'PENDING_CORRUPT')
    }
}
export function readSitePending(storage: PendingStorage): SitePending | null {
    const raw = storage.getItem(siteStorageKey)
    if (raw === null) return null
    ensure(raw.length <= 32768, 'PENDING_CORRUPT')
    let value: unknown
    try { value = JSON.parse(raw) } catch { throw new Error('PENDING_CORRUPT') }
    ensure(object(value)); keys(value, ['schema', 'operator_id', 'agent_id', 'body', 'attempted', 'attempt']); assertActor(value)
    ensure(value.schema === 'site-v1' && typeof value.attempted === 'boolean' && Number.isSafeInteger(value.attempt) && Number(value.attempt) >= 0 && value.attempted === (Number(value.attempt) > 0), 'PENDING_CORRUPT')
    bodyShape(value.body)
    return frozen(value as unknown as SitePending)
}
const same = (a: SitePending | null, b: SitePending) => !!a && a.operator_id === b.operator_id && a.agent_id === b.agent_id && JSON.stringify(a.body) === JSON.stringify(b.body)
export function persistSitePending(storage: PendingStorage, actor: SiteActor, body: SiteSaveBody): SitePending {
    assertActor(actor); bodyShape(body); ensure(readSitePending(storage) === null, 'PENDING_EXISTS')
    const value: SitePending = {schema: 'site-v1', ...actor, body: JSON.parse(JSON.stringify(body)), attempted: false, attempt: 0}
    storage.setItem(siteStorageKey, JSON.stringify(value)); ensure(same(readSitePending(storage), value), 'PERSISTENCE_UNAVAILABLE')
    return frozen(value)
}
function clear(storage: PendingStorage, pending: SitePending) { if (same(readSitePending(storage), pending)) storage.removeItem(siteStorageKey) }
export function validSiteSuccess(value: unknown, pending: SitePending): value is SiteSaveResult {
    try {
        ensure(object(value) && object(value.receipt)); assertStored(value.stored)
        const body = pending.body, stored = value.stored, receipt = value.receipt
        ensure(stored.site_id === body.site_id && stored.symbol === body.symbol && stored.game_type === 'GAME_TYPE_' + body.game_type && stored.based_on_public_version === body.based_on_public_version && stored.enabled === body.enabled)
        ensure(BigInt(stored.version) === BigInt(body.based_on_site_version) + 1n)
        ensure(['operation_id', 'operator_id', 'client_request_id', 'capability', 'action', 'target_type', 'target_id', 'reason', 'before_json', 'after_json', 'result', 'error_code', 'created_at_ms', 'completed_at_ms', 'source_service', 'trace_id'].every(k => typeof receipt[k] === 'string'))
        ensure(text(receipt.operation_id, 256) && text(receipt.trace_id, 256) && text(receipt.target_id, 256) && integer(receipt.created_at_ms) && integer(receipt.completed_at_ms))
        ensure(receipt.operator_id === pending.operator_id && receipt.client_request_id === body.client_request_id && receipt.reason === body.reason && receipt.source_service === 'agent_admin')
        ensure(receipt.result === 'OPERATION_RESULT_SUCCEEDED' && receipt.error_code === '' && receipt.action === 'ADMIN_ACTION_SITE_CONFIG_PUBLISH' && receipt.capability === 'prediction.site.config.publish' && receipt.target_type === 'site_config')
        // The BFF verifies the Go target digest; this layer also strictly binds the full stored target.
        return true
    } catch { return false }
}
export type SiteDispatchResult = {status: 'success'; value: SiteSaveResult} | {status: 'unknown' | 'rejected' | 'superseded'; error: unknown}
const active = new WeakMap<PendingStorage, {pending: SitePending; promise: Promise<SiteDispatchResult>}>()
export function dispatchSitePending(storage: PendingStorage, pending: SitePending, send: (body: SiteSaveBody) => Promise<unknown>): Promise<SiteDispatchResult> {
    const running = active.get(storage)
    if (running) { ensure(same(running.pending, pending), 'PENDING_EXISTS'); return running.promise }
    const stored = readSitePending(storage); ensure(same(stored, pending), 'PENDING_CHANGED')
    const hadAttempt = stored!.attempted, attempt = stored!.attempt + 1
    ensure(Number.isSafeInteger(attempt), 'ATTEMPT_LIMIT')
    storage.setItem(siteStorageKey, JSON.stringify({...stored, attempted: true, attempt}))
    const persisted = readSitePending(storage); ensure(persisted?.attempt === attempt && same(persisted, pending), 'PERSISTENCE_UNAVAILABLE')
    const promise = Promise.resolve().then(async (): Promise<SiteDispatchResult> => {
        try {
            const value = await send(pending.body)
            if (!same(readSitePending(storage), pending)) return {status: 'superseded', error: null}
            if (!validSiteSuccess(value, pending)) return {status: 'unknown', error: Error('INVALID_RECEIPT')}
            clear(storage, pending)
            return {status: 'success', value}
        } catch (error) {
            const current = readSitePending(storage)
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
export async function dispatchSitePendingWithRefresh(storage: PendingStorage, pending: SitePending, send: (body: SiteSaveBody) => Promise<unknown>, read: (body: SiteSaveBody) => Promise<SiteConfigRead>) {
    const result = await dispatchSitePending(storage, pending, send)
    if (result.status !== 'success') return result
    try { return {...result, latest: await read(pending.body), refreshFailed: false} }
    catch { return {...result, latest: null, refreshFailed: true} }
}
