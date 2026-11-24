import { ResetPasswordUser, ResetUserPasswordResult } from './types';
type __VLS_Props = {
    resetPassword: (params: {
        user_id: number | string;
        reason: string;
    }) => Promise<ResetUserPasswordResult>;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {
    open: (row: ResetPasswordUser) => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    success: (result: ResetUserPasswordResult, userId: string | number) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSuccess?: ((result: ResetUserPasswordResult, userId: string | number) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
