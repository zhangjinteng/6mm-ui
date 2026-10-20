import { PositionRow } from '../position-table';
import { LiquidationWarningRules, LiquidationWarningTableProps } from './types';
declare const __VLS_export: <Row extends PositionRow = PositionRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & __VLS_PrettifyLocal<LiquidationWarningTableProps<Row> & {
        "onRules-loaded"?: ((rules: LiquidationWarningRules) => any) | undefined;
        "onRules-saved"?: ((rules: LiquidationWarningRules) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import('vue').ShallowUnwrapRef<{
        reload: () => Promise<void>;
    }>) => void;
    attrs: any;
    slots: {
        [x: string]: ((props: any) => any) | undefined;
    } & {
        'query-actions'?: (props: {
            disabled: boolean;
            loading: boolean;
            query: () => void;
            queryText: string;
            reset: () => void;
            resetText: string;
            showReset: boolean;
            size: import('../..').FormControlSize;
            value: import('..').QueryBarValue;
        }) => any;
    } & {
        'cell-warning_level'?: (props: any) => any;
    };
    emit: ((evt: "rules-loaded", rules: LiquidationWarningRules) => void) & ((evt: "rules-saved", rules: LiquidationWarningRules) => void);
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
