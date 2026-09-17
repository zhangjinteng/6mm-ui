import { MaybeRefOrGetter, Ref } from 'vue';
export type RovingFocusOrientation = 'both' | 'horizontal' | 'vertical';
export interface RovingFocusOptions {
    loop?: boolean;
    orientation?: RovingFocusOrientation;
    selector?: string;
}
export interface RovingFocus {
    activeIndex: Ref<number>;
    focusAt: (index: number) => void;
    onKeydown: (event: KeyboardEvent) => void;
    refresh: () => HTMLElement[];
}
export declare function useRovingFocus(container: MaybeRefOrGetter<HTMLElement | null | undefined>, options?: RovingFocusOptions): RovingFocus;
