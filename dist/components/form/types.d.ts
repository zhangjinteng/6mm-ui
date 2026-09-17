import { FormControlSize, FormLabelPosition, FormModel, FormRule, FormRules } from '../../shared/form';
export interface FormProps {
    disabled?: boolean;
    inline?: boolean;
    labelPosition?: FormLabelPosition;
    labelWidth?: number | string;
    model: FormModel;
    rules?: FormRules;
    scrollToError?: boolean;
    showMessage?: boolean;
    size?: FormControlSize;
}
export interface FormItemProps {
    error?: string;
    label?: string;
    labelWidth?: number | string;
    prop?: string;
    required?: boolean;
    rules?: FormRule | FormRule[];
    showMessage?: boolean;
}
export type FormValidateCallback = (valid: boolean, invalidFields: Record<string, string>) => void;
export interface FormExpose {
    clearValidate: (props?: string | string[]) => void;
    resetFields: (props?: string | string[]) => void;
    scrollToField: (prop: string, options?: ScrollIntoViewOptions) => void;
    validate: (callback?: FormValidateCallback) => Promise<boolean>;
    validateField: (props: string | string[], callback?: FormValidateCallback) => Promise<boolean>;
}
