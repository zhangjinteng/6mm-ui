import { PaginationProps } from './types';
declare const __VLS_export: import('vue').DefineComponent<PaginationProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "current-change": (page: number) => any;
    "size-change": (size: number) => any;
    "update:currentPage": (page: number) => any;
    "update:pageSize": (size: number) => any;
}, string, import('vue').PublicProps, Readonly<PaginationProps> & Readonly<{
    "onCurrent-change"?: ((page: number) => any) | undefined;
    "onSize-change"?: ((size: number) => any) | undefined;
    "onUpdate:currentPage"?: ((page: number) => any) | undefined;
    "onUpdate:pageSize"?: ((size: number) => any) | undefined;
}>, {
    size: import('./types').PaginationSize;
    disabled: boolean;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];
    pagerCount: number;
    showJumper: boolean;
    showSizeChanger: boolean;
    showTotal: boolean;
    total: number;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
