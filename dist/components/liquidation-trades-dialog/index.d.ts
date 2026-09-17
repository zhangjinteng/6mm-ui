import { App } from 'vue';
export declare const MmLiquidationTradesDialog: (<SummaryRow extends import('./types').LiquidationTradeSummaryRow = import('./types').LiquidationTradeSummaryRow, TradeRow extends import('./types').LiquidationTradeRow = import('./types').LiquidationTradeRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: {
    attrs: any;
    emit: ((evt: "update:modelValue", value: boolean) => void) & ((evt: "closed") => void) & ((evt: "order-click", id: import('./types').LiquidationTradeIdentifier, event: MouseEvent) => void) & ((evt: "position-click", id: import('./types').LiquidationTradeIdentifier, event: MouseEvent) => void);
    slots: {};
}, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & {
        initialPageSize?: number | undefined;
        modelValue: boolean;
        orderTradesHref?: import('./types').LiquidationTradeHrefResolver | undefined;
        pageSizes?: number[] | undefined;
        positionHref?: import('./types').LiquidationTradeHrefResolver | undefined;
        request: import('./types').LiquidationTradeListRequest<TradeRow>;
        row?: SummaryRow | null | undefined;
        "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
        onClosed?: (() => any) | undefined;
        "onOrder-click"?: ((id: import('./types').LiquidationTradeIdentifier, event: MouseEvent) => any) | undefined;
        "onPosition-click"?: ((id: import('./types').LiquidationTradeIdentifier, event: MouseEvent) => any) | undefined;
    } & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: {};
    emit: ((evt: "update:modelValue", value: boolean) => void) & ((evt: "closed") => void) & ((evt: "order-click", id: import('./types').LiquidationTradeIdentifier, event: MouseEvent) => void) & ((evt: "position-click", id: import('./types').LiquidationTradeIdentifier, event: MouseEvent) => void);
}>) => import('vue').VNode & {
    __ctx?: NonNullable<Awaited<typeof __VLS_setup>>;
}) & {
    install(app: App): void;
};
export default MmLiquidationTradesDialog;
export * from './types';
