import { FormControlSize, FormControlStatus } from '../../shared/form';
export interface InputNumberProps {
    controls?: boolean;
    disabled?: boolean;
    id?: string;
    max?: number;
    min?: number;
    modelValue?: number | null;
    name?: string;
    placeholder?: string;
    precision?: number;
    readonly?: boolean;
    size?: FormControlSize;
    status?: FormControlStatus;
    step?: number;
}
