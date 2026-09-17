import { SymbolTagActionName, SymbolTagManagerLabels, SymbolTagManagerProps, SymbolTagRow } from './types';
declare function load(): Promise<void>;
declare const __VLS_export: import('vue').DefineComponent<SymbolTagManagerProps, {
    reload: typeof load;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "action-error": (action: SymbolTagActionName, error: unknown) => any;
    "action-success": (action: "update" | "delete" | "create" | "translation-config", row?: SymbolTagRow | undefined) => any;
}, string, import('vue').PublicProps, Readonly<SymbolTagManagerProps> & Readonly<{
    "onAction-error"?: ((action: SymbolTagActionName, error: unknown) => any) | undefined;
    "onAction-success"?: ((action: "update" | "delete" | "create" | "translation-config", row?: SymbolTagRow | undefined) => any) | undefined;
}>, {
    locale: "en-US" | "zh-CN" | string;
    canCreate: boolean;
    labels: Partial<SymbolTagManagerLabels>;
    canDelete: boolean;
    canUpdate: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
