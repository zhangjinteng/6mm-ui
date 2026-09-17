import { MaybeRefOrGetter } from 'vue';
export type ElementSource = MaybeRefOrGetter<HTMLElement | null | undefined>;
export interface ClickOutsideOptions {
    enabled?: MaybeRefOrGetter<boolean>;
    ignore?: ElementSource[];
}
export declare function useClickOutside(target: ElementSource, handler: (event: PointerEvent) => void, options?: ClickOutsideOptions): import('vue').WatchHandle;
