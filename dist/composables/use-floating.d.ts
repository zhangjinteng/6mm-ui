import { CSSProperties, ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
export type FloatingSide = 'bottom' | 'left' | 'right' | 'top';
export type FloatingAlignment = 'end' | 'start';
export type FloatingPlacement = FloatingSide | `${FloatingSide}-${FloatingAlignment}`;
export interface FloatingOptions {
    offset?: number;
    placement?: FloatingPlacement;
    viewportPadding?: number;
}
export interface FloatingPosition {
    floatingStyles: ComputedRef<CSSProperties>;
    placement: Ref<FloatingPlacement>;
    update: () => void;
    x: Ref<number>;
    y: Ref<number>;
}
export declare function useFloating(referenceSource: MaybeRefOrGetter<HTMLElement | null | undefined>, floatingSource: MaybeRefOrGetter<HTMLElement | null | undefined>, options?: FloatingOptions): FloatingPosition;
