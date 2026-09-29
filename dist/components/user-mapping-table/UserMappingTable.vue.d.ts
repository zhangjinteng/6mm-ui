import { UserMappingRow, UserMappingTableProps } from './types';
declare const __VLS_export: <Row extends UserMappingRow = UserMappingRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & __VLS_PrettifyLocal<UserMappingTableProps<Row>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import('vue').ShallowUnwrapRef<{
        reload: (reason?: import('../..').MmProTableRequestReason) => Promise<void>;
    }>) => void;
    attrs: any;
    slots: {
        [x: string]: ((props: any) => any) | undefined;
    } & {
        'cell-agent_id'?: (props: any) => any;
    } & {
        'cell-mapping_id'?: (props: any) => any;
    } & {
        'cell-username'?: (props: any) => any;
    } & {
        'cell-agent_user_id'?: (props: any) => any;
    } & {
        'cell-user_uid'?: (props: any) => any;
    } & {
        'cell-mapping_status'?: (props: any) => any;
    } & {
        'cell-exception_type'?: (props: any) => any;
    } & {
        'cell-recent_sync_at'?: (props: any) => any;
    };
    emit: {};
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
