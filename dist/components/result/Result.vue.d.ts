import { ResultProps } from './types';
declare var __VLS_1: {}, __VLS_3: {}, __VLS_5: {}, __VLS_7: {}, __VLS_9: {};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_1) => any;
} & {
    title?: (props: typeof __VLS_3) => any;
} & {
    subtitle?: (props: typeof __VLS_5) => any;
} & {
    default?: (props: typeof __VLS_7) => any;
} & {
    extra?: (props: typeof __VLS_9) => any;
};
declare const __VLS_base: import('vue').DefineComponent<ResultProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<ResultProps> & Readonly<{}>, {
    title: string;
    status: import('./types').ResultStatus;
    subtitle: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
