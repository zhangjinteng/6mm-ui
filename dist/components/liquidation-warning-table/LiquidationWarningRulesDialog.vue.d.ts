import { LiquidationWarningRules, LiquidationWarningRulesLoader, LiquidationWarningRulesSaver } from './types';
type __VLS_Props = {
    canEdit: boolean;
    loadRules: LiquidationWarningRulesLoader;
    saveRules?: LiquidationWarningRulesSaver;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {
    open: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    loaded: (rules: LiquidationWarningRules) => any;
    saved: (rules: LiquidationWarningRules) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onLoaded?: ((rules: LiquidationWarningRules) => any) | undefined;
    onSaved?: ((rules: LiquidationWarningRules) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
