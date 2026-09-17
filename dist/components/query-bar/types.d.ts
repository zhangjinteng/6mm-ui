import { FormControlSize } from '../../shared/form';
import { DateRangeShortcut } from '../date-range-picker';
import { DateRangeValue } from '../date-picker-panel';
import { SegmentedOption, SegmentedValue } from '../segmented';
import { SelectOption, SelectValue } from '../select';
export type QueryBarFieldValue = DateRangeValue | SelectValue | null;
export type QueryBarValue = Record<string, QueryBarFieldValue>;
export type QueryBarCoinOption = SelectOption | string;
export interface QueryBarReturnContext {
    label: string;
    route: string;
}
interface QueryBarFieldBase<TValue extends QueryBarFieldValue> {
    defaultValue?: TValue;
    disabled?: boolean;
    key: string;
    label: string;
    name?: string;
    placeholder?: string;
    width?: number | string;
}
export interface QueryBarKeywordField extends QueryBarFieldBase<string> {
    autocomplete?: string;
    clearable?: boolean;
    maxlength?: number;
    type: 'keyword';
}
export interface QueryBarSelectField extends QueryBarFieldBase<SelectValue> {
    clearable?: boolean;
    filterable?: boolean;
    loading?: boolean;
    options: SelectOption[];
    type: 'select';
}
export interface QueryBarCoinField extends QueryBarFieldBase<string> {
    clearable?: boolean;
    options?: QueryBarCoinOption[];
    type: 'coin';
}
export interface QueryBarDateRangeField extends QueryBarFieldBase<DateRangeValue | null> {
    disabledDate?: (date: string) => boolean;
    format?: string;
    max?: string;
    min?: string;
    shortcuts?: DateRangeShortcut[];
    type: 'date-range';
}
export interface QueryBarSegmentedField extends QueryBarFieldBase<SegmentedValue> {
    block?: boolean;
    options: Array<SegmentedOption | SegmentedValue>;
    type: 'segmented';
}
export type QueryBarField = QueryBarCoinField | QueryBarDateRangeField | QueryBarKeywordField | QueryBarSegmentedField | QueryBarSelectField;
export interface QueryBarProps {
    ariaLabel?: string;
    disabled?: boolean;
    fields?: QueryBarField[];
    loading?: boolean;
    modelValue?: QueryBarValue;
    queryText?: string;
    resetText?: string;
    returnContext?: QueryBarReturnContext;
    showReset?: boolean;
    singleLine?: boolean;
    size?: FormControlSize;
}
export {};
