import { AutocompleteOption, AutocompleteProps } from './types';
declare var __VLS_21: {
    option: AutocompleteOption;
    index: number;
};
type __VLS_Slots = {} & {
    option?: (props: typeof __VLS_21) => any;
};
declare const __VLS_base: import('vue').DefineComponent<AutocompleteProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: (option: AutocompleteOption) => any;
    error: (error: Error) => any;
    blur: (event: FocusEvent) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: string) => any;
}, string, import('vue').PublicProps, Readonly<AutocompleteProps> & Readonly<{
    onSelect?: ((option: AutocompleteOption) => any) | undefined;
    onError?: ((error: Error) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    size: import('../..').FormControlSize;
    status: import('../..').FormControlStatus;
    clearable: boolean;
    disabled: boolean;
    modelValue: string;
    readonly: boolean;
    debounce: number;
    fetchSuggestions: import('./types').AutocompleteSource;
    labelKey: string;
    minLength: number;
    suggestions: AutocompleteOption[];
    valueKey: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
