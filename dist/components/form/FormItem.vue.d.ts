import { FormRule, FormValidateState, FormValidateTrigger } from '../../shared/form';
import { FormItemProps } from './types';
declare function validate(trigger?: FormValidateTrigger): Promise<boolean>;
declare function clearValidate(): void;
declare function resetField(): void;
declare var __VLS_1: {}, __VLS_3: {};
type __VLS_Slots = {} & {
    label?: (props: typeof __VLS_1) => any;
} & {
    default?: (props: typeof __VLS_3) => any;
};
declare const __VLS_base: import('vue').DefineComponent<FormItemProps, {
    clearValidate: typeof clearValidate;
    resetField: typeof resetField;
    validate: typeof validate;
    validateMessage: import('vue').Ref<string, string>;
    validateState: import('vue').Ref<FormValidateState, FormValidateState>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<FormItemProps> & Readonly<{}>, {
    error: string;
    required: boolean;
    labelWidth: number | string;
    rules: FormRule | FormRule[];
    showMessage: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
