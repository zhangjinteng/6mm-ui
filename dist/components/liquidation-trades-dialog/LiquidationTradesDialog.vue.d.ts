import { LiquidationTradeIdentifier, LiquidationTradeRow, LiquidationTradeSummaryRow, LiquidationTradesDialogProps } from './types';
declare const __VLS_export: <SummaryRow extends LiquidationTradeSummaryRow = LiquidationTradeSummaryRow, TradeRow extends LiquidationTradeRow = LiquidationTradeRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & __VLS_PrettifyLocal<LiquidationTradesDialogProps<SummaryRow, TradeRow> & {
        "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
        onClosed?: (() => any) | undefined;
        "onOrder-click"?: ((id: LiquidationTradeIdentifier, event: MouseEvent) => any) | undefined;
        "onPosition-click"?: ((id: LiquidationTradeIdentifier, event: MouseEvent) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: {};
    emit: ((evt: "update:modelValue", value: boolean) => void) & ((evt: "closed") => void) & ((evt: "order-click", id: LiquidationTradeIdentifier, event: MouseEvent) => void) & ((evt: "position-click", id: LiquidationTradeIdentifier, event: MouseEvent) => void);
}>) => import('vue').VNode & {
    __ctx?: NonNullable<Awaited<typeof __VLS_setup>>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
