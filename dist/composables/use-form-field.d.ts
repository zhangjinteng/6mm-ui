import { MaybeRefOrGetter } from 'vue';
import { FormControlSize, FormControlStatus } from '../shared/form';
export interface UseFormFieldOptions {
    disabled?: MaybeRefOrGetter<boolean | undefined>;
    id?: MaybeRefOrGetter<string | undefined>;
    size?: MaybeRefOrGetter<FormControlSize | undefined>;
    status?: MaybeRefOrGetter<FormControlStatus | undefined>;
}
export declare function useFormField(options?: UseFormFieldOptions): {
    describedBy: import('vue').ComputedRef<string | undefined>;
    disabled: import('vue').ComputedRef<boolean>;
    form: import('..').FormContext | null;
    formItem: import('..').FormItemContext | null;
    id: import('vue').ComputedRef<string>;
    labelledBy: import('vue').ComputedRef<string | undefined>;
    onBlur: () => Promise<boolean> | undefined;
    onChange: () => Promise<boolean> | undefined;
    size: import('vue').ComputedRef<FormControlSize>;
    status: import('vue').ComputedRef<FormControlStatus | undefined>;
};
