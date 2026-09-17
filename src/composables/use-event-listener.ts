import { toValue, watchEffect } from 'vue'
import type { MaybeRefOrGetter, WatchHandle } from 'vue'

export type EventTargetSource = MaybeRefOrGetter<EventTarget | null | undefined>

export function useEventListener<TEvent extends Event = Event>(
  target: EventTargetSource,
  type: string,
  listener: (event: TEvent) => void,
  options?: AddEventListenerOptions | boolean,
): WatchHandle {
  return watchEffect((onCleanup) => {
    const eventTarget = toValue(target)
    if (!eventTarget) return

    const eventListener = listener as EventListener
    eventTarget.addEventListener(type, eventListener, options)
    onCleanup(() => eventTarget.removeEventListener(type, eventListener, options))
  })
}
