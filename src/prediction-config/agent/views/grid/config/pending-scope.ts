import type { OwnerActor } from '../../../api/prediction/owner-types'
import type { PendingStorage } from './model'

/** Preserve merchant journals; white-label accounts use a separate identity namespace. */
export function gridPendingStorage(storage: PendingStorage, actor?: OwnerActor): PendingStorage {
    if (actor?.kind !== 'SITE') return storage
    if (actor.agent_id !== '0' || !/^[1-9][0-9]*$/.test(actor.operator_id) || !/^[1-9][0-9]*$/.test(actor.tenant_id ?? '')) throw Error('INVALID_GRID_ACTOR')
    const prefix = `white-label:${actor.tenant_id}:${actor.operator_id}:`
    return {
        getItem: key => storage.getItem(prefix + key),
        setItem: (key, value) => storage.setItem(prefix + key, value),
        removeItem: key => storage.removeItem(prefix + key)
    }
}
