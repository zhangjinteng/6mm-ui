import { DatePickerValue } from '../date-picker-panel';
import { DatePickerProps } from './types';
declare var __VLS_32: {
    value: string | [string, string] | null;
    close: () => boolean;
}, __VLS_43: {
    value: string | [string, string] | null;
    close: () => boolean;
};
type __VLS_Slots = {} & {
    'panel-before'?: (props: typeof __VLS_32) => any;
} & {
    'panel-after'?: (props: typeof __VLS_43) => any;
};
declare const __VLS_base: import('vue').DefineComponent<DatePickerProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: DatePickerValue) => any;
    clear: () => any;
    "update:modelValue": (value: DatePickerValue) => any;
    invalid: (input: string) => any;
    "update:open": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<DatePickerProps> & Readonly<{
    onChange?: ((value: DatePickerValue) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: DatePickerValue) => any) | undefined;
    onInvalid?: ((input: string) => any) | undefined;
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    size: import('../..').FormControlSize;
    type: import('./types').DatePickerType;
    status: import('../..').FormControlStatus;
    clearable: boolean;
    disabled: boolean;
    modelValue: DatePickerValue;
    readonly: boolean;
    open: boolean;
    disabledDate: (date: string) => boolean;
    max: string;
    min: string;
    closeOnSelect: boolean;
    editable: boolean;
    format: string;
    panelClass: string;
    panelCompact: boolean;
    panelFloatingClass: string;
    panelWidth: number | string;
    triggerVariant: import('./types').DatePickerTriggerVariant;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
