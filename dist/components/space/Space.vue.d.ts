import { SpaceProps } from './types';
declare var __VLS_13: {};
type __VLS_Slots = {} & {
    separator?: (props: typeof __VLS_13) => any;
};
declare const __VLS_base: import('vue').DefineComponent<SpaceProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<SpaceProps> & Readonly<{}>, {
    size: number | string;
    wrap: boolean;
    separator: string;
    direction: import('./types').SpaceDirection;
    as: string;
    align: import('..').LayoutAlign;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
