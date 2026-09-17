import { InputProps } from './types';
declare var __VLS_1: {}, __VLS_3: {}, __VLS_5: {}, __VLS_7: {};
type __VLS_Slots = {} & {
    prepend?: (props: typeof __VLS_1) => any;
} & {
    prefix?: (props: typeof __VLS_3) => any;
} & {
    suffix?: (props: typeof __VLS_5) => any;
} & {
    append?: (props: typeof __VLS_7) => any;
};
declare const __VLS_base: import('vue').DefineComponent<InputProps, {
    blur: () => void | undefined;
    focus: () => void | undefined;
    readonly input: HTMLInputElement | undefined;
    select: () => void | undefined;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    input: (event: Event) => any;
    blur: (event: FocusEvent) => any;
    change: (event: Event) => any;
    clear: () => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: string) => any;
}, string, import('vue').PublicProps, Readonly<InputProps> & Readonly<{
    onInput?: ((event: Event) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((event: Event) => any) | undefined;
    onClear?: (() => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    size: import('../..').FormControlSize;
    type: string;
    status: import('../..').FormControlStatus;
    autocomplete: string;
    clearable: boolean;
    disabled: boolean;
    maxlength: number;
    minlength: number;
    modelValue: string | number | null;
    readonly: boolean;
    showCount: boolean;
    showPassword: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
