export interface OverlayHandle {
    isTopmost: () => boolean;
    release: () => void;
    zIndex: number;
}
export declare function acquireOverlay(baseZIndex?: number): OverlayHandle;
