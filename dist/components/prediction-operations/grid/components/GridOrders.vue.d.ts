import { ProTableColumn } from '../../ui';
import { OrderView, PredictionGridAdapter, PredictionPageContext } from '../../types';
type __VLS_Props = {
    view: OrderView;
    adapter: PredictionGridAdapter;
    context: PredictionPageContext;
    showSources?: boolean;
    locale?: string;
    columns?: (defaults: ProTableColumn[]) => ProTableColumn[];
};
declare var __VLS_30: {
    row: any;
};
type __VLS_Slots = {} & {
    'cell-source_type'?: (props: typeof __VLS_30) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
