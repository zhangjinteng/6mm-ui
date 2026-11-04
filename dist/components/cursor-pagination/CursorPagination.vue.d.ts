import { CursorPaginationProps } from './types';
declare const __VLS_export: import('vue').DefineComponent<CursorPaginationProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    next: () => any;
    prev: () => any;
}, string, import('vue').PublicProps, Readonly<CursorPaginationProps> & Readonly<{
    onNext?: (() => any) | undefined;
    onPrev?: (() => any) | undefined;
}>, {
    loading: boolean;
    size: import('..').PaginationSize;
    disabled: boolean;
    currentPage: number;
    hasMore: boolean;
    hasPrevious: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
