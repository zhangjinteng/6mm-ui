import { DatePickerPanelProps, DatePickerValue } from './types';
declare var __VLS_11: {
    cell: import('../..').CalendarCell;
};
type __VLS_Slots = {} & {
    date?: (props: typeof __VLS_11) => any;
};
declare const __VLS_base: import('vue').DefineComponent<DatePickerPanelProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: (value: DatePickerValue) => any;
    "update:modelValue": (value: DatePickerValue) => any;
    "update:displayedMonth": (value: string) => any;
}, string, import('vue').PublicProps, Readonly<DatePickerPanelProps> & Readonly<{
    onSelect?: ((value: DatePickerValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: DatePickerValue) => any) | undefined;
    "onUpdate:displayedMonth"?: ((value: string) => any) | undefined;
}>, {
    modelValue: DatePickerValue;
    compact: boolean;
    disabledDate: (date: string) => boolean;
    displayedMonth: string;
    firstDayOfWeek: 0 | 1;
    max: string;
    min: string;
    selectionMode: import('./types').DateSelectionMode;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
