import { ComputedRef, InjectionKey, Ref } from 'vue';
import { FormControlSize, FormControlStatus } from '../../shared/form';
export type RadioValue = string | number | boolean;
export interface RadioProps {
    button?: boolean;
    disabled?: boolean;
    id?: string;
    label?: string;
    modelValue?: RadioValue;
    name?: string;
    readonly?: boolean;
    size?: FormControlSize;
    status?: FormControlStatus;
    value: RadioValue;
}
export interface RadioGroupProps {
    disabled?: boolean;
    direction?: 'horizontal' | 'vertical';
    id?: string;
    modelValue?: RadioValue;
    name?: string;
    readonly?: boolean;
    size?: FormControlSize;
    status?: FormControlStatus;
}
export interface RadioGroupContext {
    change: (value: RadioValue) => void;
    disabled: ComputedRef<boolean>;
    modelValue: ComputedRef<RadioValue | undefined>;
    move: (current: HTMLInputElement, direction: 1 | -1) => void;
    name: ComputedRef<string>;
    readonly: ComputedRef<boolean>;
    root: Ref<HTMLElement | undefined>;
    size: ComputedRef<FormControlSize>;
    status: ComputedRef<FormControlStatus | undefined>;
}
export declare const radioGroupKey: InjectionKey<RadioGroupContext>;
