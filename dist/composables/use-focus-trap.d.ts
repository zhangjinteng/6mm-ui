import { MaybeRefOrGetter, Ref } from 'vue';
import { ElementSource } from './use-click-outside';
export interface FocusTrapOptions {
    escapeDeactivates?: boolean;
    initialFocus?: ElementSource;
    onEscape?: (event: KeyboardEvent) => void;
    returnFocus?: boolean;
}
export interface FocusTrap {
    activate: () => void;
    deactivate: (restoreFocus?: boolean) => void;
    isActive: Ref<boolean>;
}
export declare function useFocusTrap(container: MaybeRefOrGetter<HTMLElement | null | undefined>, options?: FocusTrapOptions): FocusTrap;
