import { QueryBarValue } from '../query-bar';
import { HandlingFeeConfigActionName, HandlingFeeConfigProps, HandlingFeeConfigRow } from './types';
declare const __VLS_export: <Row extends HandlingFeeConfigRow = HandlingFeeConfigRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & __VLS_PrettifyLocal<HandlingFeeConfigProps<Row> & {
        "onAction-error"?: ((action: HandlingFeeConfigActionName, error: unknown) => any) | undefined;
        "onAction-success"?: ((action: "update" | "delete" | "create", row?: Row | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import('vue').ShallowUnwrapRef<{
        reload: (reason?: import('../..').MmProTableRequestReason) => Promise<void>;
    }>) => void;
    attrs: any;
    slots: {
        'toolbar-actions'?: (props: {
            reload: (reason?: import('../..').MmProTableRequestReason) => Promise<void>;
        }) => any;
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
            value: QueryBarValue;
        }) => any;
    };
    emit: ((evt: "action-error", action: HandlingFeeConfigActionName, error: unknown) => void) & ((evt: "action-success", action: "update" | "delete" | "create", row?: Row | undefined) => void);
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
