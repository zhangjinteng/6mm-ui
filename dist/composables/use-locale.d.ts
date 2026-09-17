import { ComputedRef, InjectionKey, Ref } from 'vue';
import { MmUILocaleMessages, MmUILocaleName } from '../locales';
export type MmUILocaleSource = MmUILocaleName | Readonly<Ref<MmUILocaleName>>;
export interface MmUILocaleContext {
    locale: ComputedRef<MmUILocaleName>;
    messages: ComputedRef<MmUILocaleMessages>;
}
export declare const mmLocaleKey: InjectionKey<MmUILocaleContext>;
export declare function createMmLocaleContext(source?: MmUILocaleSource): MmUILocaleContext;
export declare function getGlobalMmLocaleContext(): MmUILocaleContext;
export declare function setGlobalMmLocaleContext(context: MmUILocaleContext): void;
export declare function useLocale(): MmUILocaleContext;
