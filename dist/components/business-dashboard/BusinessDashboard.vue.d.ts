import { DashboardPayload, DashboardPeriod, DashboardPanel } from './model';
type __VLS_Props = {
    request: (period: DashboardPeriod) => Promise<DashboardPayload>;
    view?: string;
};
declare var __VLS_66: {
    panel: DashboardPanel;
};
type __VLS_Slots = {} & {
    chart?: (props: typeof __VLS_66) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:view": (view: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:view"?: ((view: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
