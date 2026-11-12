import { DateRangeValue } from '../date-picker-panel';
import { DateRangePickerProps, DateRangeShortcut } from './types';
declare const __VLS_export: import('vue').DefineComponent<DateRangePickerProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: DateRangeValue | null) => any;
    clear: () => any;
    "update:modelValue": (value: DateRangeValue | null) => any;
    invalid: (input: string) => any;
}, string, import('vue').PublicProps, Readonly<DateRangePickerProps> & Readonly<{
    onChange?: ((value: DateRangeValue | null) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: DateRangeValue | null) => any) | undefined;
    onInvalid?: ((input: string) => any) | undefined;
}>, {
    modelValue: DateRangeValue | null;
    triggerVariant: import('../date-picker/types').DatePickerTriggerVariant;
    shortcuts: DateRangeShortcut[];
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
