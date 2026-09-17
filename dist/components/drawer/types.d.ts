import { DialogBeforeClose } from '../dialog';
export type DrawerPlacement = 'bottom' | 'left' | 'right' | 'top';
export interface DrawerProps {
    beforeClose?: DialogBeforeClose;
    closeOnClickModal?: boolean;
    closeOnEscape?: boolean;
    lockScroll?: boolean;
    mask?: boolean;
    modelValue?: boolean;
    placement?: DrawerPlacement;
    showClose?: boolean;
    size?: number | string;
    teleportTo?: string | HTMLElement;
    title?: string;
}
