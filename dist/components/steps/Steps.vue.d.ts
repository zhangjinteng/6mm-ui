import { StepItem, StepsProps, StepStatus } from './types';
declare var __VLS_1: {
    index: number;
    item: StepItem;
    status: StepStatus;
}, __VLS_26: {
    index: number;
    item: StepItem;
    status: StepStatus;
}, __VLS_28: {
    index: number;
    item: StepItem;
    status: StepStatus;
};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_1) => any;
} & {
    title?: (props: typeof __VLS_26) => any;
} & {
    description?: (props: typeof __VLS_28) => any;
};
declare const __VLS_base: import('vue').DefineComponent<StepsProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (index: number, item: StepItem) => any;
}, string, import('vue').PublicProps, Readonly<StepsProps> & Readonly<{
    onChange?: ((index: number, item: StepItem) => any) | undefined;
}>, {
    status: Extract<StepStatus, "error" | "process">;
    direction: import('./types').StepsDirection;
    current: number;
    items: StepItem[];
    clickable: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
