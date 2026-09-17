import { ComputedRef, MaybeRefOrGetter, WritableComputedRef } from 'vue';
export interface ControlledState<T> {
    isControlled: ComputedRef<boolean>;
    value: WritableComputedRef<T>;
}
export declare function useControlled<T>(source: MaybeRefOrGetter<T | undefined>, defaultValue: T, onChange?: (value: T) => void): ControlledState<T>;
