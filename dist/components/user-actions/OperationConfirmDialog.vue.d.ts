type __VLS_Props = {
    modelValue: boolean;
    title: string;
    subtitle?: string;
    width?: number | string;
    description?: string;
    objectId?: number | string | null;
    confirmText?: string;
    loading?: boolean;
};
declare var __VLS_17: {}, __VLS_24: {}, __VLS_42: {}, __VLS_45: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_17) => any;
} & {
    summary?: (props: typeof __VLS_24) => any;
} & {
    feedback?: (props: typeof __VLS_42) => any;
} & {
    footer?: (props: typeof __VLS_45) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
    closed: () => any;
    confirm: (reason: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onClosed?: (() => any) | undefined;
    onConfirm?: ((reason: string) => any) | undefined;
}>, {
    loading: boolean;
    width: number | string;
    description: string;
    confirmText: string;
    objectId: number | string | null;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
