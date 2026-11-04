import { PredictionGameType, PredictionConfiguration } from './types';
type __VLS_Props = {
    inline?: boolean;
    externalSave?: boolean;
};
declare function saveConfig(): void;
declare function focusSave(): void;
declare function setEnabled(expectedTarget: string, generation: number, expectedActor: string, value: boolean): boolean;
declare function open(value: PredictionGameType, pair: string, initial?: PredictionConfiguration, create?: boolean): Promise<number | undefined>;
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {
    open: typeof open;
    focusSave: typeof focusSave;
    saveConfig: typeof saveConfig;
    editingState: import('vue').ComputedRef<{
        target: string;
        generation: number;
        actor: string;
        enabled: boolean | undefined;
        roomDurations: string[];
        loading: boolean;
        pending: boolean;
        saving: boolean;
        saveError: string;
        isNew: boolean;
        dirty: boolean;
        ready: boolean;
    }>;
    setEnabled: typeof setEnabled;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    success: (...args: any[]) => void;
    close: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSuccess?: ((...args: any[]) => any) | undefined;
    onClose?: ((...args: any[]) => any) | undefined;
}>, {
    inline: boolean;
    externalSave: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
