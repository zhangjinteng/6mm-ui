import { DecimalConstraint, IntegerConstraint } from './types';
type __VLS_Props = {
    title: string;
    description?: string;
    disabled?: boolean;
    agentLocked?: boolean;
    compact?: boolean;
    field?: 'default_value' | 'maximum_value';
    percentage?: boolean;
    unit?: string;
};
type __VLS_ModelProps = {
    modelValue: DecimalConstraint | IntegerConstraint;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare const __VLS_export: import('vue').DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: DecimalConstraint | IntegerConstraint) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: DecimalConstraint | IntegerConstraint) => any) | undefined;
}>, {
    disabled: boolean;
    field: "default_value" | "maximum_value";
    compact: boolean;
    unit: string;
    percentage: boolean;
    agentLocked: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
