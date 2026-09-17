import { MaybeRefOrGetter, Ref } from 'vue';
export interface ScrollLock {
    isLocked: Ref<boolean>;
    lock: () => void;
    unlock: () => void;
}
export declare function useLockScroll(source?: MaybeRefOrGetter<Document | null | undefined>): ScrollLock;
