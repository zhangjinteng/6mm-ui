import { computed, shallowRef, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter, WritableComputedRef } from 'vue'

export interface ControlledState<T> {
  isControlled: ComputedRef<boolean>
  value: WritableComputedRef<T>
}

export function useControlled<T>(
  source: MaybeRefOrGetter<T | undefined>,
  defaultValue: T,
  onChange?: (value: T) => void,
): ControlledState<T> {
  const internal = shallowRef(defaultValue)
  const isControlled = computed(() => toValue(source) !== undefined)
  const value = computed<T>({
    get() {
      const external = toValue(source)
      return external === undefined ? internal.value : external
    },
    set(nextValue) {
      if (!isControlled.value) internal.value = nextValue
      onChange?.(nextValue)
    },
  })

  return { isControlled, value }
}
