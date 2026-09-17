import { FormControlSize, FormControlStatus } from '../../shared/form';
export type AutocompleteOption = string | Record<string, unknown>;
export type AutocompleteSource = (query: string, signal: AbortSignal) => AutocompleteOption[] | Promise<AutocompleteOption[]>;
export interface AutocompleteProps {
    clearable?: boolean;
    debounce?: number;
    disabled?: boolean;
    fetchSuggestions?: AutocompleteSource;
    id?: string;
    labelKey?: string;
    minLength?: number;
    modelValue?: string;
    name?: string;
    placeholder?: string;
    readonly?: boolean;
    size?: FormControlSize;
    status?: FormControlStatus;
    suggestions?: AutocompleteOption[];
    valueKey?: string;
}
