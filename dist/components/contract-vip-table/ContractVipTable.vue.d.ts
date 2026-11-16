import { ContractVipRow, ContractVipTableProps } from './types';
declare var __VLS_9: string, __VLS_10: any, __VLS_13: {
    row: any;
}, __VLS_24: {
    row: any;
};
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_9>]?: (props: typeof __VLS_10) => any;
} & {
    'cell-user_id'?: (props: typeof __VLS_13) => any;
} & {
    'cell-username'?: (props: typeof __VLS_24) => any;
};
declare const __VLS_base: import('vue').DefineComponent<ContractVipTableProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "open-user": (row: ContractVipRow) => any;
}, string, import('vue').PublicProps, Readonly<ContractVipTableProps> & Readonly<{
    "onOpen-user"?: ((row: ContractVipRow) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
