import { SegmentedOption, SegmentedProps, SegmentedValue } from './types';
declare var __VLS_6: {
    option: SegmentedOption;
    selected: boolean;
};
type __VLS_Slots = {} & {
    option?: (props: typeof __VLS_6) => any;
};
declare const __VLS_base: import('vue').DefineComponent<SegmentedProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: SegmentedValue) => any;
    "update:modelValue": (value: SegmentedValue) => any;
}, string, import('vue').PublicProps, Readonly<SegmentedProps> & Readonly<{
    onChange?: ((value: SegmentedValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: SegmentedValue) => any) | undefined;
}>, {
    name: string;
    size: import('./types').SegmentedSize;
    disabled: boolean;
    modelValue: SegmentedValue;
    block: boolean;
    options: Array<SegmentedOption | SegmentedValue>;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
