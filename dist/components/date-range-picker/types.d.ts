import { DatePickerProps } from '../date-picker';
import { DateRangeValue } from '../date-picker-panel';
export type DateRangeShortcut = 'today' | 'yesterday' | 'last7Days' | 'last30Days' | 'thisMonth' | 'lastMonth';
export interface DateRangePickerProps extends Omit<DatePickerProps, 'clearable' | 'closeOnSelect' | 'modelValue' | 'open' | 'panelClass' | 'panelCompact' | 'panelFloatingClass' | 'panelWidth' | 'type'> {
    clearText?: string;
    confirmText?: string;
    modelValue?: DateRangeValue | null;
    shortcuts?: DateRangeShortcut[];
}
