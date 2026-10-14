import { AlertProps } from './types';
declare var __VLS_6: {}, __VLS_8: {};
type __VLS_Slots = {} & {
    title?: (props: typeof __VLS_6) => any;
} & {
    default?: (props: typeof __VLS_8) => any;
};
declare const __VLS_base: import('vue').DefineComponent<AlertProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    close: () => any;
}, string, import('vue').PublicProps, Readonly<AlertProps> & Readonly<{
    onClose?: (() => any) | undefined;
}>, {
    type: import('./types').AlertType;
    title: string;
    center: boolean;
    description: string;
    closable: boolean;
    banner: boolean;
    showIcon: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
