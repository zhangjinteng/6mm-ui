import { CheckboxGroupProps, CheckboxValue } from './types';
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<CheckboxGroupProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: CheckboxValue[]) => any;
    "update:modelValue": (value: CheckboxValue[]) => any;
}, string, import('vue').PublicProps, Readonly<CheckboxGroupProps> & Readonly<{
    onChange?: ((value: CheckboxValue[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: CheckboxValue[]) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: CheckboxValue[];
    readonly: boolean;
    size: import('../..').FormControlSize;
    status: import('../..').FormControlStatus;
    direction: "horizontal" | "vertical";
    max: number;
    min: number;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
