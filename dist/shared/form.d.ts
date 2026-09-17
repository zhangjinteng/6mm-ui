import { ComputedRef, InjectionKey, Ref } from 'vue';
export type FormControlSize = 'sm' | 'md' | 'lg';
export type FormControlStatus = 'error' | 'success' | 'warning';
export type FormLabelPosition = 'left' | 'right' | 'top';
export type FormValidateState = '' | 'validating' | 'success' | 'error';
export type FormValidateTrigger = 'blur' | 'change' | 'submit';
export type FormModel = Record<string, unknown>;
export type FormValidatorResult = boolean | string | Error | void;
export type FormValidator = (value: unknown, model: FormModel) => FormValidatorResult | Promise<FormValidatorResult>;
export interface FormRule {
    len?: number;
    max?: number;
    message?: string;
    min?: number;
    pattern?: RegExp;
    required?: boolean;
    trigger?: FormValidateTrigger | FormValidateTrigger[];
    validator?: FormValidator;
}
export type FormRules = Record<string, FormRule | FormRule[]>;
export interface FormItemContext {
    clearValidate: () => void;
    errorId: string;
    inputId: string;
    labelId: string;
    prop?: string;
    resetField: () => void;
    scrollIntoView: (options?: ScrollIntoViewOptions) => void;
    validate: (trigger?: FormValidateTrigger) => Promise<boolean>;
    validateMessage: Ref<string>;
    validateState: Ref<FormValidateState>;
}
export interface FormContext {
    addField: (field: FormItemContext) => void;
    disabled: ComputedRef<boolean>;
    labelPosition: ComputedRef<FormLabelPosition>;
    labelWidth: ComputedRef<number | string | undefined>;
    model: ComputedRef<FormModel>;
    removeField: (field: FormItemContext) => void;
    rules: ComputedRef<FormRules>;
    showMessage: ComputedRef<boolean>;
    size: ComputedRef<FormControlSize>;
}
export declare const formContextKey: InjectionKey<FormContext>;
export declare const formItemContextKey: InjectionKey<FormItemContext>;
export declare function getPathValue(source: unknown, path?: string): unknown;
export declare function setPathValue(source: FormModel, path: string, value: unknown): void;
export declare function cloneFormValue<T>(value: T): T;
