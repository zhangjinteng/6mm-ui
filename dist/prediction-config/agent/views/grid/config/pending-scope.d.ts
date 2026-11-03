import { OwnerActor } from '../../../api/prediction/owner-types';
import { PendingStorage } from './model';
/** Preserve merchant journals; white-label accounts use a separate identity namespace. */
export declare function gridPendingStorage(storage: PendingStorage, actor?: OwnerActor): PendingStorage;
