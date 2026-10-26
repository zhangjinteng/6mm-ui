import { Ref } from 'vue';
export declare function useSymbolOptions(allowed: Ref<boolean>, loader?: (signal?: AbortSignal) => Promise<string[]>, identityKey?: () => string): Ref<string[], string[]>;
