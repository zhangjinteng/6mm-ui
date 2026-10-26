import { Component } from 'vue';
import { PredictionConfigAdapter, PredictionConfigContext } from './runtime';
type __VLS_Props = {
    adapter: PredictionConfigAdapter;
    context: PredictionConfigContext;
    symbolComponent: Component;
    locale?: string;
    translate?: (key: string) => string;
    hasTranslation?: (key: string) => boolean;
    registerBeforeLeave?: (guard: () => boolean | Promise<boolean>) => void;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    locale: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
