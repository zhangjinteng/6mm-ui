import { ImageExpose, ImageProps } from './types';
declare var __VLS_11: {}, __VLS_13: {};
type __VLS_Slots = {} & {
    placeholder?: (props: typeof __VLS_11) => any;
} & {
    error?: (props: typeof __VLS_13) => any;
};
declare const __VLS_base: import('vue').DefineComponent<ImageProps, ImageExpose, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    error: (event: Event) => any;
    load: (event: Event) => any;
    "preview-close": () => any;
    "preview-open": () => any;
}, string, import('vue').PublicProps, Readonly<ImageProps> & Readonly<{
    onError?: ((event: Event) => any) | undefined;
    onLoad?: ((event: Event) => any) | undefined;
    "onPreview-close"?: (() => any) | undefined;
    "onPreview-open"?: (() => any) | undefined;
}>, {
    width: number | string;
    height: number | string;
    alt: string;
    lazy: boolean;
    fit: import('./types').ImageFit;
    preview: boolean;
    previewSrcList: string[];
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
