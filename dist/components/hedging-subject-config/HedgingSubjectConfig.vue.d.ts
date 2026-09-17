import { SelectOption } from '../select';
import { HedgingSubjectConfigProps, HedgingSubjectConfigRow } from './types';
declare function load(): Promise<void>;
declare const __VLS_export: import('vue').DefineComponent<HedgingSubjectConfigProps, {
    refresh: typeof load;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    detail: (row: HedgingSubjectConfigRow) => any;
}, string, import('vue').PublicProps, Readonly<HedgingSubjectConfigProps> & Readonly<{
    onDetail?: ((row: HedgingSubjectConfigRow) => any) | undefined;
}>, {
    agentOptions: SelectOption[];
    formatDateTime: (value: string) => string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
