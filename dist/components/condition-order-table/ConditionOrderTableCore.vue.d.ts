import { QueryBarValue } from '../query-bar';
import { ConditionOrderRow, ConditionOrderTableCoreProps } from './types';
type __VLS_Props = ConditionOrderTableCoreProps;
declare var __VLS_9: any, __VLS_12: any, __VLS_21: any, __VLS_24: any, __VLS_27: any, __VLS_36: any, __VLS_45: any, __VLS_54: any, __VLS_63: any, __VLS_66: any, __VLS_98: string, __VLS_99: any, __VLS_102: {
    disabled: boolean;
    loading: boolean;
    query: () => void;
    queryText: string;
    reset: () => void;
    resetText: string;
    showReset: boolean;
    size: import('../..').FormControlSize;
    value: QueryBarValue;
}, __VLS_105: {};
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_98>]?: (props: typeof __VLS_99) => any;
} & {
    'cell-user_id'?: (props: typeof __VLS_9) => any;
} & {
    'cell-user_type'?: (props: typeof __VLS_12) => any;
} & {
    'cell-condition_id'?: (props: typeof __VLS_21) => any;
} & {
    'cell-symbol'?: (props: typeof __VLS_24) => any;
} & {
    'cell-product_category'?: (props: typeof __VLS_27) => any;
} & {
    'cell-side'?: (props: typeof __VLS_36) => any;
} & {
    'cell-margin_mode'?: (props: typeof __VLS_45) => any;
} & {
    'cell-trigger_status'?: (props: typeof __VLS_54) => any;
} & {
    'cell-quantity'?: (props: typeof __VLS_63) => any;
} & {
    'cell-operation'?: (props: typeof __VLS_66) => any;
} & {
    'query-actions'?: (props: typeof __VLS_102) => any;
} & {
    'toolbar-actions'?: (props: typeof __VLS_105) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {
    reload: (reason?: import('../..').MmProTableRequestReason) => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    ariaLabel: string;
    pageSizes: number[];
    columnsConfigurable: boolean;
    fillHeight: boolean;
    filterDrawerSubtitle: string;
    filterDrawerTitle: string;
    actions: import('./types').ConditionOrderTableActions<ConditionOrderRow>;
    initialPageSize: number;
    showUserType: boolean;
    quantityDisplay: import('./types').ConditionOrderQuantityDisplay;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
