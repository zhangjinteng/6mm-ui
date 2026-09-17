import { QueryBarField, QueryBarValue } from '../query-bar';
export interface FilterDrawerProps {
    activeCount?: number;
    disabled?: boolean;
    fields?: QueryBarField[];
    loading?: boolean;
    modelValue?: QueryBarValue;
    open?: boolean;
    queryText?: string;
    resetText?: string;
    size?: number | string;
    subtitle?: string;
    title?: string;
    triggerAriaLabel?: string;
    triggerTitle?: string;
}
export interface FilterDrawerExpose {
    close: () => void;
    open: () => void;
    query: () => void;
    reset: () => void;
}
