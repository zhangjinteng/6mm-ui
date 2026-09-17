import { AvatarProps } from './types';
declare var __VLS_1: {}, __VLS_3: {};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_1) => any;
} & {
    default?: (props: typeof __VLS_3) => any;
};
declare const __VLS_base: import('vue').DefineComponent<AvatarProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    error: (event: Event) => any;
    load: (event: Event) => any;
}, string, import('vue').PublicProps, Readonly<AvatarProps> & Readonly<{
    onError?: ((event: Event) => any) | undefined;
    onLoad?: ((event: Event) => any) | undefined;
}>, {
    size: import('./types').AvatarSize;
    src: string;
    alt: string;
    fallback: string;
    fit: import('./types').AvatarFit;
    shape: import('./types').AvatarShape;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
