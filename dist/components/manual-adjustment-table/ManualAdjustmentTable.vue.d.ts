import { AccountChangeLogListRequest } from '../account-change-log-table';
import { ManualAdjustmentRow } from './types';
type __VLS_Props = {
    request: AccountChangeLogListRequest<ManualAdjustmentRow>;
};
declare var __VLS_8: any, __VLS_11: {
    row: any;
}, __VLS_20: {
    row: any;
}, __VLS_23: {
    row: any;
}, __VLS_26: {
    row: any;
}, __VLS_124: {
    row: {
        [x: string]: unknown;
        source_name?: string | null | undefined;
        source_type?: "merchant" | "platform" | "white_label" | null | undefined;
        agent_name_parse?: string | null | undefined;
        change_type_parse?: string | null | undefined;
        available_balance_after?: number | string | null | undefined;
        account_type: "contract" | "funding";
        record_key?: string | undefined;
        direction: "inc" | "dec" | "";
        order_no: string;
        ledger_id: string | null;
        flow_id: string | null;
        ledger_sync_status: "pending" | "linked" | "failed";
        operator_id: string | null;
        operator_name: string | null;
        operator_account?: string | null | undefined;
        operator_display_name?: string | null | undefined;
        reason: string | null;
        agent_user_id?: number | string | null | undefined;
        amount?: number | string | null | undefined;
        asset_type?: string | null | undefined;
        change_type?: string | null | undefined;
        created_at?: string | null | undefined;
        id: number | string;
        nice_name?: string | null | undefined;
        platform_user_id?: number | string | null | undefined;
        product_category?: string | null | undefined;
        product_category_name?: string | null | undefined;
        reference_id?: number | string | null | undefined;
        symbol?: string | null | undefined;
        user?: {
            agent_user_id?: number | string | null | undefined;
            nice_name?: string | null | undefined;
            platform_user_id?: number | string | null | undefined;
            user_id?: number | string | null | undefined;
            user_type?: number | string | null | undefined;
            username?: string | null | undefined;
        } | null | undefined;
        user_id?: number | string | null | undefined;
        user_type?: number | string | null | undefined;
        username?: string | null | undefined;
        wallet_balance_after?: number | string | null | undefined;
        wallet_balance_before?: number | string | null | undefined;
    };
};
type __VLS_Slots = {} & {
    'field-keyword'?: (props: typeof __VLS_8) => any;
} & {
    'source-type'?: (props: typeof __VLS_11) => any;
} & {
    uid?: (props: typeof __VLS_20) => any;
} & {
    username?: (props: typeof __VLS_23) => any;
} & {
    asset?: (props: typeof __VLS_26) => any;
} & {
    'source-type'?: (props: typeof __VLS_124) => any;
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
