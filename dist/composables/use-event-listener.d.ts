import { MaybeRefOrGetter, WatchHandle } from 'vue';
export type EventTargetSource = MaybeRefOrGetter<EventTarget | null | undefined>;
export declare function useEventListener<TEvent extends Event = Event>(target: EventTargetSource, type: string, listener: (event: TEvent) => void, options?: AddEventListenerOptions | boolean): WatchHandle;
