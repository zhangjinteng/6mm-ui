import { SelectOption, SelectProps, SelectValue } from './types';
declare var __VLS_13: {
    option: SelectOption;
};
type __VLS_Slots = {} & {
    option?: (props: typeof __VLS_13) => any;
};
declare const __VLS_base: import('vue').DefineComponent<SelectProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: SelectValue | SelectValue[]) => any;
    error: (error: Error) => any;
    "update:modelValue": (value: SelectValue | SelectValue[]) => any;
    clear: () => any;
    "visible-change": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<SelectProps> & Readonly<{
    onChange?: ((value: SelectValue | SelectValue[]) => any) | undefined;
    onError?: ((error: Error) => any) | undefined;
    "onUpdate:modelValue"?: ((value: SelectValue | SelectValue[]) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onVisible-change"?: ((value: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    loading: boolean;
    size: import('../..').FormControlSize;
    modelValue: SelectValue | SelectValue[];
    multiple: boolean;
    clearable: boolean;
    readonly: boolean;
    status: import('../..').FormControlStatus;
    options: SelectOption[];
    filterable: boolean;
    max: number;
    maxTagCount: number;
    remoteMethod: import('./types').SelectRemoteMethod;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
