import { ProTableCursorPaginationProps } from './types';
declare var __VLS_1: {
    currentPage: number;
    rowCount: number;
};
type __VLS_Slots = {} & {
    summary?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<ProTableCursorPaginationProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    next: () => any;
    prev: () => any;
}, string, import('vue').PublicProps, Readonly<ProTableCursorPaginationProps> & Readonly<{
    onNext?: (() => any) | undefined;
    onPrev?: (() => any) | undefined;
}>, {
    loading: boolean;
    size: import('..').PaginationSize;
    disabled: boolean;
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
    hasPrevious: boolean;
    rowCount: number;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
