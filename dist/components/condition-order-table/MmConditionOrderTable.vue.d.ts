import { ConditionOrderTablePresetProps } from './types';
type __VLS_Props = ConditionOrderTablePresetProps;
declare var __VLS_11: string, __VLS_12: any;
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_11>]?: (props: typeof __VLS_12) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {
    reload: () => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    fillHeight: boolean;
    showUserType: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
