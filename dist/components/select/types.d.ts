import { FormControlSize, FormControlStatus } from '../../shared/form';
export type SelectValue = string | number | boolean;
export interface SelectOption {
    disabled?: boolean;
    label: string;
    value: SelectValue;
}
export type SelectRemoteMethod = (query: string, signal: AbortSignal) => SelectOption[] | Promise<SelectOption[]>;
export interface SelectProps {
    clearable?: boolean;
    disabled?: boolean;
    filterable?: boolean;
    id?: string;
    loading?: boolean;
    max?: number;
    maxTagCount?: number;
    modelValue?: SelectValue | SelectValue[];
    multiple?: boolean;
    name?: string;
    options?: SelectOption[];
    placeholder?: string;
    readonly?: boolean;
    remoteMethod?: SelectRemoteMethod;
    size?: FormControlSize;
    status?: FormControlStatus;
}
