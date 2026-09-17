import { SelectOption, SelectProps, SelectValue } from './types';
declare var __VLS_13: {
    option: SelectOption;
};
type __VLS_Slots = {} & {
    option?: (props: typeof __VLS_13) => any;
};
declare const __VLS_base: import('vue').DefineComponent<SelectProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    error: (error: Error) => any;
    change: (value: SelectValue | SelectValue[]) => any;
    clear: () => any;
    "update:modelValue": (value: SelectValue | SelectValue[]) => any;
    "visible-change": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<SelectProps> & Readonly<{
    onError?: ((error: Error) => any) | undefined;
    onChange?: ((value: SelectValue | SelectValue[]) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: SelectValue | SelectValue[]) => any) | undefined;
    "onVisible-change"?: ((value: boolean) => any) | undefined;
}>, {
    loading: boolean;
    size: import('../..').FormControlSize;
    status: import('../..').FormControlStatus;
    clearable: boolean;
    disabled: boolean;
    modelValue: SelectValue | SelectValue[];
    readonly: boolean;
    multiple: boolean;
    options: SelectOption[];
    max: number;
    filterable: boolean;
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
