import { ScrollbarPosition, ScrollbarProps } from './types';
declare function scrollTo(options: ScrollToOptions): void;
declare function setScrollTop(value: number): void;
declare function setScrollLeft(value: number): void;
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<ScrollbarProps, {
    scrollTo: typeof scrollTo;
    setScrollLeft: typeof setScrollLeft;
    setScrollTop: typeof setScrollTop;
    wrapRef: import('vue').Ref<HTMLElement | undefined, HTMLElement | undefined>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    scroll: (position: ScrollbarPosition) => any;
}, string, import('vue').PublicProps, Readonly<ScrollbarProps> & Readonly<{
    onScroll?: ((position: ScrollbarPosition) => any) | undefined;
}>, {
    height: number | string;
    always: boolean;
    maxHeight: number | string;
    tabindex: number;
    viewClass: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
