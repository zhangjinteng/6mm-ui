import { QueryBarField, QueryBarFieldValue, QueryBarProps, QueryBarReturnContext, QueryBarValue } from './types';
declare function reset(): void;
declare function query(): void;
declare var __VLS_16: `field-${string}`, __VLS_17: {
    field: QueryBarField;
    value: QueryBarFieldValue;
    update: (value: QueryBarFieldValue) => void;
}, __VLS_61: {
    disabled: boolean;
    loading: boolean;
    query: typeof query;
    queryText: string;
    reset: typeof reset;
    resetText: string;
    showReset: boolean;
    size: import('../..').FormControlSize;
    value: QueryBarValue;
}, __VLS_89: {
    disabled: boolean;
    query: typeof query;
    reset: typeof reset;
    value: QueryBarValue;
};
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_16>]?: (props: typeof __VLS_17) => any;
} & {
    buttons?: (props: typeof __VLS_61) => any;
} & {
    actions?: (props: typeof __VLS_89) => any;
};
declare const __VLS_base: import('vue').DefineComponent<QueryBarProps, {
    query: typeof query;
    reset: typeof reset;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    reset: (value: QueryBarValue) => any;
    change: (value: QueryBarValue, field: QueryBarField, fieldValue: QueryBarFieldValue) => any;
    "update:modelValue": (value: QueryBarValue) => any;
    query: (value: QueryBarValue) => any;
    "return-context": (context: QueryBarReturnContext) => any;
}, string, import('vue').PublicProps, Readonly<QueryBarProps> & Readonly<{
    onReset?: ((value: QueryBarValue) => any) | undefined;
    onChange?: ((value: QueryBarValue, field: QueryBarField, fieldValue: QueryBarFieldValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: QueryBarValue) => any) | undefined;
    onQuery?: ((value: QueryBarValue) => any) | undefined;
    "onReturn-context"?: ((context: QueryBarReturnContext) => any) | undefined;
}>, {
    loading: boolean;
    size: import('../..').FormControlSize;
    disabled: boolean;
    modelValue: QueryBarValue;
    fields: QueryBarField[];
    returnContext: QueryBarReturnContext;
    showReset: boolean;
    singleLine: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
